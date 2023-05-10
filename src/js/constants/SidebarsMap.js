import React from 'react';
import RetentionRateLogin from '../pages/RetentionRateLogin';

const Sidebars = [
  {
    path: '/retentionRateLogin',
    content: '登入留存率',
    element: <RetentionRateLogin />,
  },
  {
    path: '/',
    content: 'Log out',
  },
];

export default Sidebars;
