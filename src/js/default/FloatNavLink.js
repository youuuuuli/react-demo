import React, { useContext } from 'react';
import {
  Menu,
  Popup,
  Image,
  List,
} from 'semantic-ui-react';
import ApiContext from './ApiContext';
import Logout from '../login/Logout';
import styles from '../../css/FloatNavLink.module.css';

/**
 * 浮動導覽列
 *
 * @returns {JSX.Element} JSX
 */
const FloatNavLink = () => {
  const { lang, tr } = useContext(ApiContext);

  return (
    <Menu.Menu key={0} className={styles['float-menu']}>
      {/* 浮動導覽列 */}
      <Popup
        className={`${styles['float-nav-link']} ${styles['nav-popup']}`}
        basic
        hoverable
        offset={[0, -9]}
        trigger={<Menu.Item icon="setting" tittle={tr('M_FUNC_FUNC_HELP')} />}
      >
        <List selection verticalAlign="middle">
          {/* 介面語言 */}
          <List.Item>
            <Image avatar src={`/lan_${lang.slice(-2)}.png`} />
            <List.Content>
              <List.Header>{tr(`M_TEXT_${lang.toUpperCase()}`)}</List.Header>
            </List.Content>
          </List.Item>
        </List>
      </Popup>

      {/* 登出 */}
      <Logout />
    </Menu.Menu>
  );
};

export default FloatNavLink;
