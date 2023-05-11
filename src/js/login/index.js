import React, { useContext, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Cookies, classNames, useHistory } from '../utils';
import styles from '../../css/Login.module.css';
import ApiContext from '../default/ApiContext';

const Login = (props) => {
  const { lang, setLang } = props;
  const { tr } = useContext(ApiContext);
  const { forward } = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * 取得語系 className
   *
   * @param {string} target 語系 className
   * @returns {Function} 語系 className 集合
   */
  function getClassName(target) {
    return classNames({
      'lang-icon': lang === target,
      'lang-icon-cr': lang !== target,
    });
  }

  function onSubmit() {
    setError('');

    if (password === 'qwe123') {
      Cookies.set('username', username);
      Cookies.set('loggedIn', 1);

      setTimeout(() => {
        forward('/');
      }, 100);

      return;
    }

    setError(tr('M_TEXT_LOGIN_RESULT_PASSWORD_WRONG'));
  }

  return (
    <Grid className={styles['login-page']} centered>
      <Grid.Column>
        <Container textAlign="right">
          <Image
            title="繁體中文"
            src="/lan_tw.png"
            inline
            className={getClassName('zh-tw')}
            onClick={() => setLang('zh-tw')}
          />
          <Image
            title="简体中文"
            src="/lan_cn.png"
            inline
            className={getClassName('zh-cn')}
            onClick={() => setLang('zh-cn')}
          />
        </Container>
        <Header as="h1" textAlign="center">
          <Header.Content>{tr('M_TITLE_MANAGER_SITE')}</Header.Content>
          <Header.Subheader>{tr('M_LOGIN_MANAGER_SITE_EN')}</Header.Subheader>
        </Header>
        <Form size="large" onSubmit={onSubmit} error={!!error}>
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
              className={styles.submit}
              fluid
              size="large"
              content={tr('M_ACTION_LOGIN')}
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

export default Login;
