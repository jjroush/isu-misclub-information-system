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
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
    }

    render() {
        const {transactionName, isLoading} = this.state;
        return (
            <Column title='Create Transaction'>
                <form onSubmit={this._handleSubmit} onReset={this._handleChange}>
                <InputGroup id='transaction-name' value={transactionName} onChange={this._handleChange}
                            showErrors={this._getFormValidationState} placeholder='e.g. Food Expenses'
                            required autoFocus>
                            Transaction name
                            </InputGroup>
                </form>
            </Column>
        );
    }
}