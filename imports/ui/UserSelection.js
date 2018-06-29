import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export class UserSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
			allUsers: [],
			value: [],
    }

		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.toggleCheckbox = this.toggleCheckbox.bind(this);

  }

	componentDidMount() {
		const { meteorUsers = [] } = this.props;
		const { allUsers } = this.state;
		var userArray = [];
		meteorUsers.map(user => (
			userArray.push({ 'label': user.profile.username, 'value': user._id })
		))
		this.setState({allUsers: userArray});
	}

	handleSelectChange (value) {
		var { updateUserPermissionList = () => {} } = this.props;
		console.log('You\'ve selected:', value);
		updateUserPermissionList(value)
		this.setState({ value });
	}

	toggleCheckbox (e) {
		this.setState({
			[e.target.name]: e.target.checked,
		});
	}

	render () {
		const { value, allUsers } = this.state;
		const options = allUsers;
		return (
			<div className="section">
				<Select
					closeOnSelect={false}
					multi
					onChange={this.handleSelectChange}
					options={options}
					placeholder="Select user(s)"
          			removeSelected={true}
					simpleValue
					value={value}
				/>
			</div>
		);
	}
};
