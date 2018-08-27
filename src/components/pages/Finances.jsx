import React from 'react';
import { connect } from 'react-redux';
import { PageView } from '../common';
import CreateTransaction from './transactions/CreateTransaction';
import Transactions from './transactions/Transactions';

class Finances extends React.Component {

	render() {
		return (
			<PageView>
				{/* <CreateTransaction {...this.props}/> */}
				<Transactions {...this.props} />
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
}

const mapStateToProps = state => ({
	transactions: state.transaction.transactions
});

export default connect(mapStateToProps)(Finances);
  