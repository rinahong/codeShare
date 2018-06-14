import React,{Component} from 'react';
import { UserDocuments } from '../api/userDoc.js';

class LandingPage extends Component {
  constructor(props) {
    super(props)

    this.createDocucment = this.createDocucment.bind(this);
  }

  createDocucment() {
  //   console.log("===================>>>", In CreateNew)
  //   Documents.insert({
  //     id: max(id) of document table,
  //     "",
  //     createdAt: new Date(), // current time
  //   });
  //
  //   UserDocuments.insert()
  //
  //
  }
  render() {
    return (
      <main
        className='LandingPage'
        style={{padding: '0 20px'}}
      >
        <h2>Landing Page</h2>
        <button onClick={this.createDocucment}> Create New Document</button>
      </main>

    );
  }

}

export {LandingPage};
