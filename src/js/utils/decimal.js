import React from 'react';
import Cookies from 'js-cookie';
import preciseCalculator from './preciseCalculator';

/**
 * 判斷不是數字
 *
 * @param {any} num 任意資料
 * @returns {boolean} 是否為數字
 */
function isNotNumber(num) {
  return parseFloat(num).toString() === 'NaN';
}

/**
 * 數字加上千位符號
 *
 * @param {number} num 原始數字
 * @param {number} digits 小數位數 integer
 * @param {string} append 後綴
 * @param {boolean} isChart 是否來自圖表
 * @returns {string} 回傳處理過後的文字
 */
function decimal(num, digits = Cookies.get('digits') || 2, append = '', isChart = false) {
  const newNum = num === null ? 0 : num;

  if (isNotNumber(newNum)) {
    return '--';
  }

  const { deserialize } = preciseCalculator({ ROUNDING_MODE: 1 });
  let out = deserialize(newNum).toFormat(Number(digits)) + append;

  if (num < 0 && !isChart) {
    out = <font className="basic-red">{out}</font>;
  }

  return out;
}

/**
 * 數字加上小數點 (不含html)
 *
 * @param {number} num 原始數字
 * @param {number} digits 小數位數 integer
 * @param {string} append 後綴
 * @returns {string} 回傳處理過後的文字
 */
function decimal2(num, digits = Cookies.get('digits') || 2, append = '') {
  const newNum = num === null ? 0 : num;

  if (isNotNumber(newNum)) {
    return '--';
  }

  const { deserialize } = preciseCalculator({ ROUNDING_MODE: 1 });
  const out = deserialize(num).toFixed(Number(digits));

  return out + append;
}

export { decimal, decimal2 };
