import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';

it('renders Login Page', () => {
  const { container } = render(<LoginForm />);
  const linkElement = screen.getByText(/Log-in to your account/i);

  expect(linkElement).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});
