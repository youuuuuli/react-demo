import React, { useEffect } from 'react';
import { Sidebar, Menu, Accordion } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import SidebarsMap from '../constants/SidebarsMap';
import { Cookies, classNames, useHistory } from '../utils';
import Clock from './Clock';
import styles from '../../css/Sidebar.module.css';

/**
 * 左側選單
 *
 * @param {object} props properties
 * @param {boolean} props.wide 左側選單是否開啟
 * @param {Function} props.toggleSidebar 開啟/關閉左側選單
 * @returns {JSX.Element} WideSidebar
 */
const WideSidebar = (props) => {
  const username = Cookies.get('username');
  const { wide, toggleSidebar } = props;
  const { location: { pathname } } = useHistory();

  useEffect(() => {
    toggleSidebar({ wide: window.innerWidth > 930 });
  }, [window.innerWidth]);

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      borderless
      className={classNames({ 'wide-sidebar': !!wide, [`${styles['thin-sidebar']}`]: !wide })}
      inverted
      visible
      vertical
    >
      <div className={styles['user-info-wrap']}>
        {username && (
          <span>
            <div className={styles['user-name']}>
              Hi,
              {' '}
              {username}
              &emsp;
            </div>
            <Clock />
          </span>
        )}
      </div>

      <Accordion className={styles['sidebar-accordion']}>
        {SidebarsMap.map(({ content, path }) => (
          <Accordion.Title key={path}>
            <Link to={path}>
              <Menu
                className={classNames({
                  [`${styles['active-item']}`]: pathname === path,
                  [`${styles['current-located']}`]: pathname === path,
                })}
              >
                <Menu.Item>
                  {content}
                </Menu.Item>
              </Menu>
            </Link>
          </Accordion.Title>
        ))}
      </Accordion>
    </Sidebar>
  );
};

export default WideSidebar;
