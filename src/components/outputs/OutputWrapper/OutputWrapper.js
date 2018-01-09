import React, {Component} from 'react';
import TerminalInput from '../../TerminalInput/TerminalInput';

class OutputWrapper extends Component {
    render() {
        // eslint-disable-next-line
        const {path, user, text, currentDirTree, children} = this.props;
        return (
            <div className="outputWrapper">
                <TerminalInput
                    path={path}
                    user={user}
                    isReadOnly={true}
                    value={text}
                />
                <div className="output">
                    {[...children]}
                </div>
            </div>
        );
    }
}

export default OutputWrapper;