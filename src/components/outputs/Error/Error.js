import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

const Error = ({msg}) => {
    return <div className="error-msg">{msg}</div>;
};

Error.propTypes = exact({
    msg: PropTypes.string
});

export default Error;