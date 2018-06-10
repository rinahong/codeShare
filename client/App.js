import React, { Component } from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';



import Task from './Task.js';

// App component - represents the whole app
export default class App extends Component {
    getTasks() {
        return [
            { _id: 1, text: 'This is task 1' },
            { _id: 2, text: 'This is task 2' },
            { _id: 3, text: 'This is task 3' },
        ];
    }

    renderTasks() {
        return this.getTasks().map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

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
                    mode="java"
                    theme="github"
                    name="blah1"
                    height="6em"
                />
            </div>
        );
    }
}