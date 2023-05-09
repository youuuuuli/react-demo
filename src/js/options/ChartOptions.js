const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

const pie = {
  series: [{ type: 'pie', data: [] }],
  legend: {
    show: false,
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: '#FFFFFF',
    textStyle: {
      color: '#000000',
      lineHeight: 24,
    },
    padding: 16,
    borderWidth: 0,
    extraCssText: 'box-shadow: 0 2px 5px 0 rgba(60,76,93,0.3);',
  },
};

const line = {
  grid: {
    containLabel: true,
    left: '5%',
    right: '5%',
    top: '10%',
    bottom: '5%',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    textStyle: {
      color: '#000000',
      lineHeight: 24,
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
      },
    },
    padding: 16,
    confine: true,
    extraCssText: 'box-shadow: 0 2px 5px 0 rgba(60,76,93,0.3);',
  },
  xAxis: {
    boundaryGap: true,
    data: [],
    axisPointer: {
      show: true,
    },
    axisLine: {
      lineStyle: {
        color: '#F4F6F9',
      },
    },
    axisLabel: {
      color: '#333',
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: '#D0D1D3',
      },
    },
  },
  yAxis: {
    nameLocation: 'end',
    nameTextStyle: {
      fontSize: 13,
      color: '#333',
      align: 'left',
      verticalAlign: 'middle',
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#F4F6F9',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  series: [],
};

const bar = {
  grid: {
    containLabel: true,
    left: '5%',
    right: '5%',
    top: '10%',
    bottom: '5%',
  },
  xAxis: {
    boundaryGap: true,
    type: 'category',
    data: [],
    axisLine: {
      lineStyle: {
        color: '#F4F6F9',
      },
    },
    axisLabel: {
      color: '#333',
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: '#D0D1D3',
      },
    },
  },
  yAxis: {
    nameLocation: 'end',
    nameTextStyle: {
      fontSize: 13,
      color: '#333',
      align: 'left',
      verticalAlign: 'middle',
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#F4F6F9',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  series: [],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(54,197,211,0.1)',
      },
    },
    backgroundColor: '#FFFFFF',
    textStyle: {
      color: '#000000',
      lineHeight: 24,
    },
    padding: 16,
    confine: true,
    extraCssText: 'box-shadow: 0 2px 5px 0 rgba(60,76,93,0.3);',
  },
};

const lineRate = {
  title: {},
  grid: {
    containLabel: true,
    left: '5%',
    right: '5%',
    top: '20%',
    bottom: '5%',
  },
  legend: {
    icon: 'circle',
    selectedMode: false,
  },
  xAxis: {
    data: [],
  },
  yAxis: {},
  series: [],
};

export {
  lineRate,
  line,
  pie,
  bar,
  colors,
};
