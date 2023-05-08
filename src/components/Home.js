import React, { useState } from 'react';

const Home = () => {
  const [title] = useState('Home');

  return (
    <div>{title}</div>
  );
};

export default Home;
