import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {map, filter, find} from 'ramda'
import {BoardMemberProfile} from './boardMemberProfile'
import {chairman, boardMember, substitute} from './responsibilityTypes'

import './boardMembers.css'

class BoardMembers extends Component {
	static propTypes = {
		heading: PropTypes.string.isRequired,
		redSubHeading: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		activeBoardMembers: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			responsibilityType: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			photo: PropTypes.object,
			email: PropTypes.string,
		})).isRequired,
	}

	render() {
		const {heading, redSubHeading, text, activeBoardMembers} = this.props
		const chairmanMember = find(member => member.responsibilityType === chairman)(activeBoardMembers)
		const boardMembers = filter(member => member.responsibilityType === boardMember)(activeBoardMembers)
		const substituteMembers = filter(member => member.responsibilityType === substitute)(activeBoardMembers)

		return (
			<section className="container-fluid board-members">
				<div className="container">
					<div className="row">
						<div className="board-member__top col-xs-12">
							<h1 className="board-members__heading text-uppercase">{heading}</h1>
							<hr className="board-members__hr"/>
							<h4 className="board-members__red-heading">{redSubHeading}</h4>
							<p className="board-members__text">{text}</p>
						</div>
					</div>
					<div className="row">
						{chairmanMember && <BoardMemberProfile 
							key={chairmanMember.id}
							name={chairmanMember.name}
							responsibility={chairmanMember.responsibility}
							photo={chairmanMember.photo}
							email={chairmanMember.email}
						/>}
						{map(boardMember => (
							<BoardMemberProfile 
								key={boardMember.id}
								name={boardMember.name}
								responsibility={boardMember.responsibility}
								photo={boardMember.photo}
								email={boardMember.email}
							/>
						), boardMembers)}
						{substituteMembers && 
							<div className="board-members__profile col-xs-12 col-sm-6 col-sm-4 col-md-3">
								<h2>Suppleanter</h2>
								{map(substitute => (
									<div key={substitute.id}>
										<h4 className="board-members__profile-name">{substitute.name}</h4>
									</div>
								), substituteMembers)}
							</div>
						}
					</div>
				</div>
			</section>
		)
	}
}

const mapStateToProps = (state) => ({
	heading: state.appData.boardMembersData.heading,
	redSubHeading: state.appData.boardMembersData.redSubHeading,
	text: state.appData.boardMembersData.text,
	activeBoardMembers: state.appData.boardMembersData.activeBoardMembers,
})

export default connect(mapStateToProps, null)(BoardMembers)