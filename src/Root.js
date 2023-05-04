import React, { useState } from 'react';
import {
  Container,
  Menu,
  Sidebar,
  Icon,
} from 'semantic-ui-react';

const RootHeader = ({ visible, setVisible }) => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item header>
        My App
      </Menu.Item>
      <Menu.Item position="right" onClick={() => setVisible(!visible)}>
        <Icon name="sidebar" />
      </Menu.Item>
    </Container>
  </Menu>
);

const RootSidebar = ({ visible }) => (
  <Sidebar
    as={Menu}
    animation="overlay"
    direction="left"
    inverted
    vertical
    visible={visible}
  >
    <Menu.Item as="a" href="/root">Home</Menu.Item>
    <Menu.Item as="a">Profile</Menu.Item>
    <Menu.Item as="a" href="/">Log out</Menu.Item>
  </Sidebar>
);

const Root = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <RootHeader visible={visible} setVisible={setVisible} />
      <RootSidebar visible={visible} />
      <Container style={{ marginTop: '7em' }}>
        Welcome!
      </Container>
    </>
  );
};

export default Root;
