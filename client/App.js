import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/monokai';

var sharedb = require('sharedb/lib/client');
var StringBinding = require('sharedb-string-binding');

// Open WebSocket connection to ShareDB server
var socket = new WebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

var doc = connection.get('examples', 'textarea');
doc.subscribe(function(err) {
    if (err) throw err;
    var element = document.querySelector('textarea');
    var binding = new StringBinding(element, doc);
    binding.setup();
});


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