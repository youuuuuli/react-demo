import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Icon,
  List,
  Loader,
  Menu,
  Popup,
} from 'semantic-ui-react';
import DF from '../constants/date_format.json';
import initPagination from '../constants/InitPagination';
import useRetentionRateLogin, { useRetentionRateLoginTypes } from '../constants/useRetentionRateLogin';
import ApiContext from '../default/ApiContext';
import styles from '../../css/DailyReportRate.module.css';
import { DateRange, Pagination, moment } from '../utils';
import TableOs from '../components/TableOs';
import RetentionRateLoginCharts from './RetentionRateLoginCharts';
import { getUserRetentionRet } from '../response';

/**
 * @typedef SearchFormType 定義搜尋條件
 * @property {'percent' | 'number'} type 資料類型
 * @property {'day' | 'week' | 'month'} period 時間類型
 * @property {string} start_at 開始日期
 * @property {string} end_at 結束日期
 */

const RetentionRateLogin = () => {
  const { tr } = useContext(ApiContext);
  const PeriodMap = useRetentionRateLogin();
  const ReportTypes = useRetentionRateLoginTypes();

  /** @type {SearchFormType} 初始搜尋條件 */
  const initSearchForm = {
    type: Object.keys(ReportTypes)[0],
    // 預設顯示：週(week)
    period: Object.keys(PeriodMap)[1],
    // 預設顯示：上個月1號至7號
    start_at: moment()
      .subtract(1, 'month')
      .startOf('month')
      .subtract(-1, 'days')
      .tz('Etc/GMT+4')
      .startOf('day')
      .format(),
    end_at: moment()
      .subtract(1, 'month')
      .startOf('month')
      .subtract(-7, 'days')
      .tz('Etc/GMT+4')
      .endOf('day')
      .format(),
  };

  /** @type {RetentionRateLoginType} 初始登入留存率資料 */
  const initRetentionRateLogin = {
    ret: { percent: [], number: [] },
    sub_total: { percent: {}, number: {} },
    total: { percent: {}, number: {} },
  };

  // 開啟/關閉說明文字
  const [activeExplanation, setActiveExplanation] = useState(false);
  // 登入留存率資料
  const [data, setData] = useState(initRetentionRateLogin);
  // 下載中
  const [loading, setLoading] = useState(false);
  // 分頁資料
  const [pagination, setPagination] = useState(initPagination);
  // 時間類型
  const [period, setPeriod] = useState(initSearchForm.period);
  // 搜尋條件
  const [searchForm, setSearchForm] = useState(initSearchForm);
  // 資料類型
  const [type, setType] = useState(initSearchForm.type);

  /**
   * 處理週期
   *
   * @param {Event} ev event
   * @param {{ 'data-period': string }} params params
   */
  const handleOnClickPeriod = (ev, { 'data-period': value }) => {
    setSearchForm((prev) => ({ ...prev, period: value }));
  };

  /**
   * 處理註冊日
   *
   * @param {object} day 起始/結束日期
   */
  const handleCreatedDate = (day) => {
    const startAt = day.startDate.tz('Etc/GMT+4').startOf('day');
    const endAt = day.endDate.tz('Etc/GMT+4').endOf('day');

    // 日期僅可選擇(今日-1天) 至 (今日-181天) (因數據只統計至前一日)
    const lastDay = moment()
      .subtract(1, 'days')
      .tz('Etc/GMT+4')
      .endOf('day');

    setSearchForm((prev) => ({
      ...prev,
      start_at: startAt.isAfter(lastDay) ? lastDay.format() : startAt.format(),
      end_at: endAt.isAfter(lastDay) ? lastDay.format() : endAt.format(),
    }));
  };

  /**
   * 處理送出搜尋
   */
  const handleSubmit = () => {
    if (loading) {
      return;
    }

    setPeriod(searchForm.period);
    getRetentionRateLogin({});
  };

  /**
   * 處理開啟/關閉說明文字
   */
  const handleExplanation = () => {
    setActiveExplanation(!activeExplanation);
  };

  /**
   * 處理是否為百分比切換
   *
   * @param {Event} ev event
   * @param {{ 'data-type': 'percent' | 'number' }} params params
   */
  const handleIsPercentChange = (ev, { 'data-type': value }) => {
    setType(value);
  };

  /**
   * 處理表格呈現資料
   *
   * @param {object} params params
   * @param {RetentionRateLoginType} params.tableData 登入留存率資料
   * @returns {Array<object>} TableData
   */
  const handleTableData = ({ tableData = data }) => {
    const { ret, sub_total: subTotal, total } = tableData;
    const isPercent = type === 'percent';
    const newRet = ret[type];

    const newData = newRet
      .map((r) => {
        const newR = r;

        newR.date = `${r.day} ${moment(r.day).format('dddd')}`;
        newR.isPercent = isPercent;
        newR.isResultCell = false;
        newR.toColorClassName = isPercent;

        return newR;
      })
      .concat([
        {
          ...subTotal[type],
          date: tr(isPercent ? 'M_TEXT_SUB_TOTAL_AVERAGE' : 'M_TEXT_RESULT_SUB_TOTAL_AMOUNT'),
          isPercent,
          isResultCell: true,
        },
        {
          ...total[type],
          date: tr(isPercent ? 'M_TEXT_AMOUNT_AVERAGE' : 'M_TEXT_RESULT_TOTAL_AMOUNT'),
          isPercent,
          isResultCell: true,
        },
      ]);

    return newData;
  };

  /**
   * 取得登入留存率資料
   *
   * @param {object} params params
   * @param {SearchFormType} params.searchForm 搜尋條件
   * @param {PaginationType} params.pagination 頁碼資訊
   */
  const getRetentionRateLogin = async ({
    searchForm: localSearchForm = searchForm,
    pagination: localPagination = initPagination,
  }) => {
    setLoading(true);

    const out = { result: 'ok', ...getUserRetentionRet[localSearchForm.period] };

    if (out && out.result === 'ok') {
      setData({
        ret: !Object.keys(out.ret).length ? initRetentionRateLogin.ret : out.ret,
        sub_total: out.sub_total,
        total: out.total,
      });
      setPagination(out.pagination);
    }

    setLoading(false);
  };

  /**
   * 登入留存率說明圖示(上下箭頭)
   */
  const useActiveIcon = useMemo(() => (
    activeExplanation ? 'up' : 'down'
  ), [activeExplanation]);

  /**
   * 表格資料
   */
  const useTableData = useMemo(() => {
    if (data.ret[type].length > 0) {
      return handleTableData({});
    }

    return [];
  }, [data.ret, type]);

  useEffect(() => {
    getRetentionRateLogin({});
  }, []);

  return (
    <>
      <div className="page-title">
        {tr('M_TEXT_RETENTION_RATE_LOGIN')}
      </div>

      <Form className="search-wrap">
        <Form.Group>
          {/* 留存率週期 */}
          <Form.Field>
            <label>
              {tr('M_USER_RETENTION_PERIOD')}
              <Popup
                wide="very"
                position="bottom left"
                trigger={(
                  <Icon
                    name="info circle"
                    className={styles['popup-font']}
                  />
                )}
                content={(
                  <List bulleted>
                    {[0, 1, 2].map((l) => (
                      <List.Item className={styles['list-item']} key={l}>
                        <span>
                          {`${tr(`M_USER_RETENTION_${Object.keys(PeriodMap)[l].toUpperCase()}`)}：`}
                        </span>
                        {tr(`M_USER_RETENTION_MEMO_${l + 1}`)}
                      </List.Item>
                    ))}
                  </List>
                )}
              />
            </label>
            <Button.Group basic className="os-chart_quickSelect">
              {Object.keys(PeriodMap).map((p) => (
                <Button
                  active={searchForm.period === p}
                  content={PeriodMap[p].text}
                  data-period={p}
                  onClick={handleOnClickPeriod}
                  key={p}
                />
              ))}
            </Button.Group>
          </Form.Field>
          {/* 註冊日 */}
          <Form.Field
            label={tr('M_TEXT_CREATED_DAY')}
            control={DateRange}
            minDate={moment().tz('Etc/GMT+4').subtract(181, 'days')}
            startDate={(searchForm.start_at && moment(searchForm.start_at)) || ''}
            endDate={(searchForm.end_at && moment(searchForm.end_at)) || ''}
            setRange={handleCreatedDate}
            format={DF.date}
          />
          <Form.Button
            loading={loading}
            color="blue"
            content={tr('M_ACTION_SEARCH')}
            onClick={handleSubmit}
          />
        </Form.Group>
      </Form>

      {/* 登入留存率說明 */}
      <Menu secondary>
        <Menu.Menu className="right">
          <Button
            as="a"
            className={`item ${styles['menu-item']}`}
            onClick={handleExplanation}
          >
            <span>{tr('M_ANALYSIS_INDEX_DESCRIPTION')}</span>
            <Icon name={`${useActiveIcon} chevron`} />
          </Button>
        </Menu.Menu>
      </Menu>
      <div className={`${useActiveIcon} ${styles['explanation-block']}`}>
        <List>
          {[4, 5, 7].map((l) => (
            <List.Item as="li" key={l} className={styles['list-item']}>
              {tr(`M_USER_RETENTION_MEMO_${l}`)}
              {l === 4 && (
                <span className={styles['list-item-span']}>
                  {tr('M_USER_RETENTION_MEMO_8')}
                </span>
              )}
            </List.Item>
          ))}
        </List>
      </div>

      {/* Chart */}
      <RetentionRateLoginCharts
        // 圖表固定顯示"留存率(%)"，不會顯示留存人數
        data={data.total.percent}
        loading={loading}
        period={period}
      />

      {loading && <Loader active={loading} />}
      {!loading && (
        <TableOs
          tableParam={{ className: styles['customized-table'] }}
          columns={PeriodMap[period].columns}
          data={useTableData}
          leftElement={(
            <Button.Group>
              {Object.keys(ReportTypes).map((d) => (
                <Button
                  basic={d !== type}
                  content={ReportTypes[d].text}
                  color="blue"
                  data-type={d}
                  key={d}
                  onClick={handleIsPercentChange}
                />
              ))}
            </Button.Group>
          )}
        />
      )}

      <Pagination
        pagination={pagination}
        onPageChanged={getRetentionRateLogin}
      />
    </>
  );
};

export default RetentionRateLogin;
