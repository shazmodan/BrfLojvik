import React from 'react'
import PropTypes from 'prop-types'

export class MenuButton extends React.Component {
	static propTypes = {
		toggleMenu: PropTypes.func.isRequired,
	}
	
	render() {
		return (
			<div className="menu pointer" onClick={this.props.toggleMenu}>
				<div className="menu-button">
					<hr />
					<hr />
					<hr />
					<p className="text-uppercase text-center">Meny</p>
				</div>
			</div>
		)
	}
}