import React, {Component} from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

import ikonObs from '../images/kalendarium_color.svg'
import './startPageEvent.css'

export class StartPageEvent extends Component {
	static propTypes = {
		heading: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}

	render() {
		const {heading, date, description} = this.props
		const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' }
		const formattedDate = new Date(date).toLocaleDateString('sv-se', dateOptions)

		return (
			<div className="container-fluid bg-white">
				<div className="container">
					<div className="row">
						<div className="col-xs-2 col-sm-1 col-md-1 col-centered">
							<img alt="important" src={ikonObs} className="startPageEvent__important img-responsive important-img" />
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 text-center text-red">
							<h4 className="text-uppercase">{formattedDate}</h4>
							<hr className="style3" />
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 text-center padding-bottom">
							<h2 className="text-uppercase font-thin">{heading}</h2>
							<div
								dangerouslySetInnerHTML={{__html: marked(description)}} 
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}