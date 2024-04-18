/* eslint-disable camelcase */

import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

class GoogleAnalytics extends React.Component {
	static propTypes = {
		location: PropTypes.object,
	}

	componentWillUpdate ({ location, history }) {
		const gtag = window.gtag

		if (location.pathname === this.props.location.pathname) {
			// don't log identical link clicks (nav links likely)
			return
		}

		if (history.action === 'PUSH' && typeof(gtag) === 'function') {
			const event = {
				page_title: document.title,
				page_location: window.location.href,
				page_path: location.pathname
			}
			gtag('config', 'UA-65290076-2', event)
		}
	}

	render () {
		return null
	}
}

export default withRouter(GoogleAnalytics)