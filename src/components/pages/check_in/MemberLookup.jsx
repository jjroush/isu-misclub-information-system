import React from 'react';
import { Button, InputGroup, Message, ButtonGroup } from '../../common';
import { isValidInput } from '../../../utils/validation';
import {ipcGeneral, ipcMysql} from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class MemberLookup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			netIdNotFound: null,
			showMemberLookupFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getMemberLookupFormValidationState = this._getMemberLookupFormValidationState.bind(this);
	}

	render() {
		return (
			<form id='member-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
				<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
							showValidation={this._getMemberLookupFormValidationState}
							placeholder={'e.g. johndoe'} style={{width:'25%'}} required autoFocus>
					Net-ID
				</InputGroup>
				{Boolean(this.state.netIdNotFound) ?
					<Message header='Not Found' info onDelete={this._handleChange}>
						<p>Net-ID <span style={{fontStyle:'italic',fontWeight:'bold'}}>{this.state.netIdNotFound}</span> not found.</p>
						<Button id='create-member' onClick={this._handleChange}
								style={{marginTop:'2%'}} info autoFocus>
							Create Member?
						</Button>
					</Message> :
					<ButtonGroup isLoading={this.state.isLoading}>
						<Button type='submit' info>Lookup</Button>
						<Button type='reset' black>Clear</Button>
					</ButtonGroup>
				}
			</form>
		);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value, netIdNotFound: null});
		} else if (target.id === 'create-member') {
			this._getDirectoryInfo();
		} else if (target.id === 'member-lookup' || target.className === 'delete') {
			this.setState({netid: '', netIdNotFound: null, showMemberLookupFormErrors: false});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {netid} = this.state;
		if (isValidInput(netid)) {
			this.setState({showMemberLookupFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.LOOKUP_NETID, {netid});
			ipcRenderer.once(ipcMysql.LOOKUP_NETID, (event, results) => {
				if (results && results.hasOwnProperty('netid')) {
					this.props.setMember(results);
					this.props.checkInMember();
				} else {
					this.setState({netIdNotFound: netid, isLoading: false});
					this.props.setMember({netid});
				}
			});
		} else {
			this.setState({showMemberLookupFormErrors: true});
		}
	}

	_getDirectoryInfo() {
		if (this.state.netIdNotFound) {
			ipcRenderer.send(ipcGeneral.REQUEST_DIRECTORY_INFO, null, {netid: this.state.netIdNotFound});
			ipcRenderer.once(ipcGeneral.REQUEST_DIRECTORY_INFO, (event, member) => {
				if (member && member.netid && member.first_name && member.last_name) {
					this.props.setMember(member);
				} else {
					this.props.setMember({netid: this.state.netIdNotFound});
				}
				this.props.createMember();
			});
		}
	}

	_getMemberLookupFormValidationState(value) {
		return !isValidInput(value) && this.state.showMemberLookupFormErrors;
	}
}