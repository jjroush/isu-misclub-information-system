import React from 'react';
import { Column, Table } from '../../common';
// import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class AllTransactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionsTable: this._populateTransactionsTable(props.transactions)
        };
    }

    render() {
        const {transactionsTable} = this.state;
        return (
            <Column title='Transactions' style={{paddingLeft:'40px'}}>
                <p>{Boolean(transactionsTable) ?
                        'Transaction History.' :
                        'No transactions available.'
                    }</p>
                    {transactionsTable}
            {Boolean(transactionsTable) &&
                <Table>
                    <tbody>
                        {transactionsTable}
                    </tbody>
                </Table>
            }
            </Column>
        );
    }

    _populateTransactionsTable(transactions) {
        return transactions && transactions.length ? transactions.map(transaction => (
            <tr id={transaction.id} key={transaction.id}>
                <td className='event-name'>{transaction.name}</td>
            </tr>
        )) : 'dang';
    }
}