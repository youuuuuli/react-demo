import React, { useContext } from 'react';
import { Table } from 'semantic-ui-react';
import ApiContext from '../default/ApiContext';

/**
 * 表格顯示讀取中
 */
const LoadingTable = (props) => {
  const { colSpan } = props;
  const { tr } = useContext(ApiContext);

  return (
    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan={colSpan} textAlign="center" content={tr('M_TEXT_LOADING')} />
      </Table.Row>
    </Table.Footer>
  );
};

export default LoadingTable;
