import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const AccessControl = ({ allowedLevels, children }) => {
  const userAccessLevel = useSelector((state) => state.LevelsData);
  const trueLevels = Object.entries(userAccessLevel)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);

  // Get the history object
  const history = useHistory();

  const isAllowed = allowedLevels.some((level) => trueLevels.includes(level));

  // If not allowed, redirect to the root route with a state object
  React.useEffect(() => {
    if (!isAllowed) {
      history.push('/', { message: 'Access Denied' });
    }
  }, [isAllowed, history]);

  return (
    <>
      {isAllowed ? <>{children}</> : null}
    </>
  );
};

export default AccessControl;
