import React from 'react'
import ReactDOM from 'react-dom'
import {AppWrapper} from './appWrapper'

ReactDOM.render(
	<AppWrapper />,
	document.getElementById('root')
)

const unregisterServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister()
		})
	}
}

unregisterServiceWorker()