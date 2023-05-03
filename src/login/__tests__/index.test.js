import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../index';

it('renders Login Page', () => {
  const { container } = render(<Login />);
  const linkElement = screen.getByText(/Log-in to your account/i);

  expect(linkElement).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});
