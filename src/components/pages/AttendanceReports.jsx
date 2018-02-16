import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { PageView } from '../common';
import EventLookup from './attendance_reports/EventLookup';
import Report from './attendance_reports/Report';
import LookupResults from './attendance_reports/LookupResults';
import { ipcMysql, ipcGeneral } from '../../actions/ipcActions';
import { AttendanceReportsCss } from '../../style/AttendanceReports.css';

const { ipcRenderer } = window.require('electron');

class AttendanceReports extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventId: props.eventId,
			eventName: props.eventName,
			eventDate: dateFormat('mediumDate'),
			lookupResults: [],
			reportData: props.reportData || {}
		};
		this._resetState = this._resetState.bind(this);
		this._setLookupResults = this._setLookupResults.bind(this);
		this._getAttendanceForEvent = this._getAttendanceForEvent.bind(this);
	}

	render() {
		const {eventId, eventName, eventDate, lookupResults, reportData} = this.state;
		return (
			<PageView rules={AttendanceReportsCss}>
				{eventId &&
					<Report event={{eventId, eventName, eventDate}} reportData={reportData}
							onReset={this._resetState}/>
				}
				{!eventId &&
					[
						<EventLookup key='event-lookup' onResults={this._setLookupResults}/>,
						<LookupResults key='lookup-results' events={lookupResults}
									   onEventSelected={this._getAttendanceForEvent}/>
					]
				}
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			eventId: nextProps.eventId,
			eventName: nextProps.eventName,
			eventDate: dateFormat('mediumDate'),
			reportData: {}
		});
	}

	_resetState() {
		this.setState({
			eventId: null,
			eventName: null,
			eventDate: dateFormat('mediumDate'),
			reportData: {}
		});
	}

	_setLookupResults(events) {
		this.setState({lookupResults: events});
	}

	_getAttendanceForEvent({eventId, eventName, eventDate}) {
		if (eventId) {
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_ATTENDANCE, {eventId});
			ipcRenderer.once(ipcMysql.RETRIEVE_ATTENDANCE, (event, reportData, status) => {
				if (status === ipcGeneral.SUCCESS) {
					this.setState({eventId, eventName, eventDate, reportData});
				}
			});
		}
	}
}

const mapStateToProps = state => ({
	eventId: state.event.eventId,
	eventName: state.event.eventName,
	reportData: state.event.reportData
});

export default connect(mapStateToProps)(AttendanceReports);