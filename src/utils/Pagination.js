import React from 'react';
import { Container } from 'semantic-ui-react';
import Pagination from 'rc-pagination';
import Select from 'rc-select';
import Cookies from 'js-cookie';
import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.less';
import zhTW from 'rc-pagination/lib/locale/zh_TW';
import zhCN from 'rc-pagination/lib/locale/zh_CN';
import viVN from 'rc-pagination/lib/locale/vi_VN';
import enUS from 'rc-pagination/lib/locale/en_US';
import koKR from 'rc-pagination/lib/locale/ko_KR';
import jaJP from 'rc-pagination/lib/locale/ja_JP';

/**
 * 分頁選單
 *
 * 使用方式：設定 onPageChanged 方法 / pagination 屬性
 * - #1 內部使用 onPageChanged({pagination}) 傳入分頁參數
 * - #2 pagination: {first_result, max_results, total}
 *
 * @param {object} props Props
 * @param {boolean} props.disabled 禁能
 * @param {object} props.pagination 分頁資料
 * @param {Function} props.onPageChanged 換頁callback
 * @returns {JSX.Element} Pagination
 * ------------------------------
 * @example <caption>基本樣式</caption>
 * <Pagination2
 *   onPageChanged={handleSearch}
 *   pagination={pagination}
 * />
 */
const Pagination2 = (props) => {
  const localeMap = {
    'zh-tw': zhTW,
    'zh-cn': zhCN,
    vi: viVN,
    en: enUS,
    ko: koKR,
    ja: jaJP,
  };

  const { disabled, pagination, onPageChanged } = props;

  /**
   * 處理選擇不同的頁數
   *
   * @param {number} current 當下頁數
   * @param {number} size 頁數 integer
   */
  const handlePageNumChanged = (current, size) => {
    const newPagination = {
      ...pagination,
      first_result: (Math.floor(pagination.first_result / size) * size),
      max_results: size,
    };

    if (onPageChanged) {
      onPageChanged({ pagination: newPagination });
    }
  };

  /**
   * 處理選擇不同分頁
   *
   * @param {number} pageNo 頁碼 integer
   */
  const handlePageChanged = (pageNo) => {
    const newPagination = { ...pagination, first_result: pagination.max_results * (pageNo - 1) };

    if (onPageChanged) {
      onPageChanged({ pagination: newPagination });
    }
  };

  const firstResult = Number.parseInt(pagination.first_result, 10) || 0;
  const maxResults = Number.parseInt(pagination.max_results, 10) || 20;
  const total = Number.parseInt(pagination.total, 10) || 0;
  const currPage = Math.floor(firstResult / maxResults) + 1;
  const lang = Cookies.get('lang');
  const locale = localeMap[lang] || localeMap['zh-cn'];

  return (
    <Container fluid textAlign="right">
      <Pagination
        data-testid="pagination"
        selectComponentClass={Select}
        // showTotal={(entryTotal) => entryTotal}
        showSizeChanger
        current={currPage}
        pageSize={maxResults}
        pageSizeOptions={['20', '50', '100', '200']}
        total={total}
        onChange={handlePageChanged}
        onShowSizeChange={handlePageNumChanged}
        locale={locale}
        showLessItems
        disabled={disabled}
      />
    </Container>
  );
};

export default Pagination2;
