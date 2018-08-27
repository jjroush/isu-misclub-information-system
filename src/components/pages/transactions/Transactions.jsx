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
                        null :
                        'No transactions available.'
                    }</p>
            {Boolean(transactionsTable) &&
                <Table>
                    <tbody>
                        <tr>
                            <th>Transaction Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>NetID</th>
                        </tr>
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
                <td className={transaction.withdrawl ? 'transaction-negative' : 'transaction-positive'}>{Number(transaction.amount).toFixed(2)}</td>
                <td>{transaction.date}</td>
                <td>{transaction.netid}</td>
            </tr>
        )) : null;
    }
}