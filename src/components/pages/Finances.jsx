import React from 'react';
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

export default Finances;
  