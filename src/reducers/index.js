import { combineReducers } from 'redux';
import navigation from './navigation';
import event from './event';
import transaction from './transaction';
import authorization from './authorization';

export const checkinApp = combineReducers({
	navigation,
	event,
	transaction,
	authorization
});