import {extractAppData} from '../extractors/appDataExtractors'

const getApiBaseUrl = () => {
	if (__DEV__) {
		return `${__API_BASE_URL__}/api/`
	}

	return `//${window.location.host}/api/`
}

const allContentUrl = `${getApiBaseUrl()}content/`

const get = url => fetch(url)

export const APP_DATA_REQUEST = 'APP_DATA_REQUEST'
export const APP_DATA_SUCCESS = 'APP_DATA_SUCCESS'
export const APP_DATA_FAILURE = 'APP_DATA_FAILURE'
export const getAppData = () => {
	if (__DEV__) {
		console.log('typeof window.APP_DATA exists: ', (typeof window.APP_DATA))
	}
	
	if (typeof window.APP_DATA !== 'undefined') {
		if (__DEV__) {
			console.log('extractAppData from window.APP_DATA')
		}
		
		return {
			type: APP_DATA_SUCCESS,
			response: extractAppData(window.APP_DATA),
		}
	}

	return {
		types: [APP_DATA_REQUEST, APP_DATA_SUCCESS, APP_DATA_FAILURE],
		shouldCallAPI: (state) => !state.appData._isFetching,
		callAPI: () => get(allContentUrl),
		parse: (response) => response.json().then(extractAppData)
	}
}