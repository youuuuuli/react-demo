import { useState } from 'react';

/**
 * @typedef {object} SortStats 排序指標
 * @property {string} sortBy 指標
 * @property {string} order 升冪/降冪
 * @property {object} sort 各指標狀態
 */

/**
 * 管理排序狀態
 *
 * @param {Array<string>} sortKeys 排序指標列表
 * @example sortKeys排序指標列表 ['count', 'user_count', 'payoff']
 * @returns {{ sortStatus: SortStats, handleSort: Function }} -
 * - sortStatus 排序指標
 * - handleSort 處理排序指標state, 回傳state
 */
const useHandleSort = (sortKeys) => {
  const initSortStatus = {
    sortBy: '',
    order: '',
    sort: {},
  };

  sortKeys.forEach((key) => {
    initSortStatus.sort[key] = 'sort';
  });

  const reverseOrder = ['payoff'];

  /** @type {[SortStats, Function]} 排序指標 */
  const [sortStatus, setSortStatus] = useState(initSortStatus);

  /**
   * 更改列表排序
   *
   * @param {string} name 排序條件
   * @returns {{ sortBy: string, order: string }} sortStats
   */
  const handleSort = (name) => {
    const { sort } = sortStatus;
    let sortBy = name;
    let order = '';
    let sortIcon = 'sort';

    // 其他項目sort設為預設
    Object.keys(sort).forEach((s) => {
      if (s !== name) {
        sort[s] = 'sort';
      }
    });

    if (sort[name] === 'sort') {
      sortIcon = 'sort ascending';
      order = reverseOrder.includes(name) ? 'desc' : 'asc';
    }

    if (sort[name] === 'sort ascending') {
      sortIcon = 'sort descending';
      order = reverseOrder.includes(name) ? 'asc' : 'desc';
    }

    if (sort[name] === ('sort descending')) {
      sortBy = '';
    }

    sort[name] = sortIcon;

    setSortStatus({ sort, sortBy, order });

    return {
      sortBy,
      order,
    };
  };

  return { sortStatus, handleSort };
};

export default useHandleSort;
