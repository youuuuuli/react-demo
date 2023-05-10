import React, { useContext, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Cookies, useHistory } from '../utils';
import ApiContext from '../default/ApiContext';

const LoginForm = () => {
  const { tr } = useContext(ApiContext);
  const { forward } = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit() {
    setError('');
    setLoading(true);

    if (password === 'qwe123') {
      Cookies.set('username', username);
      Cookies.set('logined', 1);

      setTimeout(() => {
        forward('/');
      }, 100);

      return;
    }

    setError(tr('M_TEXT_LOGIN_RESULT_PASSWORD_WRONG'));
    setLoading(false);
  }

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user circle" />
          {tr('M_ACTION_LOGIN')}
        </Header>
        <Form size="large" onSubmit={handleSubmit} error={!!error}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder={tr('M_TEXT_USER_USERNAME')}
              value={username}
              onChange={(e, { value }) => setUsername(value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder={tr('M_TEXT_PASSWORD')}
              type="password"
              value={password}
              onChange={(e, { value }) => setPassword(value)}
            />

            <Button
              color="teal"
              fluid
              size="large"
              loading={loading}
              content={tr('M_OTP_ACTION_1')}
            />

            {error && (
              <Message error>
                <Message.Header>{tr('M_TEXT_LOGIN_FAIL')}</Message.Header>
                <p>{error}</p>
              </Message>
            )}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
