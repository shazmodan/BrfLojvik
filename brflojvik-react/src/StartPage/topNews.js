import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {not} from 'ramda'

import './topNews.css'

export class TopNews extends Component {
	static propTypes = {
		heading: PropTypes.string,
		text: PropTypes.string,
		link: PropTypes.string,
	}

	render() {
		const {heading, text, link} = this.props
		if (not(heading && text)) {
			return null
		}

		const shouldRenderLink = link !== ''
		const getMainRender = () => (
			<div className="container">
				<div className="row">
					<div className="col-xs-12 text-center padding-bottom">
						<h2 className="text-uppercase font-thin">{heading}</h2>
						<p>{text}</p>
					</div>
				</div>
			</div>
		)

		const renderWithLink = (link, children) => (
			<Link to={link} className="topNews__link">
				{children}
			</Link>
		)

		const html = shouldRenderLink
			? renderWithLink(link, getMainRender())
			: getMainRender()

		return (
			<div className="container-fluid topNews__container">
				{html}
			</div>
		)
	}
}