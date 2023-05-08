import React from 'react';
import Home from '../components/Home';
import LoginForm from '../components/LoginForm';

const Sidebars = [
  {
    path: '/home',
    content: 'Home',
    element: <Home />,
  },
  {
    path: '/',
    content: 'Log out',
    element: <LoginForm />,
  },
];

export default Sidebars;
