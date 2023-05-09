import { createContext } from 'react';

const ApiContext = createContext({
  tr: () => false,
});

export default ApiContext;
