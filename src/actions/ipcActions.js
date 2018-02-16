const ipcGeneral = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	ACTION_NOT_PERFORMED: 'ACTION_NOT_PERFORMED',
	SET_WINDOW: 'SET_WINDOW',
	LOGIN_WINDOW: 'LOGIN_WINDOW',
	MIS_CLUB_PAGE_WINDOW: 'MIS_CLUB_PAGE_WINDOW',
	REQUEST_DIRECTORY_INFO: 'REQUEST_DIRECTORY_INFO',
	WRITE_ATTENDANCE_TO_CSV: 'WRITE_ATTENDANCE_TO_CSV'
};

const ipcMysql = {
	EXECUTE_SQL: 'EXECUTE_SQL',
	VERIFY_CREDENTIALS: 'VERIFY_CREDENTIALS',
	RETRIEVE_EVENTS_TODAY: 'RETRIEVE_EVENTS_TODAY',
	CREATE_EVENT: 'CREATE_EVENT',
	EDIT_EVENT: 'EDIT_EVENT',
	DELETE_EVENT: 'DELETE_EVENT',
	RETRIEVE_EVENT_BY_ID: 'RETRIEVE_EVENT_BY_ID',
	LOOKUP_NETID: 'LOOKUP_NETID',
	CREATE_MEMBER: 'CREATE_MEMBER',
	UPDATE_MEMBER: 'UPDATE_MEMBER',
	RETRIEVE_ATTENDANCE: 'RETRIEVE_ATTENDANCE',
	FIND_EVENTS: 'FIND_EVENTS'
};

// module.exports used because they are needed
// by main file 'electron.js' which
// is not bundled with webpack
module.exports = {
	ipcGeneral,
	ipcMysql
};
