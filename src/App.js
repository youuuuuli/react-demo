import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Container,
  Menu,
  Sidebar,
  Icon,
} from 'semantic-ui-react';
import SidebarsMap from './constants/SidebarsMap';

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
  const [visible, setVisible] = useState(false);

  return (
    <React.StrictMode>
      <AppHeader visible={visible} setVisible={setVisible} />
      <AppSidebar visible={visible} />
      <Container style={{ marginTop: '7em' }}>
        <RouterProvider router={router} />
      </Container>
    </React.StrictMode>
  );
};

export default App;
