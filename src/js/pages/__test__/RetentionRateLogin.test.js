import React from 'react';
import { render } from '@testing-library/react';
import RetentionRateLogin from '../RetentionRateLogin';

jest.mock('../../utils/DateRange');
jest.mock('../RetentionRateLoginCharts');

const setup = async () => {
  const utils = render(<RetentionRateLogin />);
  const { findByText } = utils;

  await findByText('2021-10-05 Tuesday');

  return utils;
};

describe('登入留存率', () => {
  it('基本', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
