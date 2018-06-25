import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export class UserSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
			allUsers: [],
			removeSelected: true,
			disabled: false,
			stayOpen: false,
			value: [],
			rtl: false,
    }

		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.toggleCheckbox = this.toggleCheckbox.bind(this);
		this.toggleRtl = this.toggleRtl.bind(this);

		// propTypes: {
		// 	hint: PropTypes.string,
		// 	label: PropTypes.string
		// },

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
	toggleRtl (e) {
		let rtl = e.target.checked;
		this.setState({ rtl });
	}

	render () {
		const { disabled, stayOpen, value, allUsers } = this.state;
		const options = allUsers;
		return (
			<div className="section">
				<Select
					closeOnSelect={!stayOpen}
					disabled={disabled}
					multi
					onChange={this.handleSelectChange}
					options={options}
					placeholder="Select your favourite(s)"
          removeSelected={this.state.removeSelected}
					rtl={this.state.rtl}
					simpleValue
					value={value}
				/>

				<div className="checkbox-list">
					<label className="checkbox">
						<input type="checkbox" className="checkbox-control" name="removeSelected" checked={this.state.removeSelected} onChange={this.toggleCheckbox} />
						<span className="checkbox-label">Remove selected options</span>
					</label>
					<label className="checkbox">
						<input type="checkbox" className="checkbox-control" name="disabled" checked={this.state.disabled} onChange={this.toggleCheckbox} />
						<span className="checkbox-label">Disable the control</span>
					</label>
					<label className="checkbox">
						<input type="checkbox" className="checkbox-control" name="stayOpen" checked={stayOpen} onChange={this.toggleCheckbox}/>
						<span className="checkbox-label">Stay open when an Option is selected</span>
					</label>
					<label className="checkbox">
						<input type="checkbox" className="checkbox-control" name="rtl" checked={this.state.rtl} onChange={this.toggleCheckbox} />
						<span className="checkbox-label">rtl</span>
					</label>
				</div>
			</div>
		);
	}
};
