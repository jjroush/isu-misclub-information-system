import React from 'react';
import { connect } from 'react-redux';
import AdminTools from './pages/AdminTools';
import AttendanceReports from './pages/AttendanceReports';
import CheckIn from './pages/CheckIn';
import Events from './pages/Events';
import Finances from './pages/Finances';
import GraphsTrends from './pages/GraphsTrends';
import Help from './pages/Help';
import Members from './pages/Members';
import NavPanel from './navigation/NavPanel';

class MISClubPage extends React.Component {

	render() {
		return (
			<div>
				<NavPanel/>
				{this._renderActiveView()}
			</div>
		);
	}

	_renderActiveView() {
		return {
			'events': <Events/>,
			'check-in': <CheckIn/>,
			'attendance-reports': <AttendanceReports/>,
			'graphs-trends': <GraphsTrends/>,
			'members': <Members/>,
			'finances': <Finances/>,
			'admin-tools': <AdminTools/>,
			'help': <Help/>
		}[this.props.view];
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

export default connect(mapStateToProps)(MISClubPage);