import { useState, useEffect } from 'react';

/** @typedef {import('Docs/stickyTableWidth.d').StickyTableWidthType} StickyTableWidthType */

/**
 * 算凍結欄位位置
 *
 * @param {{
 * tableField: object|undefined,
 * data: Array<object>,
 * loading: boolean
 * }} param -
 * - tableField table欄位開啟按鈕狀態
 * - data table資料
 * - loading 資料讀取
 * @returns {StickyTableWidthType} 計算完的sticky position
 */
const useStickyColumn = ({ tableField = undefined, data = [], loading } = {}) => {
  /** @type {StickyTableWidthType} */
  const initWidth = { left: [0], right: [0] };

  // 欄凍結位置
  const [stickyTableWidth, setStickyTableWidth] = useState(initWidth);

  /**
   * 計算凍結欄位位置
   */
  const getStickyColumn = () => {
    const stickyHeaderLeft = document.querySelectorAll('.ui.table th.column-sticky-left') || [];
    const stickyHeaderRight = document.querySelectorAll('.ui.table th.column-sticky-right') || [];
    const newWidth = { left: [0], right: [0] };

    if (stickyHeaderLeft.length) {
      let width = 0;

      stickyHeaderLeft.forEach((i) => {
        width += i.clientWidth;
        newWidth.left.push(width);
      });
    }

    if (stickyHeaderRight.length) {
      let width = 0;

      // 從右至左開始算
      Array.from(stickyHeaderRight).reverse().forEach((i) => {
        width += i.clientWidth;
        newWidth.right.push(width);
      });
    }

    setStickyTableWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', getStickyColumn);

    return () => window.removeEventListener('resize', getStickyColumn);
  }, []);

  useEffect(() => {
    getStickyColumn();
  }, [tableField, data, loading]);

  return { stickyTableWidth };
};

export default useStickyColumn;
