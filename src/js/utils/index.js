import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment-timezone';
import { sprintf } from 'sprintf-js';
import querystring from 'querystring';
import DateRange from './DateRange';
import { decimal } from './decimal';
import LocalStorage from './LocalStorage';
import Pagination from './Pagination';
import setColumn from './SetColumn';
import useHandleSort from './useHandleSort';
import useStickyColumn from './useStickyColumn';

/**
 * 深複製
 *
 * @param {object | Array} obj 要複製的object or array
 * @param {Map} cache 子層object快取
 * @returns {object | Array} object or array
 */
const deepCopy = (obj, cache = new WeakMap()) => {
  // 基本型別 & function
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Date 及 RegExp
  if (obj instanceof Date || obj instanceof RegExp) {
    return obj.constructor(obj);
  }

  // 檢查快取
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // 使用原物件的 constructor
  const copy = new obj.constructor();

  // 先放入 cache 中
  cache.set(obj, copy);
  // 取出所有一般屬性 & 所有 key 為 symbol 的屬性
  [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
};

/**
 * 開啟新頁/跳窗
 * 1. url 欲開啟的網址
 * 2. windowName 為空就開啟新分頁，反之則開啟新跳窗
 * 3. windowFeatures 跳窗相關參數設置，預設為寬1280、高720
 *
 * @param {string} url 網址
 * @param {string|'_blank'} windowName 跳窗名稱或標籤
 * @param {object} windowFeatures 跳窗參數設置
 * @returns {Function} window.open(url, windowName, windowFeatures);
 */
const windowOpen = (url, windowName = '_blank', windowFeatures = {}) => {
  if (windowName === '_blank' && !Object.keys(windowFeatures).length) {
    return window.open(url);
  }

  const windows = { width: 1280, height: 720, ...windowFeatures };
  const { width, height } = windows;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  const features = Object.keys(windows).map((w) => `${w}=${windows[w]}`)
    .join(',')
    .concat(`,screenTop=${top},screenLeft=${left}`);

  return window.open(url, windowName, features);
};

export {
  classNames,
  DateRange,
  deepCopy,
  decimal,
  moment,
  LocalStorage,
  Pagination,
  querystring,
  ReactEcharts,
  setColumn,
  sprintf,
  useHandleSort,
  useStickyColumn,
  windowOpen,
};
