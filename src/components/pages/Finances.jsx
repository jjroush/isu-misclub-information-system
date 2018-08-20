import React from 'react';
import { PageView } from '../common';
import CreateTransaction from './transactions/CreateTransaction';

class Finances extends React.Component {

	render() {
		return (
			<PageView>
				<CreateTransaction {...this.props}/>
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
}

export default Finances;
  