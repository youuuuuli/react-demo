import { lazy } from 'react';

const Sidebars = [
  {
    path: '/',
    content: 'Home',
    element: lazy(() => import('../default/Home')),
  },
  {
    path: '/retentionRateLogin',
    content: '登入留存率',
    element: lazy(() => import('../pages/RetentionRateLogin')),
  },
];

export default Sidebars;
