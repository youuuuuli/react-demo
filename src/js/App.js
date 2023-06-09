import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import ApiContext from './default/ApiContext';
import isLogin from './login/IsLogin';
import zhTW from './locale/zh_tw.json';
import zhCN from './locale/zh_cn.json';
import { Cookies, moment } from './utils';

const Login = lazy(() => import('./login'));
const Default = lazy(() => import('./default'));

// 驗證登入狀態
const Private = ({ children }) => {
  const { pathname } = useLocation();

  if (isLogin() && pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  if (!isLogin() && pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const localeMap = {
    'zh-tw': zhTW,
    'zh-cn': zhCN,
  };

  const lang = Cookies.get('lang') || 'zh-cn';
  const locales = localeMap[lang];
  const tr = (code) => locales[code] || '';

  /**
   * 變更語系
   *
   * @param {string} target 語系
   */
  function changeLang(target) {
    if (lang === target) {
      return;
    }

    Cookies.set('lang', target);
    moment.locale(target);
  }

  const apiProviderValue = useMemo(() => ({
    tr,
    lang,
    config: { name: 'React Demo' },
  }), [
    tr,
    lang,
  ]);

  useEffect(() => {
    moment.locale(lang);
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ApiContext.Provider value={apiProviderValue}>
        <div id="pageWrapper">
          <BrowserRouter>
            <Routes>
              <Route path="/404" exact element={<div>404 Not Found</div>} />
              <Route
                path="/login"
                element={(
                  <Private>
                    <Login lang={lang} setLang={changeLang} />
                  </Private>
                )}
              />
              <Route
                path="/*"
                element={(
                  <Private>
                    <Default />
                  </Private>
                )}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </ApiContext.Provider>
    </Suspense>
  );
};

export default App;
