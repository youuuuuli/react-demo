import React, { useState, useEffect, useContext } from 'react';
import { Input, Label } from 'semantic-ui-react';
import 'rc-calendar/assets/index.css';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import DatePicker from 'rc-calendar/lib/Picker';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import zhTW from 'rc-calendar/lib/locale/zh_TW';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import viVN from 'rc-calendar/lib/locale/vi_VN';
import moment from 'moment-timezone';
import Cookies from 'js-cookie';
import ApiContext from '../default/ApiContext';

/** @typedef {import('Docs/global.d').DateType} DateType */
/** @typedef {import('moment-timezone').Moment} MomentType */

/**
 * @typedef DateRange
 * @property {string=} firstOptional 最早可選時間
 * @property {Function} setRange 時間範圍
 * @property {Function=} onSearch -
 * @property {object=} minDate 限制最早日起
 * @property {object=} maxDate 限制最晚日期
 * @property {string} propsFormat FormatType
 * @property {string=} propsTimezone TimeZone
 * @property {boolean=} required 是否必須
 * @property {MomentType} propsStartDate 開始日期
 * @property {MomentType} propsEndDate 結束日期
 * @property {boolean=} disabled disabled
 * @property {'datetime'| 'date' | undefined} propsDataType DataType
 * @property {boolean=} showSideBar 是否顯示側邊欄
 * @property {boolean=} showTimePicker 是否顯示時間選擇
 * @property {boolean} showClearBtn 顯示清除Icon
 * @property {string} placeholder placeholder
 * @property {boolean} showPlaceHolder 是否顯示placeholder
 * @property {object=} customSideBar 自定義選用側邊欄 ps:需先有defaultRanges預設
 */

/**
 * 日期選擇器
 *
 * @param {DateRange} props 帶入參數
 * @returns {Element} 日期選擇器El
 */
const DateRange = (props) => {
  const { tr } = useContext(ApiContext);

  const {
    firstOptional,
    setRange,
    onSearch,
    minDate,
    maxDate,
    format: propsFormat,
    timezone: propsTimezone,
    required = true,
    startDate: propsStartDate,
    endDate: propsEndDate,
    disabled: propsDisabled,
    'data-type': propsDataType,
    permEdit = true,
    showSideBar = true,
    showTimePicker = true,
    showClearBtn = false,
    placeholder,
    showPlaceHolder = false,
    customSideBar,
  } = props;

  const formatVal = propsFormat || 'YYYY-MM-DD';
  const timezone = propsTimezone || 'Etc/GMT+4';

  const localeMap = {
    'zh-tw': zhTW,
    'zh-cn': zhCN,
    vi: viVN,
  };

  const lang = Cookies.get('lang') || 'zh-tw';
  const locale = localeMap[lang];

  const defaultRange = {
    startDate: moment()
      .tz(timezone)
      .add(-6, 'days')
      .format(),
    endDate: moment().tz(timezone).format(),
  };

  const now = moment().tz(timezone).startOf('day');
  const defaultRanges = {
    [tr('M_TEXT_TODAY')]: {
      startDate: now.clone().startOf('day'),
      endDate: now.clone().endOf('day'),
    },
    [tr('M_TEXT_YESTERDAY')]: {
      startDate: now.clone().subtract(1, 'days').startOf('day'),
      endDate: now.clone().subtract(1, 'days').endOf('day'),
    },
    [tr('COMMON_TEXT_LAST_7_DAY')]: {
      startDate: now.clone().add(-6, 'days'),
      endDate: now.clone().endOf('day'),
    },
    [tr('COMMON_TEXT_LAST_WEEK')]: {
      startDate: now.clone().add(-7, 'days').startOf('isoWeek'),
      endDate: now.clone().add(-7, 'days').endOf('isoWeek'),
    },
    [tr('COMMON_TEXT_THIS_WEEK')]: {
      startDate: now.clone().startOf('isoWeek'),
      endDate: now.clone().endOf('isoWeek'),
    },
    [tr('COMMON_TEXT_LAST_30_DAY')]: {
      startDate: now.clone().add(-29, 'days'),
      endDate: now.clone().endOf('day'),
    },
    [tr('COMMON_TEXT_LAST_MONTH')]: {
      startDate: now.clone().subtract(1, 'month').startOf('month'),
      endDate: now.clone().subtract(1, 'month').endOf('month'),
    },
    [tr('COMMON_TEXT_THIS_MONTH')]: {
      startDate: now.clone().startOf('month'),
      endDate: now.clone().endOf('month'),
    },
  };

  let tempStartDate = propsStartDate || '';
  let tempEndDate = propsEndDate || '';

  if (required) {
    tempStartDate = moment.tz(tempStartDate || defaultRange.startDate, timezone);
    tempEndDate = moment.tz(tempEndDate || defaultRange.endDate, timezone);
  }

  const [startDate, setStartDate] = useState(tempStartDate);
  const [endDate, setEndDate] = useState(tempEndDate);

  let timePicker = null;

  if (propsDataType === 'datetime') {
    const start = moment.tz(timezone).startOf('day');
    const end = moment.tz(timezone).endOf('day');
    timePicker = (
      <TimePickerPanel
        defaultValue={[start, end]}
        showMinute={!props['data-hidden-minute']}
        showSecond={!props['data-hidden-second']}
      />
    );
  }

  useEffect(() => {
    let chkStartDate = startDate;
    let chkEndDate = endDate;

    if (chkStartDate) {
      chkStartDate = chkStartDate.format();
    }

    if (chkEndDate) {
      chkEndDate = chkEndDate.format();
    }

    if (chkStartDate !== moment(propsStartDate).format()) {
      let sd = propsStartDate || '';

      if (sd) {
        sd = moment(sd).tz(timezone);
      }

      if (required && !sd) {
        sd = moment().tz(timezone);
      }

      setStartDate(sd);
    }

    if (chkEndDate !== moment(propsEndDate).format()) {
      let ed = props.endDate || '';

      if (ed) {
        ed = moment(ed).tz(timezone);
      }

      if (required && !ed) {
        ed = moment().tz(timezone);
      }

      setEndDate(ed);
    }
  }, [propsStartDate, propsEndDate]);

  /**
   * 直接點選快速鍵
   *
   * @param {Event} ev ev
   * @param {{
   * 'data-text': 'string'
   * }} rangeText 區間
   */
  const onRangeSelect = (ev, { 'data-text': text }) => {
    onChange([
      defaultRanges[text].startDate,
      defaultRanges[text].endDate,
    ]);
  };

  /**
   * 顯示快速選單
   *
   * @returns {Element} 快速選單Element
   */
  const renderSidebar = () => {
    let newDefaultRanges = defaultRanges;

    if (customSideBar) {
      newDefaultRanges = Object.keys(defaultRanges).reduce((acc, key) => {
        if (customSideBar.includes(key)) {
          acc[key] = newDefaultRanges[key];
        }

        return acc;
      }, {});
    }

    return (
      <div key="sidebar" className="clearfix calendar-sidebar">
        {Object.keys(newDefaultRanges).map((text) => (
          <Label
            className="calendar-sidebar-block"
            style={{ cursor: 'pointer' }}
            key={text}
            onClick={onRangeSelect}
            data-text={text}
            content={text}
          />
        ))}
      </div>
    );
  };

  /**
   * 異動日期
   *
   * @param {Array<MomentType>} value { startDate,endDate }
   */
  const onChange = (value) => {
    let sd = '';
    let ed = '';

    if (required && (!value[0] || !value[1])) {
      return;
    }

    if (value.length !== 0) {
      sd = value[0].tz(timezone);
      ed = value[1].tz(timezone);
    }

    /** @type {DateType} */
    const ret = {
      startDate: sd,
      endDate: ed,
    };

    (async () => {
      await setRange(ret);

      if (onSearch) {
        await onSearch();
      }
    })();
  };

  /**
   * 判斷當天是否可選
   *
   * @param {Date} current 當天日期
   * @returns {boolean} 日期當天是否disabled
   */
  const disabledDate = (current) => {
    if (!current) {
      return false;
    }

    if (firstOptional && current.valueOf() < firstOptional.valueOf()) {
      return true;
    }

    if (minDate && current.valueOf() < minDate.valueOf()) {
      return true;
    }

    if (maxDate && current.valueOf() > maxDate.valueOf()) {
      return true;
    }

    return false;
  };

  /**
   * 處理清除Icon
   */
  const handleClear = () => {
    const ret = { startDate: '', endDate: '' };

    setRange(ret);
  };

  const calendar = (
    <RangeCalendar
      className={`clearfix ${!showSideBar ? 'hide-sidebar' : ''}`}
      type="both"
      format={formatVal}
      locale={locale}
      renderSidebar={showSideBar ? renderSidebar : () => null}
      timePicker={showTimePicker ? timePicker : null}
      showToday={false}
      disabledDate={disabledDate}
      onClear={handleClear}
      showClear={showClearBtn}
    />
  );

  const dateValue = (val) => val && val.tz(timezone).format(formatVal);

  let inputValue = '';

  if (showPlaceHolder) {
    inputValue = '';
  }

  if (!showPlaceHolder) {
    inputValue = (dateValue(startDate) === 'Invalid date' || dateValue(endDate) === 'Invalid date')
      ? tr('M_TEXT_PLEASE_CHOOSE')
      : `${dateValue(startDate)} ~ ${dateValue(endDate)}`;
  }

  return (
    <DatePicker
      animation="slide-up"
      onChange={onChange}
      calendar={calendar}
      value={[startDate || moment().tz(timezone), endDate || moment().tz(timezone)]}
    >
      {() => (
        <Input
          id="date"
          data-testid="date"
          className={timePicker ? 'calendar-block' : 'calendar-block date-only'}
          name="date_range"
          icon="calendar"
          iconPosition="left"
          readOnly
          disabled={propsDisabled || !permEdit}
          placeholder={placeholder}
          value={inputValue}
        />
      )}
    </DatePicker>
  );
};

export default DateRange;
