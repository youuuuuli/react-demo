import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  Segment,
  Button,
  Checkbox,
  Icon,
} from 'semantic-ui-react';
import {
  LocalStorage,
  classNames,
  useHandleSort,
  setColumn,
  useStickyColumn,
} from '../utils';
import NoResult from './NoResult';
import ApiContext from '../default/ApiContext';
import LoadingTable from './Loading';

/**
 * @typedef ColumnsType 表格列表參數
 * @property {string} key 表格顯示資料的 key代碼
 * @property {string} title 欄位標題
 * @property {boolean} fixed 固定欄位，不顯示在欄位設置內
 * 標題參數 <th>
 * @property {string} headTextAlign 對齊方式，center, left, right
 * @property {string} headCellClass Class Name
 * @property {boolean} isSort 是否排序
 * @property {object} headerStyle 標題樣式
 * 表格參數 <td>
 * @property {string} cellAlign 對齊方式，center, left, right
 * @property {string | Function} cellClass Class Name
 * @property {number} width 寬度
 * @property {JSX.Element} render render 外部元件
 * @property {object} cellStyle Cell 樣式
 */

/**
 * @typedef HeaderCellType 自定義標題
 * @property {string} content 表格內容
 * @property {string} textAlign 對齊方式，center, left, right
 * @property {string} className Class Name
 * @property {number} width 寬度
 * @property {string} rowSpan rowSpan
 * @property {string} colSpan colSpan
 * @property {string} sortKey 排序 key，footer無此參數
 * @property {JSX.Element} render render 外部元件
 * @property {object} style 樣式
 */

/**
 * @typedef FieldConfigType 欄位設置參數
 * @property {string} localStorageKey 儲存 localStorage 的欄位 key
 * @property {object} initField 預設顯示欄位值
 * @property {boolean} initField.visible 是否顯示欄位
 * @property {boolean} initField.selected 欄位設置按鈕是否選取
 * @property {object} field 更新父層顯示欄位參數
 */

/**
 * @typedef {object} PropsData
 * @property {object} props 外部 props 結構
 * @property {object} tableParam 繼承表格屬性
 * @property {Array<ColumnsType>} columns 列表參數，請輸入 key 值做為 loop 的主key
 * @property {string} columnsKey 變更 columns key，預設為 key
 * @property {Array<Array<HeaderCellType>>} header 自定義標題
 * @property {Array<Array<HeaderCellType>>} footer 自定義頁腳
 * @property {Array<object>} data 列表資料，請輸入key值做為 loop 的主key，預設key為 id
 * @property {string} dataKey 變更 data key，預設為 id
 * @property {JSX.Element} leftElement JSX 左側元件空位
 * @property {JSX.Element} rightElement JSX 右側元件空位
 * @property {FieldConfigType} fieldConfig 欄位設置參數
 * @property {Function} setField 更新表格欄位狀態，只更新 visible, selected
 * @property {boolean} isBatch 顯示批量處理
 * @property {string} batchKey 指定執行批量處理的key
 * @property {string} batchCellClassName 執行批量處理的cell className
 * @property {boolean} disabled 元件是否禁能
 * @property {Function} onBatchChange 顯示批量處理
 * @property {Function} setSort 變更排序
 * @property {boolean} enableScroll 是否可以捲動
 * @property {boolean} loading 資料讀取
 */

/**
 * 表格
 *
 * @param {PropsData} props props 參數
 * @returns {JSX.Element} JSX
 */
const TableOs = (props) => {
  const {
    tableParam = {},
    columns = [],
    columnsKey = 'key',
    header = [],
    footer = [],
    data = [],
    dataKey = 'id',
    leftElement,
    rightElement,
    fieldConfig = {},
    setField = () => { },
    isBatch = false,
    batchKey = 'id',
    batchCellClassName = '',
    currBatchChecked,
    disabled = false,
    onBatchChange = () => { },
    setSort = () => { },
    enableScroll = false,
    loading = false,
  } = props;

  const { tr } = useContext(ApiContext);
  const newFieldConfig = {
    localStorageKey: '',
    initField: {},
    field: {},
    ...fieldConfig,
  };
  const { localStorageKey, initField, field } = newFieldConfig;

  // 是否呈現欄位位置按鈕
  const [isOpenFieldDialog, setIsOpenFieldDialog] = useState(false);

  // 批量處理 - 選取項目
  const [checkedBatchKeys, setCheckedBatchKeys] = useState(currBatchChecked || []);

  /** @type {object} 取得欄位顯示記錄 */
  const customTableField = LocalStorage.get('customTableField') || {};

  // 是否使用「欄位設置」功能
  const isFieldConfig = Object.keys(fieldConfig).length > 0
    && Object.keys(field).length > 0
    && Object.keys(initField).length > 0
    && localStorageKey;

  /**
   * 儲存欄位設置更動
   *
   * @param {object} innerField 欄位設定
   * @param {boolean} isUpdate 是否更新至 LocalStorage
   */
  const saveFieldConfig = (innerField, isUpdate = true) => {
    // 儲存 state 並保存 field 原始資料，只更新 visible, selected
    const newInitField = {};

    Object.keys(initField).forEach((key) => {
      newInitField[key] = {
        ...initField[key],
        visible: innerField[key].visible,
        selected: innerField[key].selected,
      };
    });

    setField(newInitField);

    // 更新至 LocalStorage，只存 visible, selected
    if (isUpdate) {
      const newInnerField = {};

      Object.keys(innerField).forEach((key) => {
        newInnerField[key] = {
          visible: innerField[key].visible,
          selected: innerField[key].selected,
        };
      });

      LocalStorage.set('customTableField', {
        ...customTableField,
        [localStorageKey]: newInnerField,
      });
    }
  };

  /**
   * 點擊欄位位置按鈕
   *
   * @param {Event} ev event
   * @param {{ name: string }} param 欄位名稱代碼
   */
  const handleFieldState = (ev, { name }) => {
    if (ev) {
      ev.preventDefault();
    }

    const res = setColumn(field, name);

    saveFieldConfig(res.tableField);
  };

  /**
   * 檢查localStorage欄位是否需要更新
   *
   * @returns {boolean} 是否更新
   */
  const checkFieldUpdate = () => {
    const localObject = customTableField[localStorageKey];

    if (!localObject) {
      return true;
    }

    let isUpdate = false;
    const initArray = Object.keys(initField);
    const localArray = Object.keys(localObject);

    // 檢查長度是否相同
    if (initArray.length !== localArray.length) {
      isUpdate = true;
    }

    // 檢查key是否相同
    if (localArray.find((key) => !initArray.includes(key))) {
      isUpdate = true;
    }

    // 檢查欄位順序是否相同
    for (let i = 0; i < initArray.length; i += 1) {
      if (initArray[i] !== localArray[i]) {
        isUpdate = true;
      }
    }

    return isUpdate;
  };

  /**
   * 批量處理 - 全選
   */
  const onBatchChangeAll = () => {
    if (!data.length) {
      return;
    }

    let batchKeys = [];

    if (data.length !== checkedBatchKeys.length) {
      batchKeys = data.map((i) => i[batchKey]);
    }

    onBatchChange(batchKeys);
    setCheckedBatchKeys(batchKeys);
  };

  /**
   * 批量處理 - 勾選單項
   *
   * @param {Event} ev event
   * @param {{
   * 'data-key': string|number,
   * checked: boolean
   * }} param
   * - data-key: 勾選項目的 key 值
   * - checked: 是否勾選
   */
  const onBatchChanged = (ev, { 'data-key': key, checked }) => {
    let batchKeys = [...checkedBatchKeys];

    if (checked) {
      batchKeys.push(key);
    }

    if (!checked) {
      batchKeys = checkedBatchKeys.filter((k) => k !== key);
    }

    onBatchChange(batchKeys);
    setCheckedBatchKeys(batchKeys);
  };

  /**
   * 比對勾選項目是否相同
   *
   * @param {Set} target 對象 1
   * @param {Set} target2 對象 2
   * @returns {boolean} 是否相同
   */
  const compareBatchChecked = (target, target2) => (
    target.size === target2.size
    && Array.from(target).every((a) => target2.has(a))
  );

  useEffect(() => {
    // 需更新，並儲存欄位設定至 LocalStorage
    if (isFieldConfig && checkFieldUpdate()) {
      saveFieldConfig(initField);
    }

    // 不需更新，直接取得 LocalStorage 的欄位設定
    if (isFieldConfig && !checkFieldUpdate()) {
      saveFieldConfig(customTableField[localStorageKey], false);
    }
  }, []);

  useEffect(() => {
    // 批量處理 - 清空勾選
    if (isBatch && checkedBatchKeys.length > 0) {
      setCheckedBatchKeys([]);
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(currBatchChecked)) {
      const target = new Set(currBatchChecked);
      const target2 = new Set(checkedBatchKeys);

      if (!compareBatchChecked(target, target2)) {
        setCheckedBatchKeys(currBatchChecked);
      }
    }
  }, [currBatchChecked]);

  /** @type {JSX.Element} Table */
  const Component = (
    <CustomTable
      tableParam={tableParam}
      columnsKey={columnsKey}
      header={header}
      data={data}
      footer={footer}
      columns={columns}
      field={field}
      disabled={disabled}
      dataKey={dataKey}
      batchKey={batchKey}
      checkedBatchKeys={checkedBatchKeys}
      batchCellClassName={batchCellClassName}
      isFieldConfig={isFieldConfig}
      isBatch={isBatch}
      setSort={setSort}
      onBatchChangeAll={onBatchChangeAll}
      onBatchChanged={onBatchChanged}
      loading={loading}
    />
  );

  return (
    <>
      {(isFieldConfig || leftElement || rightElement) && (
        <Segment basic clearing>
          {/* 欄位設置 */}
          {(isFieldConfig && !leftElement) && (
            <Segment basic floated="left">
              <Button
                color="blue"
                content={tr('M_TEXT_FIELD_CONFIG')}
                onClick={() => setIsOpenFieldDialog(!isOpenFieldDialog)}
              />
              <div className={[isOpenFieldDialog ? 'open' : 'hide', 'set-col-block'].join(' ')}>
                {columns.filter((i) => !i.fixed).map((i) => (
                  <Button
                    fluid
                    key={`opCodeButton-${i[columnsKey]}`}
                    className={classNames('opCodeButton', { onSelect: field[i.key].selected })}
                    name={i[columnsKey]}
                    title={i.title}
                    content={i.title}
                    onClick={handleFieldState}
                  />
                ))}
              </div>
            </Segment>
          )}

          {/* 左側元件空位 */}
          {(!isFieldConfig && leftElement) && (
            <Segment basic floated="left">{leftElement}</Segment>
          )}

          {/* 右側元件空位 */}
          {rightElement && (
            <Segment basic floated="right">{rightElement}</Segment>
          )}
        </Segment>
      )}

      {/* 表格 */}
      {enableScroll ? (
        <div className={classNames({ 'scroll-table-container': enableScroll })}>
          {Component}
        </div>
      ) : (Component)}
    </>
  );
};

/**
 * table component
 *
 * @param {{
 * tableParam: object,
 * columnsKey: string,
 * header: Array<Array<HeaderCellType>>,
 * data: Array<object>,
 * footer: Array<Array<HeaderCellType>>,
 * columns: Array<ColumnsType>,
 * field: object,
 * disabled: boolean,
 * dataKey: string,
 * batchKey: string,
 * checkedBatchKeys: Array,
 * batchCellClassName: string,
 * isFieldConfig: boolean|string,
 * isBatch: boolean,
 * setSort: Function,
 * onBatchChangeAll: Function,
 * onBatchChanged: Function,
 * }} props -
 * - tableParam 繼承表格屬性
 * - columnsKey 變更 columns key，預設為 key
 * - header 自定義標題
 * - data 列表資料，請輸入key值做為 loop 的主key，預設key為 id
 * - footer 自定義頁腳
 * - columns 列表參數，請輸入 key 值做為 loop 的主key
 * - field 更新父層顯示欄位參數
 * - disabled 元件是否禁能
 * - dataKey 變更 data key，預設為 id
 * - batchKey 指定執行批量處理的key
 * - checkedBatchKeys 批量處理 - 選取項目
 * - batchCellClassName 執行批量處理的cell className
 * - isFieldConfig 是否使用「欄位設置」功能
 * - isBatch 顯示批量處理
 * - setSort 變更排序
 * - onBatchChangeAll 批量處理 - 全選
 * - onBatchChanged 批量處理 - 勾選單項
 * @returns {JSX.Element} JSX
 */
const CustomTable = (props) => {
  const {
    tableParam,
    columnsKey,
    header,
    data,
    footer,
    columns,
    field,
    disabled,
    dataKey,
    batchKey,
    checkedBatchKeys,
    batchCellClassName,
    isFieldConfig,
    isBatch,
    setSort,
    onBatchChangeAll,
    onBatchChanged,
    loading,
  } = props;

  const { stickyTableWidth } = useStickyColumn({ tableField: columns, data, loading });

  /**
   * 比對是否含有 Field 參數
   *
   * @param {object} column 欄位參數
   * @param {boolean} hasVisible 是否含有 Visible 參數
   * @returns {boolean} 是否含有 Field參數
   */
  const mappingField = (column, hasVisible = false) => {
    const isField = Object.keys(field).includes(column[columnsKey]);

    return hasVisible
      ? (isField && field[column[columnsKey]].visible)
      || Object.keys(field).length === 0
      : isField;
  };

  /**
   * 有欄位設置 - 回傳處理 mapping Field Array
   * 無欄位設置 - 回傳原 Array
   *
   * @param {boolean} hasVisible 是否含有 Visible 參數
   * @returns {Array} 是否含有 Field參數
   */
  const filterColumns = (hasVisible = false) => (
    isFieldConfig
      ? columns.filter((i) => mappingField(i, hasVisible))
      : columns
  );

  /**
   * 自定義 header or footer 是否存在
   *
   * @param {Array} typeArray header or footer Array
   * @returns {boolean} 是否存在
   */
  const isExist = ((typeArray) => (!!typeArray.length
    && !!typeArray[0].length
    && !!Object.keys(typeArray[0][0]).length
  ));

  // 取得自訂標題含有排序的 key
  const headerSort = () => {
    const keys = [];

    header.forEach((i) => {
      i.filter((k) => k.sortKey).forEach((k) => {
        keys.push(k.sortKey);
      });
    });

    return keys;
  };

  // 取得含有排序的key
  const sortKeys = isExist(header)
    ? headerSort()
    : columns.filter((k) => k.isSort === true).map((k) => (k.key));

  const { sortStatus, handleSort } = useHandleSort(sortKeys);

  /**
   * 更改列表排序
   *
   * @param {string} name 排序條件
   */
  const onClickSort = (name) => {
    if (!sortKeys.includes(name)) {
      return;
    }

    handleSort(name);
  };

  /**
   * 處理table row定位樣式
   *
   * @param {number} index row index
   * @returns {object} position style
   */
  const handlePositionStyle = (index) => {
    const positionStyle = {};

    if (stickyTableWidth.left.length > 0 && stickyTableWidth.left[index]) {
      positionStyle.left = stickyTableWidth.left[index];
    }

    if (stickyTableWidth.right.length > 0 && stickyTableWidth.right[index]) {
      positionStyle.right = stickyTableWidth.right[index];
    }

    return positionStyle;
  };

  useEffect(() => {
    setSort(sortStatus);
  }, [sortStatus]);

  // 批量處理 - 全選
  const selectAll = isBatch && (
    <Table.HeaderCell rowSpan={header.length ? header.length.toString() : null}>
      <Checkbox
        checked={!!data.length && data.length === checkedBatchKeys.length}
        indeterminate={(!!data.length && !!checkedBatchKeys.length)
          && data.length !== checkedBatchKeys.length}
        disabled={disabled}
        onChange={onBatchChangeAll}
      />
    </Table.HeaderCell>
  );

  return (
    <Table celled {...tableParam}>
      <Table.Header>
        {/* 自訂標題 */}
        {isExist(header) && (
          <CustomRow
            data={header}
            selectAll={selectAll}
            sortStatus={sortStatus}
            onClickSort={onClickSort}
            handlePositionStyle={handlePositionStyle}
          />
        )}
        {/* 預設標題 */}
        {!isExist(header) && (
          <Table.Row>
            {selectAll}

            {filterColumns(true).map((i, index) => (
              <Table.HeaderCell
                key={i[columnsKey]}
                textAlign={i.headTextAlign ? i.headTextAlign : 'center'}
                className={i.headCellClass ? i.headCellClass : null}
                style={{
                  ...i.headerStyle,
                  ...(sortStatus.sort[i[columnsKey]] && { cursor: 'pointer' }),
                  ...handlePositionStyle(index),
                }}
                onClick={() => onClickSort(i[columnsKey])}
              >
                {i.title}
                {!!sortStatus.sort[i[columnsKey]] && (
                  <Icon name={sortStatus.sort[i[columnsKey]]} />
                )}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        )}
      </Table.Header>

      {!loading && (
        <>
          <Table.Body>
            {data.map((dataItem, index) => (
              <Table.Row key={dataItem[dataKey] || index}>
                {/* 批量處理 -  勾選 checkBox */}
                {(isBatch && dataItem[batchKey]) && (
                  <Table.Cell className={isBatch && batchCellClassName}>
                    <Checkbox
                      data-key={dataItem[batchKey]}
                      disabled={disabled}
                      checked={checkedBatchKeys.includes(dataItem[batchKey])}
                      onChange={onBatchChanged}
                    />
                  </Table.Cell>
                )}

                {filterColumns(true).map((i, subIndex) => {
                  const text = dataItem[i[columnsKey]];
                  const stringContent = typeof text === 'number' ? text.toString() : text;
                  const name = typeof i.cellClass === 'function' ? i.cellClass(dataItem) : i.cellClass;
                  const rowSpan = typeof i.cellRowSpan === 'function' ? i.cellRowSpan(dataItem) : i.cellRowSpan;

                  return (
                    <Table.Cell
                      key={i[columnsKey]}
                      width={i.width ? i.width : null}
                      className={name ? name.toString() : null}
                      rowSpan={rowSpan ? rowSpan.toString() : null}
                      style={{ ...i.cellStyle, ...handlePositionStyle(subIndex) }}
                      textAlign={i.cellAlign ? i.cellAlign : 'center'}
                      content={i.render ? i.render(dataItem, index) : stringContent}
                    />
                  );
                })}
              </Table.Row>
            ))}

            {!data.length && (
              <NoResult colSpan={isBatch ? columns.length + 1 : columns.length} />
            )}
          </Table.Body>

          {/* 自訂頁腳 */}
          {isExist(footer) && (
            <Table.Footer>
              <CustomRow data={footer} />
            </Table.Footer>
          )}
        </>
      )}
      {loading && <LoadingTable colSpan={isBatch ? columns.length + 1 : columns.length} />}
    </Table>
  );
};

/**
 * 自訂 Table Row
 *
 * @param {object} props props
 * @param {Array<HeaderCellType>} props.data 表格資料
 * @param {JSX.Element} props.selectAll 全選元件
 * @param {object} props.sortStatus 排序指標
 * @param {Function} props.onClickSort 更改列表排序
 * @param {Function} props.handlePositionStyle 處理定位樣式
 * @returns {JSX.Element} JSX
 */
const CustomRow = (props) => {
  const {
    data,
    selectAll,
    sortStatus = {},
    onClickSort,
    handlePositionStyle = () => ({}),
  } = props;
  let k = 0;

  return (
    <>
      {data.map((row, index) => {
        const key = `row-${index}-${k += 1}`;

        return (
          <Table.Row key={key}>
            {index === 0 && selectAll}

            {!!row.length && row.map((cell, i) => {
              const newIndex = `th-${index}-${i}`;
              const isSort = Object.keys(sortStatus.sort || {}).includes(cell.sortKey);
              const stringContent = typeof cell.content === 'number'
                ? cell.content.toString()
                : cell.content;

              return (
                <Table.HeaderCell
                  key={newIndex}
                  textAlign={cell.textAlign ? cell.textAlign : 'center'}
                  width={cell.width ? cell.width : null}
                  className={cell.className ? cell.className : null}
                  rowSpan={cell.rowSpan ? cell.rowSpan : null}
                  colSpan={cell.colSpan ? cell.colSpan : null}
                  style={{
                    ...cell.style,
                    ...(isSort && { cursor: 'pointer' }),
                    ...handlePositionStyle(i),
                  }}
                  onClick={() => {
                    if (!isSort) {
                      return;
                    }

                    onClickSort(cell.sortKey);
                  }}
                >
                  {cell.render ? cell.render(cell.content) : stringContent}

                  {isSort && (
                    <Icon name={sortStatus.sort[cell.sortKey]} />
                  )}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        );
      })}
    </>
  );
};

export default TableOs;
