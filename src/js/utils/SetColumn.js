/**
 * 欄位位置按鈕
 *
 * @param {object} tableField 欄位位置按鈕狀態
 * @param {string} name 點擊當下的分類
 * @returns {object} 欄位設置 key: tableField, colSpan數量: colSpanNum, 顯示欄位數量: visibleFieldNum
 */
const setColumn = (tableField, name) => {
  const defaultFieldNum = Object.keys(tableField).length;
  let visibleFieldNum = 0;
  const newFields = { ...tableField };

  if (name !== undefined) {
    const isSelected = !tableField[name].selected;

    newFields[name].selected = false;
    newFields[name].visible = false;

    if (isSelected) {
      newFields[name].selected = true;
      newFields[name].visible = true;
    }
  }

  // 計算目前顯示 & 已選取的欄位數量
  Object.keys(newFields).forEach((key) => {
    if (newFields[key].visible) {
      visibleFieldNum += 1;
    }
  });

  return {
    tableField: newFields,
    colSpanNum: defaultFieldNum,
    visibleFieldNum,
  };
};

export default setColumn;
