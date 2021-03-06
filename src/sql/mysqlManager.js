const isDev = require('electron-is-dev'),
	mysql = require('mysql'),
	mysqlDB = require('./mysqlDB');

class mysqlManager {
	constructor(logger) {
		this.logger = logger;
		this.isOffline = process.argv[2] === 'offline';
		this.createPool();
	}

	createPool() {
		if (this.isOffline) {
			return;
		}
		this.logger.debug('Creating pool');
		this.pool = mysql.createPool(mysqlDB);
	}

	endPool() {
		return new Promise(resolve => {
			if (this.isOffline) {
				return resolve();
			}
			this.pool.end(error => {
				if (error) {
					this.logger.error(error);
				} else {
					this.logger.debug('Pool ended successfully.');
				}
				resolve();
			});
		});
	}

	sqlQueryHandler(sqlStatement, sqlParams) {
		return new Promise((resolve, reject) => {
			if (this.isOffline) {
				this.logger.debug(`Offline Mode | ${sqlStatement}`);
				return resolve();
			}
			this.logger.debug(`Executing query... | ${sqlStatement}`);
			this.pool.query(sqlStatement, sqlParams, (error, results) => {
				if (error) {
					return reject(error);
				}
				resolve(results);
			});
		});
	}

	testPoolConnection() {
		return new Promise((resolve, reject) => {
			if (this.isOffline) {
				this.logger.debug('Offline Mode Active');
				return resolve();
			}
			this.logger.debug('Testing pool connection...');
			this.pool.getConnection((error, connection) => {
				if (error) {
					return reject(error);
				}
				connection.ping(error => {
					connection.release();
					if (error) {
						return reject(error);
					}
					resolve();
				});
			});
		});
	}

	findEventsToday() {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_event} WHERE event_date=CURRENT_DATE ORDER BY event_id DESC`
		);
	}

	createEvent(eventName) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_event} (event_name,event_date) VALUES (?,CURRENT_DATE)`,
			[eventName]
		);
	}

	editEvent(eventId, eventName) {
		return this.sqlQueryHandler(
			`UPDATE ${is_event} SET event_name=? WHERE event_id=?`,
			[eventName, eventId]
		);
	}

	deleteEvent(eventId) {
		return this.sqlQueryHandler(
			`DELETE FROM ${is_event} WHERE event_id=?`,
			[eventId]
		);
	}

	retrieveEventData(eventId) {
		return this.sqlQueryHandler(
			'SELECT event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} WHERE event_id=?`,
			[eventId]
		);
	}

	verifyCredentials(netid) {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_acl} WHERE netid=?`,
			[netid]
		);
	}

	lookupNetid(netid) {
		return this.sqlQueryHandler(
			`SELECT * FROM ${is_member} m ` +
			'LEFT JOIN (' +
				'SELECT timestamp as last_updated,netid ' +
				`FROM ${is_activity_history} ` +
				'WHERE netid=? AND activity_type IN (\'Information Updated\',\'Member Added\',\'Information Imported\') ' +
				'ORDER BY timestamp DESC ' +
				'LIMIT 1' +
			') a ' +
			'ON m.netid=a.netid ' +
			'WHERE m.netid=?',
			[netid, netid]
		);
	}

	retrieveMemberAttendance(netid) {
		return this.sqlQueryHandler(
			'SELECT e.event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} e, ${is_attendance} a ` +
			'WHERE e.event_id=a.event_id AND netid=? ' +
			'ORDER BY e.event_id DESC',
			[netid]
		);
	}

	retrieveMemberActivity(netid) {
		return this.sqlQueryHandler(
			'SELECT activity_type,DATE_FORMAT(timestamp,\'%l:%i%p %b %e, %Y\') as activity_time ' +
			`FROM ${is_activity_history} ` +
			'WHERE netid=? ORDER BY timestamp DESC',
			[netid]
		);
	}

	recordMemberActivity(netid, activityType) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_activity_history} (netid,activity_type) VALUES (?,?)`,
			[netid, activityType]
		);
	}

	checkInMember(member, eventId) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_attendance} (netid,event_id,major,classification) VALUES (?,?,?,?)`,
			[member.netid, eventId, member.major, member.classification]
		);
	}

	createMember(member) {
		return this.sqlQueryHandler(
			`INSERT INTO ${is_member} ` +
			'(netid,first_name,last_name,major,classification,semesters_remaining,free_meeting_used) ' +
			'VALUES (?,?,?,?,?,?,?)',
			[member.netid, member.first_name, member.last_name, member.major, member.classification, member.payment, 1]
		);
	}

	updateMemberInfo(member) {
		return this.sqlQueryHandler(
			`UPDATE ${is_member} SET first_name=?,last_name=?,` +
			'major=?,classification=?,semesters_remaining=(semesters_remaining+?),free_meeting_used=? ' +
			'WHERE netid=?',
			[
				member.first_name, member.last_name, member.major, member.classification, member.payment,
				member.free_meeting_used, member.netid
			]
		);
	}

	getAttendanceForEvent(eventId) {
		return this.sqlQueryHandler(
			'SELECT a.*, m.first_name, m.last_name ' +
			`FROM ${is_attendance} a LEFT JOIN ${is_member} m ` +
			'ON m.netid=a.netid ' +
			'WHERE event_id=? ' +
			'ORDER BY a.netid ASC',
			[eventId]
		);
	}

	getEventClassificationStats(eventId) {
		return this.sqlQueryHandler(
			'SELECT classification, COUNT(*) as count ' +
			`FROM ${is_attendance} ` +
			'WHERE event_id=? ' +
			'GROUP BY classification',
			[eventId]
		);
	}

	getEventMajorStats(eventId) {
		return this.sqlQueryHandler(
			'SELECT major, COUNT(*) as count ' +
			`FROM ${is_attendance} ` +
			'WHERE event_id=? ' +
			'GROUP BY major',
			[eventId]
		);
	}

	findEvents(dateRangeStart, dateRangeEnd, eventName = '') {
		return this.sqlQueryHandler(
			'SELECT event_id,event_name,DATE_FORMAT(event_date,\'%b %e, %Y\') as event_date ' +
			`FROM ${is_event} ` +
			'WHERE event_date>=? AND event_date<=? AND event_name LIKE ? ' +
			'ORDER BY event_id DESC',
			[dateRangeStart, dateRangeEnd, `%${eventName}%`]
		);
	}

	queryHistoricalEvents(dateRangeStart, dateRangeEnd, eventName = '') {
		return this.sqlQueryHandler(
			'SELECT a.event_id,event_name,event_date,' +
			'IFNULL(Freshmen,0) as freshmen,IFNULL(Sophomores,0) as sophomores,IFNULL(Juniors,0) as juniors,' +
			'IFNULL(Seniors,0) as seniors,IFNULL(Graduates,0) as graduates,IFNULL(Faculty,0) as faculty,IFNULL(Other,0) as other ' +
			`FROM ${is_event} a ` +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Freshmen ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Freshman\' ' +
				'GROUP BY classification, event_id' +
			') b ON a.event_id=b.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Sophomores ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Sophomore\' ' +
				'GROUP BY classification, event_id' +
			') c ON a.event_id=c.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Juniors ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Junior\' ' +
				'GROUP BY classification, event_id' +
			') d ON a.event_id=d.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Seniors ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Senior\' ' +
				'GROUP BY classification, event_id' +
			') e ON a.event_id=e.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Graduates ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Graduate\' ' +
				'GROUP BY classification, event_id' +
			') f ON a.event_id=f.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Faculty ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Faculty\' ' +
				'GROUP BY classification, event_id' +
			') g ON a.event_id=g.event_id ' +
			'LEFT JOIN (' +
				'SELECT event_id, COUNT(*) as Other ' +
				`FROM ${is_attendance} ` +
				'WHERE classification=\'Other\' ' +
				'GROUP BY classification, event_id' +
			') h ON a.event_id=h.event_id ' +
			'WHERE event_date>=? AND event_date<=? AND event_name LIKE ? ' +
			'ORDER BY event_id',
			[dateRangeStart, dateRangeEnd, `%${eventName}%`]
		);
	}
}

module.exports = mysqlManager;

const _determineTableNameForEnv = table => isDev ? table + '_dev' : table;

const is_acl = _determineTableNameForEnv('is_acl');
const is_activity_history = _determineTableNameForEnv('is_activity_history');
// const is_admin_history = _determineTableNameForEnv('is_admin_history');
const is_attendance = _determineTableNameForEnv('is_attendance');
const is_event = _determineTableNameForEnv('is_event');
const is_member = _determineTableNameForEnv('is_member');