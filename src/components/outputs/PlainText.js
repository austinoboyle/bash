import React from 'react';

const PlainText = ({text}) => (
    <textarea spellCheck={false} className="output">{text}</textarea>
);

export default PlainText;
