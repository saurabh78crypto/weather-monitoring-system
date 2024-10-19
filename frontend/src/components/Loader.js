import React from 'react';

const Loader = () => {
  return (
    <div className="text-center mt-4">
      <div className="spinner-border" role="status">
      </div>
      <p>Loading data, please wait...</p>
    </div>
  );
};

export default Loader;
