import React, {Component} from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
 
import 'brace/mode/java';
import 'brace/theme/monokai';

class Vim_Command extends Component {
    constructor(props){
        super(props);
        this.state = {
            isFocused: false
        };
    }


    focus(){
        console.log('FOCUS');
        this.refs.commandInput.editor.focus();
    }

    handleLoad(e) {
        // this.refs.commandInput.editor.addEventListener('click', (ev) => {
        //     ev.preventDefault();
        // });
    }

    render() {
        return <AceEditor
            mode=""
            theme="monokai"
            ref="commandInput"
            onLoad={(e) => this.handleLoad(e)}
            onFocus={() => this.setState({isFocused: true})}
            onBlur={() => this.setState({isFocused: false})}
            onChange={this.props.onChange}
            height="30px"
            width="100%"
            name="vim-command"
            highlightActiveLine={false}
            setOptions={{
                showLineNumbers: false              
            }}
        />;
    }
}

export default Vim_Command;