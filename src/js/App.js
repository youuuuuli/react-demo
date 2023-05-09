import React, { useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Container,
  Menu,
  Sidebar,
  Icon,
} from 'semantic-ui-react';
import Cookies from 'js-cookie';
import SidebarsMap from './constants/SidebarsMap';
import ApiContext from './default/ApiContext';
import zhTW from './locale/zh_tw.json';
import zhCN from './locale/zh_cn.json';

const router = createBrowserRouter(SidebarsMap);

const AppHeader = ({ visible, setVisible }) => {
  const { pathname } = window.location;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          My App
        </Menu.Item>
        {pathname !== '/' && (
          <Menu.Item position="right" onClick={() => setVisible(!visible)}>
            <Icon name="sidebar" />
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

const AppSidebar = ({ visible }) => (
  <Sidebar
    as={Menu}
    animation="overlay"
    direction="left"
    inverted
    vertical
    visible={visible}
  >
    {SidebarsMap.map((sidebar) => (
      <Menu.Item
        as="a"
        key={sidebar.content}
        href={sidebar.path}
        content={sidebar.content}
      />
    ))}
  </Sidebar>
);

const App = () => {
  const localeMap = {
    'zh-tw': zhTW,
    'zh-cn': zhCN,
  };

  const lang = Cookies.get('lang') || 'zh-cn';
  const locales = localeMap[lang];
  const tr = (code) => locales[code] || '';

  const [visible, setVisible] = useState(false);

  const apiProviderValue = useMemo(() => ({
    tr,
  }), [tr]);

  return (
    <React.StrictMode>
      <AppHeader visible={visible} setVisible={setVisible} />
      <AppSidebar visible={visible} />
      <Container style={{ marginTop: '7em' }}>
        <ApiContext.Provider value={apiProviderValue}>
          <RouterProvider router={router} />
        </ApiContext.Provider>
      </Container>
    </React.StrictMode>
  );
};

export default App;
