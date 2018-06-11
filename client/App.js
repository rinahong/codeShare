import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/monokai';

import CustomOpenEdgeMode from './CustomOpenEdgeMode';
// App component - represents the whole app
class App extends Component {

    componentDidMount() {
        const customMode = new CustomOpenEdgeMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    render() {
        return (
            <div className="container">


                <AceEditor
                    ref="aceEditor"
                    theme="monokai"
                    mode="java"
                    highlightActiveLine={true}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 3,
                    }}

                />
            </div>
        );
    }
}

export default App;