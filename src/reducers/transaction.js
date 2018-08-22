import { SET_TRANSACTIONS } from '../actions/reduxActions';

const initialState = {
	transactions: []
};

const transaction = (state = initialState, action) => {
	switch (action.type) {
		case SET_TRANSACTIONS:
			return {
				...state,
				transactions: action.transactions
			};
		default:
			return state;
	}
};

export default transaction;