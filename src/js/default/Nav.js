import React, { useContext } from 'react';
import { Menu, Sidebar, Icon, Button } from 'semantic-ui-react';
import FloatNavLink from './FloatNavLink';
import styles from '../../css/Nav.module.css';
import ApiContext from './ApiContext';

/**
 * 導覽列
 *
 * @param {object} props properties
 * @param {boolean} props.wide 左側選單是否開啟
 * @param {Function} props.toggleSidebar 開啟/關閉左側選單
 * @returns {JSX.Element} JSX
 */

const Nav = (props) => {
  const { wide, toggleSidebar } = props;
  const { config: { name } } = useContext(ApiContext);

  /**
   * 處理收合選單
   */
  const handleToggleMenu = () => {
    if (window.innerWidth <= 1024) {
      toggleSidebar(true);

      return;
    }

    toggleSidebar();
  };

  return (
    <Sidebar.Pushable className={styles.nav}>
      <Sidebar as={Menu} animation="overlay" visible={wide} inverted borderless>
        <Menu.Menu>
          <Button content={name} className={styles['nav-home']} />
          <Menu.Item className={styles['nav-collapse']} onClick={handleToggleMenu}>
            <Icon name="arrow alternate circle left outline" size="large" />
          </Menu.Item>
        </Menu.Menu>
      </Sidebar>

      <Sidebar.Pusher>
        <Menu inverted borderless>
          {!wide && (
            <Menu.Menu position="left" className={styles['nav-hall-name']}>
              <Menu.Item onClick={handleToggleMenu}>
                <Icon name="content" />
                {name}
              </Menu.Item>
            </Menu.Menu>
          )}

          <FloatNavLink position="nav" />
        </Menu>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Nav;
