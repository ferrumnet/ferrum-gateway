import React from "react";

const PageNotFound = () => {
  return (
    <div className="w-100 py-5 text-center">
      <h1 className="display-4 ">
        <strong className="text-muted">404</strong>
      </h1>
      <h3 className="text-center h-100 text-danger">The page does not exist.</h3>
    </div>
  );
};

export default PageNotFound;
