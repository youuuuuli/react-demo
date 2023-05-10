import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import querystring from 'querystring';

const useHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 處理 location query
  const query = useMemo(() => (
    querystring.parse((location.search ?? '?').substring(1))
  ), [location]);

  /**
   * 導頁
   *
   * @param {string} url 網址
   * @param {{
   * needUrlQuery: boolean,
   * isReplace: boolean,
   * }} param -
   * - needUrlQuery 是否需要附加querystring
   * - isReplace 是否需要replace
   */
  function forward(url, param = {}) {
    const { needUrlQuery = false, isReplace = false } = param;

    navigate(url + (needUrlQuery ? location.search : ''), { replace: isReplace });
  }

  // 上一頁
  function goBack() {
    navigate(-1);
  }

  return {
    location,
    query,
    forward,
    goBack,
  };
};

export default useHistory;
