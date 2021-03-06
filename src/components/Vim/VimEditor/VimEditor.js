import React, { Component } from 'react';
import { connect } from 'react-redux';
import { quit, write } from '../../../actions/vimActions';

import { getLanguageFromFilename } from '../../../util';

import brace from 'brace';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';

// eslint-disable-next-line
import styles from './VimEditor.scss';

import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

// Brace syntax highlighters
import 'brace/mode/java';
import 'brace/mode/jsx';
import 'brace/mode/javascript';
import 'brace/mode/markdown';
import 'brace/mode/python';
import 'brace/mode/html';
import 'brace/mode/xml';
import 'brace/mode/ruby';
import 'brace/mode/css';
import 'brace/mode/sass';

// Theme & Keybindings
import 'brace/theme/monokai';
import 'brace/keybinding/vim';

export const Vim = brace.acequire('ace/keyboard/vim').CodeMirror.Vim;

export class VimEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialText
        };
    }
    getValue() {
        return this.editor.getValue();
    }

    setValue(value) {
        this.editor.setValue(value);
    }

    onChange(newValue) {
        this.setState({ value: newValue });
    }

    componentDidMount() {
        if (!this.vim) {
            this.editor = {
                setValue: () => {},
                getValue: () => {},
                focus: () => {},
                navigateTo: () => {}
            };
        } else {
            this.editor = this.vim.editor;
        }
        const quit = (cm, input) => {
            this.props.quit();
        };
        const write = (cm, input) => {
            this.props.write(this.getValue());
        };
        Vim.defineEx('write', 'w', write);
        Vim.defineEx('quit', 'q', quit);
        Vim.defineEx('q!', 'q!', quit);
        Vim.defineEx('wq', 'wq', () => {
            write();
            quit();
        });
        Vim.defineEx('wq!', 'wq!', () => {
            write();
            quit();
        });
        this.setValue(this.props.initialText);
        this.editor.focus();
        this.editor.navigateTo(0, 0);
    }

    render() {
        const { filename } = { ...this.props };
        return (
            <AceEditor
                mode={getLanguageFromFilename(filename)}
                theme="monokai"
                ref={el => {
                    this.vim = el;
                }}
                onChange={val => this.onChange(val)}
                height="auto"
                value={this.state.value}
                width="100%"
                name="vim-editor"
                keyboardHandler="vim"
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                }}
            />
        );
    }
}

VimEditor.propTypes = exact({
    filename: PropTypes.string.isRequired,
    initialText: PropTypes.string.isRequired,
    write: PropTypes.func.isRequired,
    quit: PropTypes.func.isRequired
});

const actions = {
    quit,
    write
};

export default connect(
    null,
    actions
)(VimEditor);
