import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export class SignIn extends Component{

  componentDidMount() {
      this.view = Blaze.render(Template.LoginTemplate,
      ReactDOM.findDOMNode(this.container));
  }


  componentWillUnmount(){
      Blaze.remove(this.view);
  }

  render () {
      return <span ref={(ref) => this.container = ref} />
  }
}
