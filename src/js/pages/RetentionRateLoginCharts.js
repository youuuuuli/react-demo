import React, { useContext, useMemo } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { deepCopy, ReactEcharts, sprintf } from '../utils';
import styles from '../../css/DailyReportRate.module.css';
import useRetentionRateLogin from '../constants/useRetentionRateLogin';
import { lineRate } from '../options/ChartOptions';
import ApiContext from '../default/ApiContext';
import NoDataDimmer from '../components/NoDataDimmer';
import '../../css/Chart.css';

/**
 * 日營運報表 > 登入留存率 > 圖表
 *
 * @param {object} props props
 * @param {object} props.data 總計資料
 * @param {boolean} props.loading 下載中
 * @param {string} props.period 時間類型
 * @returns {JSX.Element} RetentionRateLoginCharts
 */
const RetentionRateLoginCharts = (props) => {
  const { tr } = useContext(ApiContext);
  const PeriodMap = useRetentionRateLogin();

  const {
    data: totalData,
    loading,
    period,
  } = props;

  /**
   * 繪製折線圖
   *
   * @param {object} params params
   * @param {object} params.total 搜尋結果總計
   * @returns {object} ChartOption
   */
  const handleLineChart = ({ total = totalData }) => {
    const exportOption = deepCopy(lineRate);
    const newTotal = { ...total };
    const lineColor = '#36d5c3';

    delete newTotal.created;

    exportOption.legend.data = [tr('M_TEXT_TOTAL_AVERAGE')];
    exportOption.series = [
      {
        color: lineColor,
        data: Object.values(newTotal),
        name: tr('M_TEXT_TOTAL_AVERAGE'),
        symbol: 'circle',
        symbolSize: 8,
        type: 'line',
      },
    ];
    exportOption.title.text = tr('M_USER_RETENTION');
    exportOption.tooltip = {
      trigger: 'axis',
      formatter: ([{ axisValue, value }]) => {
        let tooltip = '';

        if (value !== '--') {
          tooltip += `
            <span style="font-size: 14px;font-weight: bold;">
              <font color="#666666">${axisValue}</font>
            </span>
            <p>
              <font>${sprintf(tr('M_USER_RETENTION_AVERAGE'), value)}</font>
            </p>
          `;
        }

        return tooltip;
      },
    };
    exportOption.xAxis.data = PeriodMap[period].basicColumns.map((p) => p.title);
    exportOption.yAxis.axisLabel = { formatter: '{value}%' };

    return exportOption;
  };

  /**
   * 折線圖
   */
  const useChartOption = useMemo(() => {
    if (Object.keys(totalData).length > 0) {
      return handleLineChart({});
    }

    return lineRate;
  }, [totalData]);

  return (
    <Segment.Group className="chart-wrap">
      <Segment.Group horizontal>
        <Segment>
          <Grid>
            <Grid.Row>
              <NoDataDimmer
                as={Grid.Column}
                active={loading
                  || !Object.keys(totalData).length
                  || totalData?.created === null
                }
                className={styles['customized-chart']}
              >
                <ReactEcharts
                  option={useChartOption}
                  showLoading={loading}
                />
              </NoDataDimmer>
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    </Segment.Group>
  );
};

export default RetentionRateLoginCharts;
