import React, {Component} from 'react';

import {connect} from 'react-redux';
import { goToPath } from '../../../util';

import VimEditor from '../VimEditor/VimEditor';
import styles from './Vim.scss';

import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

export class Vim extends Component {
    constructor(props) {
        super(props);
        const fullPathToFile = props.terminalPath.concat(props.relativepathToFile);
        const fileText = goToPath(props.dirTree, fullPathToFile);
        this.state = {
            initialText: fileText
        };
    }

    submitCommand(command){
    }

    render() {
        // eslint-disable-next-line
        const {terminalPath, relativepathToFile, dirTree} = {...this.props};
        const {initialText} = {...this.state};
        return (
            <div className={styles.wrapper}>
                <VimEditor 
                    submitCommand={(e) => this.submitCommand(e)}
                    initialText={initialText}
                    filename={relativepathToFile[relativepathToFile.length - 1]} 
                />
            </div>
        );
    }
}

Vim.propTypes = exact({
    terminalPath: PropTypes.arrayOf(PropTypes.string),
    relativepathToFile: PropTypes.arrayOf(PropTypes.string),
    dirTree: PropTypes.object
});

function mapStateToProps(state) {
    return {
        terminalPath: state.terminal.path,
        relativepathToFile: state.terminal.vim.pathToFile,
        dirTree: state.terminal.dirTree
    };
}

export default connect(mapStateToProps)(Vim);