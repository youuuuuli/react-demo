import React, { useState, useEffect, useContext } from 'react';
import { Sidebar, Menu, Form } from 'semantic-ui-react';
import { Cookies, classNames } from '../utils';
import Clock from './Clock';
import styles from '../../css/Sidebar.module.css';
import ApiContext from './ApiContext';

/**
 * 左側選單
 *
 * @param {object} props properties
 * @param {boolean} props.wide 左側選單是否開啟
 * @param {Function} props.toggleSidebar 開啟/關閉左側選單
 * @returns {JSX.Element} WideSidebar
 */
const WideSidebar = (props) => {
  const { tr } = useContext(ApiContext);
  const username = Cookies.get('username');
  const [hasExtension, setHasExtension] = useState(true);
  const [hasMain, setHasMain] = useState(true);
  const [activeItem, setActiveItem] = useState('main');
  const [searchValue, setSearchValue] = useState('');

  const { wide, toggleSidebar } = props;

  /**
   * 處理變更左側選單
   *
   * @param {event} ev event
   * @param {object} params params
   * @param {string} params.name name
   */
  const handleActiveItem = (ev, { name }) => {
    setActiveItem(name);
  };

  /**
   * 處理搜尋欄位
   *
   * @param {Event} ev event
   * @param {object} params param
   * @param {string} params.value 搜尋值
   */
  const handleSearchValue = (ev, { value }) => {
    setSearchValue(value);
  };

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

        <Form autoComplete="off">
          <Form.Input
            className={styles['sidebar-search']}
            icon="search"
            iconPosition="left"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchValue}
          />
        </Form>
      </div>

      <Menu inverted pointing secondary>
        <Menu.Item
          className={classNames(
            styles['sidebar-tab'],
            styles['main-menu'],
            { [styles['non-menu']]: !hasMain },
          )}
          name="main"
          active={activeItem === 'main'}
          onClick={handleActiveItem}
          content={tr('M_TEXT_MAIN_MENU')}
        />

        <Menu.Item
          className={classNames(
            styles['sidebar-tab'],
            styles['extension-menu'],
            { [styles['non-menu']]: !hasExtension },
          )}
          name="extension"
          active={activeItem === 'extension'}
          onClick={handleActiveItem}
          content={tr('M_TEXT_APPLICATION')}
        />
      </Menu>
      {/*
      <ExtensionItems
        toggleSidebar={toggleSidebar}
        visible={activeItem === 'extension'}
        hasExtension={setHasExtension}
        setGotExtension={setGotExtension}
        searchValue={searchValue}
      /> */}

      {/* <MainItems
        visible={activeItem === 'main'}
        hasMain={setHasMain}
        searchValue={searchValue}
      /> */}
    </Sidebar>
  );
};

export default WideSidebar;
