import React from 'react';
import { render } from '@testing-library/react';
import Login from '../index';

const useHistory = require('../../utils/useHistory');

let path = '';

describe('登入頁', () => {
  beforeEach(() => {
    useHistory.default = jest.fn().mockReturnValue({
      forward: jest.fn((url) => {
        path = url;

        return path;
      }),
    });
  });

  it('基本', () => {
    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });
});
