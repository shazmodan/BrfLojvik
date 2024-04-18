import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {path, propOr} from 'ramda'
import {StartPageEvent} from './startPageEvent'
import {GoodToKnow} from './goodToKnow'
import {TopNews} from './topNews'
import {getWindowWidth} from '../utils'

import whiteLogo from '../images/logo_vit_prickar.svg'

class StartPage extends Component {   
	static propTypes = {
		nextEvent: PropTypes.shape({
			date: PropTypes.string.isRequired,
			heading: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
		}),
		goodToKnowItems: PropTypes.array,
		slideshow: PropTypes.array,
		searchPageData: PropTypes.shape({
			heading: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
		}),
		topNewsHeading: PropTypes.string,
		topNewsText: PropTypes.string,
		topNewsLink: PropTypes.string,
	}
    
	render() {
		const {nextEvent, goodToKnowItems, slideshow, searchPageData, topNewsHeading, topNewsText, topNewsLink} = this.props

		//TODO: Implement image carousel, see ./slideshow.js

		const first = slideshow ? slideshow[0] : {}
		const backgroundUrl = propOr('', 'url')(first)
		const backgroundStyle = { 
			backgroundImage: `url(${backgroundUrl}?fm=jpg&fl=progressive&w=${parseInt(getWindowWidth() + (getWindowWidth() / 2))})`,
			backgroundPosition: 'center',
			backgroundSize: 'cover',
		}

		return (
			<div>
				<div className="container-fluid text-center" style={backgroundStyle}>
					<div className="container">
						<div className="row">
							<div className="col-xs-5 col-sm-4 col-md-3 col-centered">
								<img alt="Brf Lojvik Logo" src={whiteLogo} className="img-responsive logo" />
							</div>
						</div>
					</div>
				</div>
				{<TopNews heading={topNewsHeading} text={topNewsText} link={topNewsLink} /> }
				{nextEvent && (
					<StartPageEvent date={nextEvent.date} heading={nextEvent.heading} description={nextEvent.description} />
				)}
				{goodToKnowItems && (
					<GoodToKnow goodToKnowItems={goodToKnowItems} />
				)}
				{searchPageData &&
					<Link to={searchPageData.url}>
						<div className="container-fluid bg-white padding-small" />
						<div className="container-fluid bg-red text-white text-center">
							<div className="container">
								<div className="row">
									<div className="col-xs-12">
										<h2 className="text-uppercase">
											<strong>{searchPageData.heading}</strong>
										</h2>
									</div>
								</div>
								<div className="row"><hr className="style2" /></div>
								<div className="row">
									<div className="col-xs-12">
										<p>{searchPageData.description}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="container-fluid bg-white padding-small" />
					</Link>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	nextEvent: path(['appData', 'startPageData', 'nextEvent'], state),
	goodToKnowItems: path(['appData', 'startPageData', 'goodToKnowItems'], state),
	slideshow: path(['appData', 'startPageData', 'slideshow'], state),
	searchPageData: path(['appData', 'startPageData', 'searchPageData'], state),
	topNewsHeading: path(['appData', 'startPageData', 'topNewsHeading'], state),
	topNewsText: path(['appData', 'startPageData', 'topNewsText'], state),
	topNewsLink: path(['appData', 'startPageData', 'topNewsLink'], state),
})

export default connect(mapStateToProps, {})(StartPage)