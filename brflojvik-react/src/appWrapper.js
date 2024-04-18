import React, {Component} from 'react'
import {HashRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import App from './App'
import ScrollToTop from './scrollToTop'
import configureStore from './store'

const store = configureStore()

export class AppWrapper extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<ScrollToTop>
						<App />
					</ScrollToTop>
				</Router>
			</Provider>
		)
	}
}