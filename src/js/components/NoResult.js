import React, { useContext } from 'react';
import { Table } from 'semantic-ui-react';
import ApiContext from '../default/ApiContext';

/**
 * 表格查無資料顯示列
 */
const NoResultRow = (props) => {
  const { colSpan } = props;
  const { tr } = useContext(ApiContext);

  return (
    <Table.Row key="no-result">
      <Table.Cell colSpan={colSpan} textAlign="center" content={tr('M_TEXT_NO_DATA')} />
    </Table.Row>
  );
};

export default NoResultRow;
