import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {map, isEmpty} from 'ramda'
import {Link} from 'react-router-dom'

import ikonArrowRight from '../../images/pil_rund_vit.svg'

class MenuBox extends Component {
	static propTypes = {
		showMenu: PropTypes.bool.isRequired,
		toggleMenu: PropTypes.func.isRequired,
		hideMenu: PropTypes.func.isRequired,
		menuData: PropTypes.array,
	}

	render () {
		const {showMenu, menuData} = this.props
		if (!showMenu || isEmpty(menuData)) {
			return null
		}

		return (
			<div className="menu-box">
				<div className="menu-box__flex pointer" onClick={this.props.toggleMenu}>
					<p className="text-uppercase no-margins">Stäng menyruta</p>
					<img className="menu-box__arrow-right" src={ikonArrowRight} alt="arrow right"/>
				</div>
				<ul id="menu-pop">
					{map((parentItem) => (
						<li key={parentItem.heading} >
							<h2>{parentItem.heading}</h2>
							<hr className="menu-box__underline" />
							<ul className="menu-box__sub">
								{map((subMenuItem) => (
									<li key={subMenuItem.heading} onClick={this.props.hideMenu}>
										<Link to={subMenuItem.url}>{subMenuItem.heading}</Link>
									</li>
								), parentItem.subMenuItems)}
							</ul>
						</li>
					), menuData)}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	menuData: state.appData.menuData,
})

export default connect(mapStateToProps, null)(MenuBox)

