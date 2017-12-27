import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {quit, write} from '../../actions/vimActions';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/keybinding/vim';
const ace = require("brace")
const Vim = ace.acequire('ace/keyboard/vim').CodeMirror.Vim

class Vim_Editor extends Component {
    getValue() {
        return this.editor.getValue();
    }

    setValue(value){
        this.editor.setValue(value);
    }

    componentDidMount(){
        Vim.defineEx("write", "w", (cm, input) => {
            this.props.write(this.getValue());
        });
        Vim.defineEx("quit", "q", (cm, input) => {
            this.props.quit();
        });
        Vim.defineEx("q!", "q!", (cm, input) => {
            this.props.quit();
        });
        // Vim.map("wq", "writequit", "Normal");
        Vim.defineEx("wq", "wq", (cm, input) => {
            this.props.write(this.getValue());
            this.props.quit();
        });
        Vim.defineEx("wq!", "wq!", (cm, input) => {
            this.props.write(this.getValue());
            this.props.quit();
        });
        this.editor = this.refs.Vim_Editor.editor;
        this.setValue(this.props.initialText);
        this.editor.focus();
    }

    render() {
        const {isReadOnly} = {...this.props};
        return <AceEditor
            mode="javascript"
            theme="monokai"
            ref="Vim_Editor"
            // onChange={onChange}
            height="auto"
            width="100%"
            value={`test
            this is a multiline
            test function()
            test`}
            name="vim-editor"
            keyboardHandler="vim"
            setOptions={{
                cursorStyle: "wide"
            }}
        />;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        quit,
        write
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Vim_Editor);