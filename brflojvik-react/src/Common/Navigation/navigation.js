import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes} from 'prop-types'
import {Link} from 'react-router-dom'
import MenuBox from './menuBox'
import {MenuButton} from './menuButton'
import {path, map} from 'ramda'

import './menuBox.css'

import topLojvikBlack from '../../images/wordmark.svg'
import ikonHemSv from '../../images/hem.svg'

class Navigation extends Component {
	static propTypes = {
		menuData: PropTypes.array,
		navigationLinks: PropTypes.array,
	}

	state = {
		showMenu: false,
	}

	toggleMenu = () => {
		if (this.state.showMenu) {
			this.setState({showMenu: false})
		} else {
			this.setState({showMenu: true})
		}
	}

	hideMenu = () => {
		this.setState({showMenu: false})
	}

	render() {
		if (__DEV__) {
			console.log('navigation menuData', this.props.menuData)
		}
		
		return (
			<section className="navigation">
				<div className="container-fluid bg-white">
					<div className="row">
						<Link to="/">
							<img alt="top logo" src={topLojvikBlack} className="img-responsive top-logo" />
						</Link>
						{this.props.menuData && (<MenuButton toggleMenu={this.toggleMenu} />)}
						{this.props.navigationLinks && (
							<div className="top-text navigation-flex hidden-xs navigation__links">
								<Link to="/">
									<div className="navigation__house-icon-container">
										<img src={ikonHemSv} alt="house icon" />
									</div>
								</Link>
								{map(navigationLink => (
									<h5 key={navigationLink.id} className="navigation__links-heading text-uppercase">
										<Link to={navigationLink.url}>{navigationLink.heading}</Link>
									</h5>
								), this.props.navigationLinks)}
							</div>
						)}
					</div>
				</div>
				<MenuBox showMenu={this.state.showMenu} toggleMenu={this.toggleMenu} hideMenu={this.hideMenu} />
			</section>
		)
	}
}

const mapStateToProps = (state) => ({
	menuData: path(['appData', 'menuData'], state),
	navigationLinks: path(['appData', 'startPageData', 'navigationLinks'], state),
})

export default connect(mapStateToProps, null)(Navigation)