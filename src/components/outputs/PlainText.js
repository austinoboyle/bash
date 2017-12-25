import React from 'react';

const PlainText = ({text}) => (
    <textarea spellCheck={false} className="output" value={text} />
);

export default PlainText;
