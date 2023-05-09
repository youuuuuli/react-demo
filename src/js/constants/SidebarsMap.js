import React from 'react';
import RetentionRateLogin from '../pages/RetentionRateLogin';
import LoginForm from '../components/LoginForm';

const Sidebars = [
  {
    path: '/retentionRateLogin',
    content: '登入留存率',
    element: <RetentionRateLogin />,
  },
  {
    path: '/',
    content: 'Log out',
    element: <LoginForm />,
  },
];

export default Sidebars;
