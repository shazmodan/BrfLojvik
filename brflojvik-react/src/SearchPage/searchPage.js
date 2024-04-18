import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {map, filter, pluck, flatten} from 'ramda'
import marked from 'marked'
import {SearchBar} from './searchBar'

import './searchPage.css'

class SearchPage extends Component {
	static propTypes = {
		heading: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		notes: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			heading: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
		})),
	}

	alphabeticalSort = (a, b) => {
		if (a.heading > b.heading) {
			return 1
		} else if (a.heading < b.heading) {
			return -1
		}
		return 0
	}

	sortNotes = unsortedNotes => {
		const alphabet = map(letter => ({
			letter: letter,
			notes: filter(note => note.heading.toLowerCase().startsWith(letter), unsortedNotes).sort(this.alphabeticalSort)
		}), 'abcdefghijklmnopqrstuvwxyzåäö'.split(''))
		
		return alphabet
	}

	render () {
		const {heading, description, notes} = this.props
		const sortedNoteSections = this.sortNotes(notes)
		const flattenedSortedNotes = flatten(pluck('notes', sortedNoteSections))
		const noteHeadings = pluck('heading', flattenedSortedNotes)

		return (
			<section className="searchPage">
				<div className="container-fluid searchPage__top">
					<div className="container">
						<h1 className="searchPage__top-heading">{heading}</h1>
						<hr className="searchPage__top-hr" />
						<p className="searchPage__top-description">{description}</p>
					</div>
					<div className="container">
						<SearchBar noteHeadings={noteHeadings} />
					</div>
				</div>
				<div className="container searchPage__bottom">
					{sortedNoteSections && map(item => item.notes.length > 0 && (
						<div key={item.letter} className="searchPage__alphabet">
							<h2 className="searchPage__alphabet-letter">{item.letter}</h2>
							<hr className="searchPage__alphabet-letter-hr" />
							{map(note => (
								<article key={note.id} id={note.heading}>
									<h3 className="searchPage__article-heading">{note.heading}</h3>
									<hr className="searchPage__article-heading-hr" />
									<div className="searchPage__article-markdown" 
										dangerouslySetInnerHTML={{__html: marked(note.description)}} 
									/>
									<p className="searchPage__article-paragraph">{}</p>	
								</article>
							), item.notes)}
						</div>
					), sortedNoteSections)}
				</div>
			</section>
		)
	}
}

const mapStateToProps = (state) => ({
	heading: state.appData.searchPageData.heading,
	description: state.appData.searchPageData.description,
	notes: state.appData.searchPageData.notes,
})

export default connect(mapStateToProps, null)(SearchPage)


