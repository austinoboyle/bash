import React, {Component} from 'react';
import styles from './PlainText.scss';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

class PlainText extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows: 1
        };
    }

    resize(e){
        if (this.textarea !== null && this.textarea !== undefined){
            const cols = this.textarea.cols;
            let numRows = 0;
            this.props.text.split("\n").forEach((line) => {
                numRows += 1;
                numRows += Math.floor( line.length / cols );
            });
            this.setState({
                rows: numRows
            });
        }
    }

    componentWillUnmount(){
        window.removeEventListener('resize', (e) => this.resize(e));
    }

    componentDidMount(){
        window.addEventListener('resize', (e) => this.resize(e));
        this.resize();
    }

    render () {
        const {text} = {...this.props};
        const {rows} = {...this.state};
        return (
            <textarea
                ref={(el) => {this.textarea = el;}}
                readOnly={true}
                spellCheck={false}
                value={text}
                rows={rows}
                className={styles.text}
            />
        );
    }
};

PlainText.propTypes = exact({
    text: PropTypes.string.isRequired
});

export default PlainText;
