export default ({ dispatch, getState }) => (next) => (action) => {
	const {
		types,
		callAPI,
		payload = {},
		shouldCallAPI = () => true,
		transform = v => v,
		parse = response => response.json(),
	} = action

	if (!types) {
		// Normal action: pass it on
		return next(action)
	}

	if (!shouldCallAPI(getState())) {
		return null
	}

	const [ requestType, successType, failureType ] = types

	dispatch({
		type: requestType,
		payload,
	})

	return callAPI()
		.then(response => {
			if (response.ok) {
				return response
			} 
			const error = new Error(response.statusText)
			error.response = response
			throw error
			
		})
		.then(parse)
		.then(response => dispatch({
			response: transform(response),
			payload,
			type: successType,
		}))
		.catch(error => dispatch({
			error,
			payload,
			type: failureType
		}))
}
