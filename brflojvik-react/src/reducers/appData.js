import * as types from '../actions/appData'

const initialState = {
	_isFetching: false,
	parents: [],
	articles: [],
	menuData: [],
	boardMembersData: null,
	startPageData: null,
	searchPageData: null,
	error: null,
	footerData: null,
	topNewsData: null,
}

export default function (state = initialState, action) {
	switch (action.type) {
	case types.APP_DATA_REQUEST:
		return {
			...state,
			_isFetching: true,
		}
	case types.APP_DATA_SUCCESS:
		return {
			...state,
			...action.response,
			_isFetching: false,
			error: null,
		}
	case types.APP_DATA_FAILURE:
		return {
			...state,
			_isFetching: false,
			error: action.error,
		}
	default:
		return state
	}
}