import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../imports/api/tasks.js';

import CustomOpenEdgeMode from './CustomOpenEdgeMode';
// App component - represents the whole app
class App extends Component {

    renderTasks() {
        return this.props.tasks.map((task) => (
          <Task key={task._id} task={task} />
        ));
    }
    

    // componentDidMount() {
    //     const customMode = new CustomOpenEdgeMode();
    //     this.refs.aceEditor.editor.getSession().setMode(customMode);
    // }

    render() {
        return (



            <div className="container">

            <header>
                <h1>Todo List</h1>
            </header>

            <ul>
                {this.renderTasks()}
            </ul>

                <AceEditor
                    ref="aceEditor"
                    theme="monokai"
                    mode="javascript"
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

export default withTracker(() => {
    return {
      tasks: Tasks.find({}).fetch(),
    };
  })(App);