import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './boardMembersProfile.css'

export class BoardMemberProfile extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		responsibility: PropTypes.string.isRequired,
		photo: PropTypes.shape({
			url: PropTypes.string.isRequired,
			height: PropTypes.number,
			width: PropTypes.number,
			alt: PropTypes.string,
		}).isRequired,
		email: PropTypes.string,
	}

	render() {
		const {name, responsibility, photo, email} = this.props
		
		return (
			<div className="board-members__profile col-xs-12 col-sm-6 col-sm-4 col-md-3">
				<img className="board-members__profile-picture" src={`${photo.url}?fm=jpg`} alt="profile picture" />
				<h3 className="board-members__profile-name">{name}</h3>
				<p className="board-members__profile-responsibility">{responsibility}</p>
				<hr className="board-members__profile-hr"/>
				<p className="board-members__profile-email">{email}</p>
			</div>
		)
	}
}