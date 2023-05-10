import React, { Suspense, useState } from 'react';
import { Container, Segment, Sidebar } from 'semantic-ui-react';
import styles from '../../css/Sidebar.module.css';
import { classNames } from '../utils';
import Nav from './Nav';
import WideSidebar from './WideSidebar';

const Default = () => {
  const [wide, setWide] = useState(true);

  /**
   * 開關左側選單
   *
   * @param {object} params params
   * @param {boolean} params.wide 左側選單是否開啟
   */
  function toggleSidebar({ wide: newWide } = {}) {
    setWide(newWide !== undefined ? newWide : !wide);
  }

  return (
    <>
      {/* 導覽列 */}
      <Nav wide={wide} toggleSidebar={toggleSidebar} />

      <Sidebar.Pushable as={Segment} className={styles['my-sidebar']}>
        <WideSidebar wide={wide} toggleSidebar={toggleSidebar} />
        <Sidebar.Pusher className={classNames('inner-page-pusher', { thin: wide })}>
          <Suspense fallback={<div>Loading...</div>}>
            <Container fluid className="page-content" />
          </Suspense>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};

export default Default;
