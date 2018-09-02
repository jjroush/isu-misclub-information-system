import React from 'react';
import { Column, Table } from '../../common';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class AllTransactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionsTable: this._populateTransactionsTable(props.transactions)
        };
        this._handleRowClick = this._handleRowClick.bind(this);
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
                    <thead>
                        <tr>
                            <th>Transaction Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>NetID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody onClick={this._handleRowClick}>
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
                <td><button className='delete'/></td>
            </tr>
        )) : null;
    }

    _handleRowClick({target}) {
        if (target.className === 'delete') {
            const id = target.parentNode.parentNode.id;
            ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.DELETE_TRANSACTION, {id});
            ipcRenderer.once(ipcMysql.DELETE_TRANSACTION, (event, results, status) => {
                if (status === ipcMysql.SUCCESS) {
                    const transactions = this.props.transactions || [];
					this.setState({
						transactionsTable: this._populateTransactionsTable(transactions.filter(transaction =>
                            parseInt(transaction.id, 10) !== parseInt(id, 10)
						))
                    });
                }  
            });     
        }
    }
}