import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Container,
  Menu,
  Sidebar,
  Icon,
} from 'semantic-ui-react';
import LoginForm from './components/LoginForm';
import SidebarsMap from './constants/SidebarsMap';
import initPagination from './constants/InitPagination';
import Pagination from './utils/Pagination';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />,
  },
  {
    path: '/root',
    element: <Pagination pagination={initPagination} onPageChanged={null} />,
  },
]);

const RootHeader = ({ visible, setVisible }) => {
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

const RootSidebar = ({ visible }) => (
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
        href={sidebar.href}
        content={sidebar.content}
      />
    ))}
  </Sidebar>
);

const Root = () => {
  const [visible, setVisible] = useState(false);

  return (
    <React.StrictMode>
      <RootHeader visible={visible} setVisible={setVisible} />
      <RootSidebar visible={visible} />
      <Container style={{ marginTop: '7em' }}>
        <RouterProvider router={router} />
      </Container>
    </React.StrictMode>
  );
};

export default Root;
