import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

export class IconBox extends Component {
	static propTypes = {
		url: PropTypes.string.isRequired,
		backgroundColor: PropTypes.string.isRequired,
		iconSrc: PropTypes.string.isRequired,
		heading: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		arrowSrc: PropTypes.string.isRequired,
	}

	render() {
		const { props } = this
		const style = { backgroundColor: this.props.backgroundColor }

		return (
			<Link to={props.url} className="iconbox__link">
				<div className="iconbox text-center">
					<div className="iconbox__top">
						<div className="row">
							<img alt="calendar margin-bottom" src={props.iconSrc} className="iconbox__icon col-centered" />
						</div>
						<div className="row">
							<div className="col-xs-12">
								<h5 className="text-uppercase">{props.heading}</h5>
								<hr className="style1" />
								<p>{props.text}</p>
							</div>
						</div>
					</div>
					<div className="iconbox__bottom">
						<div className="row">
							<div className="iconbox__arrow-container col-centered" style={style}>
								<img alt="arrow-icon" src={props.arrowSrc} className="iconbox__arrow " />
							</div>
						</div>
					</div>
				</div>
			</Link>
		)
	}
}


