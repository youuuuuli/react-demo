import { createContext } from 'react';

const ApiContext = createContext({
  lang: 'zh-cn',
  tr: () => false,
});

export default ApiContext;
