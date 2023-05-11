import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { Container, Header } from 'semantic-ui-react';
import ApiContext from './ApiContext';

const WelcomePage = () => {
  const { config: { name } } = useContext(ApiContext);
  const username = Cookies.get('username');

  return (
    <Container textAlign="center">
      <Header as="h1">{`歡迎${username}! 來到${name}`}</Header>
    </Container>
  );
};

export default WelcomePage;
