import React, { useContext } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import ApiContext from '../default/ApiContext';
import {
  classNames,
  decimal,
  moment,
  sprintf,
  querystring,
  windowOpen,
} from '../utils';
import styles from '../../css/DailyReportRate.module.css';
import DF from './date_format.json';

/**
 * @typedef ColumnsType 表格每一欄定義
 * @property {string} key 表格欄位
 * @property {string} title 表格標題
 * @property {Function | string} cellClass 渲染樣式名稱
 * @property {Function} render 渲染表格
 */

/**
 * @typedef RetType 回傳內容
 * @property {string} day 日期
 * @property {string} date 日期星期
 * @property {string} created 新進會員
 * @property {boolean} isPercent 數據呈現：留存率、留存人數
 * @property {boolean} toColorClassName 是否呈現表格色階說明
 * @property {boolean} isResultCell 是否為搜尋結果欄位
 */

const basicFelids = ['date', 'created'];
const period = {
  day: [...Array.from({ length: 7 }, (_, i) => i + 1), 14, 30],
  week: [...Array.from({ length: 8 }, (_, i) => i + 1), 12],
  month: Array.from({ length: 6 }, (_, i) => i + 1),
};

const useRetentionRateLogin = () => {
  const { tr } = useContext(ApiContext);
  const permUserInfoDetail = true;

  /**
   * 處理點擊連結
   *
   * @param {Event} e event
   * @param {{
   * 'data-created-date': string,
   * 'data-start-login-at': string,
   * 'data-end-login-at': string
   * }} params params
   */
  const handleOnClick = (e, {
    'data-created-date': date,
    'data-start-login-at': startLoginAt,
    'data-end-login-at': endLoginAt,
  }) => {
    // 前往全部會員 - 會員查詢
    const query = {
      name: 'user_info_detail',
      start_created_at: moment.tz(date, 'Etc/GMT+4').startOf('day').format(),
      end_created_at: moment.tz(date, 'Etc/GMT+4').endOf('day').format(),
    };

    if (startLoginAt && endLoginAt) {
      query.start_login_at = moment.tz(startLoginAt, 'Etc/GMT+4')
        .startOf('day')
        .format();
      query.end_login_at = moment.tz(endLoginAt, 'Etc/GMT+4')
        .endOf('day')
        .format();
    }

    windowOpen(`/player/all?${querystring.stringify(query)}`);
  };

  /**
   * 渲染新進會員項目
   *
   * @param {RetType} initData 表格資料
   * @returns {JSX.Element | string} CreatedCell
   */
  const renderCreatedCell = (initData) => {
    const { created, day, isResultCell } = initData;

    if (isResultCell) {
      return created;
    }

    return permUserInfoDetail ? (
      <Button
        as="a"
        content={created}
        data-created-date={day}
        onClick={handleOnClick}
      />
    ) : created;
  };

  /**
   * 渲染表格項目
   *
   * @param {RetType} initData 表格資料
   * @param {string} key 表格項目
   * @returns {JSX.Element | string} ContentCell
   */
  const renderContentCell = (initData, key) => {
    const { day, isPercent, isResultCell } = initData;
    const content = initData[key];

    if (!isResultCell && !content) {
      return content;
    }

    const contentText = isPercent ? decimal(content, 2, '%') : content;

    if (isResultCell || !content) {
      return contentText;
    }

    const [type, index] = key.split('_');

    const startDate = moment(day)
      .subtract(index * -1 + 1, `${type}s`)
      .add(2, 'days')
      .tz('Etc/GMT+4')
      .startOf('day');
    const endDate = moment(day)
      .subtract(index * -1, `${type}s`)
      .add(1, 'days')
      .tz('Etc/GMT+4')
      .endOf('day');

    const isInProgress = moment().tz('Etc/GMT+4').isBetween(startDate, endDate);

    return (
      <>
        <Popup
          basic
          trigger={(!Number(content) || !permUserInfoDetail)
            ? <span>{contentText}</span>
            : (
              <Button
                as="a"
                content={contentText}
                data-created-date={day}
                data-start-login-at={startDate.format(DF.date)}
                data-end-login-at={endDate.format(DF.date)}
                onClick={handleOnClick}
              />
            )}
        >
          <span>
            {tr('M_RETENTION_STATS_PERIOD')}
            {` ${startDate.format(DF.dateshift)}-${endDate.format(DF.dateshift)}`}
            {isInProgress && (
              <font className="basic-red">
                <font className="basic-red">{` (${tr('M_TEXT_STATUS_ACTIVE')}) `}</font>
              </font>
            )}
          </span>
        </Popup>
        {isInProgress && (
          <span className={styles.progress}>※</span>
        )}
      </>
    );
  };

  /**
   * 渲染表格樣式
   *
   * @param {boolean} isResultCell 是否為搜尋結果欄位
   * @returns {'result-cell'} ClassName
   */
  const handleResultClassNames = (isResultCell) => classNames({
    'result-cell': isResultCell,
  });

  /** @type {Array<ColumnsType>} 前兩個表格欄 */
  const basicColumns = [
    {
      key: basicFelids[0],
      title: tr('M_TEXT_CREATED_DAY'),
      cellClass: ({ isResultCell: r }) => handleResultClassNames(r),
    },
    {
      key: basicFelids[1],
      title: tr('M_DASHBOARD_NEW_PLAYERS'),
      cellClass: ({ isResultCell: r }) => handleResultClassNames(r),
      render: (c) => renderCreatedCell(c),
    },
  ];

  /** @type {Array<ColumnsType>} 日-表格欄 */
  const dayColumns = period.day.map((d) => ({
    key: `day_${d}`,
    title: d === 1 ? tr('M_TEXT_NEXT_DAY') : sprintf(tr('M_TEXT_DAY_AFTER'), d),
    cellClass: ({ isResultCell: r }) => handleResultClassNames(r),
    render: (data) => renderContentCell(data, `day_${d}`),
  }));

  /** @type {Array<ColumnsType>} 週-表格欄 */
  const weekColumns = period.week.map((w) => ({
    key: `week_${w}`,
    title: sprintf(tr('M_TEXT_WEEK_AFTER'), w),
    cellClass: ({ isResultCell: r }) => handleResultClassNames(r),
    render: (data) => renderContentCell(data, `week_${w}`),
  }));

  /** @type {Array<ColumnsType>} 月-表格欄 */
  const monthColumns = period.month.map((m) => ({
    key: `month_${m}`,
    title: sprintf(tr('M_TEXT_MONTH_AFTER'), m),
    cellClass: ({ isResultCell: r }) => handleResultClassNames(r),
    render: (data) => renderContentCell(data, `month_${m}`),
  }));

  const rules = {
    affix: '%s%',
    pr: { '^%': '', '--%': '--' },
  };

  const periodMap = {
    day: {
      basicColumns: dayColumns,
      columns: [...basicColumns, ...dayColumns],
      customRows: {
        percent: [{
          day: tr('M_TEXT_AMOUNT_AVERAGE'),
          created: 'total.percent.created',
          day_1: 'total.percent.day_1',
          day_2: 'total.percent.day_2',
          day_3: 'total.percent.day_3',
          day_4: 'total.percent.day_4',
          day_5: 'total.percent.day_5',
          day_6: 'total.percent.day_6',
          day_7: 'total.percent.day_7',
          day_14: 'total.percent.day_14',
          day_30: 'total.percent.day_30',
        }],
        number: [{
          day: tr('M_TEXT_RESULT_SUB_TOTAL_AMOUNT'),
          created: 'total.number.created',
          day_1: 'total.number.day_1',
          day_2: 'total.number.day_2',
          day_3: 'total.number.day_3',
          day_4: 'total.number.day_4',
          day_5: 'total.number.day_5',
          day_6: 'total.number.day_6',
          day_7: 'total.number.day_7',
          day_14: 'total.number.day_14',
          day_30: 'total.number.day_30',
        }],
      },
      rowsOpt: {
        percent: [
          { field: 'day', sub_field: 'percent', to_string: true },
          { field: 'created' },
          ...period.day.map((d) => ({
            field: `day_${d}`,
            affix: rules.affix,
            pattern_replace: rules.pr,
          })),
        ],
        number: [
          { field: 'day', sub_field: 'number', to_string: true },
          { field: 'created' },
          ...period.day.map((d) => ({ field: `day_${d}` })),
        ],
      },
      text: tr('M_RETENTION_DAY'),
    },
    week: {
      basicColumns: weekColumns,
      columns: [...basicColumns, ...weekColumns],
      customRows: {
        percent: [{
          day: tr('M_TEXT_AMOUNT_AVERAGE'),
          created: 'total.percent.created',
          week_1: 'total.percent.week_1',
          week_2: 'total.percent.week_2',
          week_3: 'total.percent.week_3',
          week_4: 'total.percent.week_4',
          week_5: 'total.percent.week_5',
          week_6: 'total.percent.week_6',
          week_7: 'total.percent.week_7',
          week_8: 'total.percent.week_8',
          week_12: 'total.percent.week_12',
        }],
        number: [{
          day: tr('M_TEXT_RESULT_SUB_TOTAL_AMOUNT'),
          created: 'total.number.created',
          week_1: 'total.number.week_1',
          week_2: 'total.number.week_2',
          week_3: 'total.number.week_3',
          week_4: 'total.number.week_4',
          week_5: 'total.number.week_5',
          week_6: 'total.number.week_6',
          week_7: 'total.number.week_7',
          week_8: 'total.number.week_8',
          week_12: 'total.number.week_12',
        }],
      },
      rowsOpt: {
        percent: [
          { field: 'day', sub_field: 'percent', to_string: true },
          { field: 'created' },
          ...period.week.map((w) => ({
            field: `week_${w}`,
            affix: rules.affix,
            pattern_replace: rules.pr,
          })),
        ],
        number: [
          { field: 'day', sub_field: 'number', to_string: true },
          { field: 'created' },
          ...period.week.map((w) => ({ field: `week_${w}` })),
        ],
      },
      text: tr('M_RETENTION_WEEK'),
    },
    month: {
      basicColumns: monthColumns,
      columns: [...basicColumns, ...monthColumns],
      customRows: {
        percent: [{
          day: tr('M_TEXT_AMOUNT_AVERAGE'),
          created: 'total.percent.created',
          month_1: 'total.percent.month_1',
          month_2: 'total.percent.month_2',
          month_3: 'total.percent.month_3',
          month_4: 'total.percent.month_4',
          month_5: 'total.percent.month_5',
          month_6: 'total.percent.month_6',
        }],
        number: [{
          day: tr('M_TEXT_RESULT_SUB_TOTAL_AMOUNT'),
          created: 'total.number.created',
          month_1: 'total.number.month_1',
          month_2: 'total.number.month_2',
          month_3: 'total.number.month_3',
          month_4: 'total.number.month_4',
          month_5: 'total.number.month_5',
          month_6: 'total.number.month_6',
        }],
      },
      rowsOpt: {
        percent: [
          { field: 'day', sub_field: 'percent', to_string: true },
          { field: 'created' },
          ...period.month.map((m) => ({
            field: `month_${m}`,
            affix: rules.affix,
            pattern_replace: rules.pr,
          })),
        ],
        number: [
          { field: 'day', sub_field: 'number', to_string: true },
          { field: 'created' },
          ...period.month.map((m) => ({ field: `month_${m}` })),
        ],
      },
      text: tr('M_RETENTION_MONTH'),
    },
  };

  return periodMap;
};

export const useRetentionRateLoginTypes = () => {
  const { tr } = useContext(ApiContext);

  return {
    percent: {
      text: tr('M_USER_RETENTION_RATE'),
    },
    number: {
      text: tr('M_USER_RETENTION_NUMBER'),
    },
  };
};

export default useRetentionRateLogin;
