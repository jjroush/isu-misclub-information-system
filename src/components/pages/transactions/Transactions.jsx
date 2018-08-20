import React from 'react';
import { Column, Table } from '../../common';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class Transactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionsTable: this._populateTransactionsTable(props)
        };
    }

    render() {
        const 
    }
}