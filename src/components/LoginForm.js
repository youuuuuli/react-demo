import React, { useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit() {
    setError('');
    setLoading(true);

    if (password === 'qwe123') {
      window.location.href = '/root';

      return;
    }

    setError('password error!');
    setLoading(false);
  }

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user circle" />
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={handleSubmit} error={!!error}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              value={username}
              onChange={(e, { value }) => setUsername(value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e, { value }) => setPassword(value)}
            />

            <Button color="teal" fluid size="large" loading={loading}>
              Login
            </Button>

            {error && (
              <Message error>
                <Message.Header>Failed to login</Message.Header>
                <p>{error}</p>
              </Message>
            )}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginPage;
