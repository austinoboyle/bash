import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {quit, write} from '../../actions/vimActions';

import brace from 'brace';
import AceEditor from 'react-ace';

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

const Vim = brace.acequire('ace/keyboard/vim').CodeMirror.Vim

function getLanguageFromFilename(filename) {
    console.log('GETTING LANGUAGE FOR...', filename);
    const mapExtensionToFiletype = {
        js: 'javascript',
        jsx: 'jsx',
        py: 'python',
        markdown: 'markdown',
        md: 'markdown',
        html: 'html',
        rb: 'ruby',
        java: 'java',
        xml: 'xml',
        css: 'css',
        scss: 'sass',
        sass: 'sass'
    };
    try {
        const splitFilenameArray = filename.split(".");
        const ext = splitFilenameArray[splitFilenameArray.length - 1];
        const filetype = mapExtensionToFiletype[ext];
        console.log('FILETYPE IS...', filetype);
        if (filetype !== undefined) {
            return filetype;
        }
        return 'text';
    } catch (e) {
        console.log('ERROR', e);
        return 'text';
    }
}

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
        this.editor.navigateTo(0,0);
    }

    render() {
        const {isReadOnly, filename} = {...this.props};
        return <AceEditor
            mode={getLanguageFromFilename(filename)}
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
            enableLiveAutocompletion={true}
            setOptions={{
                enableLiveAutocompletion: true,
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