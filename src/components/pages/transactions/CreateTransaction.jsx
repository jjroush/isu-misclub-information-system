import React from 'react';
import { Column, InputGroup, ButtonGroup, Button } from '../../common/index';
import { isValidInput } from '../../../utils/validation';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class CreateTransaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionName: '',
            transactionDate: '',
            transactionAmount: '',
            isWidthrawl: '',
            showFormErrors: false,
            isLoading: false,
        };
        this._handleChange = this._handleChange.bind(this);
		// this._handleSubmit = this._handleSubmit.bind(this);
		// this._getFormValidationState = this._getFormValidationState.bind(this);
    }

    render() {
        const {transactionName, transactionAmount, isLoading} = this.state;
        return (
            <Column title='Create Transaction'>
                <form onSubmit={this._handleSubmit} onReset={this._handleChange}>
                <InputGroup id='transaction-name' value={transactionName} onChange={this._handleChange}
                    showErrors={this._getFormValidationState} placeholder='e.g. Food Expenses'
                    required autoFocus>
                    Transaction name
                </InputGroup>
                <InputGroup id='date-range-start' 
					onChange={this._handleChange} type='date'
					showErrors={this._getFormValidationState} required>
					Date
				</InputGroup>
                <InputGroup id='transaction-amount' value={transactionAmount} onChange={this._handleChange}
                    showErrors={this._getFormValidationState} placeholder='0.00'
                    required autoFocus>
                    Amount
                </InputGroup>
                Withdrawl
                <input id='is-withdrawl' type="checkbox" />
                <ButtonGroup isLoading={isLoading}>
					<Button type='submit' info>Create</Button>
					<Button type='reset' black>Clear</Button>
				</ButtonGroup>
                </form>
            </Column>
        );
    }

    _handleChange({target}) {
		// if (target.id === 'transaction-name') {
		// 	this.setState({transactionName: target.value});
		// } else {
		// 	this.setState({transactionName: ''});
        // }
        
        switch (target.id) {
            case 'transaction-name': 
                this.setState({transactionName: target.value});
                break;
            case 'date-range-start': 
                this.setState({transactionDate: target.value});
                break;
            case 'transaction-amount': 
                this.setState({transactionAmount: target.value});
                break;
            case 'is-withdrawl': 
                this.setState({isWithdrawl: target.value});
                break;
            default:
                break;
        }
    }
    
    _handleSubmit(event) {
        event.preventDefault();
            // this.setState({showFormErrors: false, isLoading: true});
            const {transactionName, transactionDate, isWithdrawl, transactionAmount} = this.state;
            ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.CREATE_EVENT, {transactionName, transactionDate, isWithdrawl, transactionAmount});
    
    }

}