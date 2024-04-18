import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import Scroll from 'react-scroll-to-element'

import './searchBar.css'

export class SearchBar extends Component {
	static propTypes = {
		noteHeadings: PropTypes.arrayOf(PropTypes.string).isRequired,
	}

	state = {
		value: '',
		suggestions: [],
	}

	getSuggestionValue = suggestion => suggestion

	escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

	getSuggestions = value => {
		const escapedValue = this.escapeRegexCharacters(value.trim())
		
		if (escapedValue === '') {
			return []
		}
		
		const regex = new RegExp(`^${escapedValue}`, 'i')

		return this.props.noteHeadings.filter(noteHeading => regex.test(noteHeading))
	}

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: this.getSuggestions(value)
		})
	}

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		})
	}

	renderSuggestion = (suggestion, { query }) => {
		const matches = AutosuggestHighlightMatch(suggestion, query)
		const parts = AutosuggestHighlightParse(suggestion, matches)

		return (
			<span>
				{parts.map((part, index) => {
					const className = part.highlight ? 'react-autosuggest__suggestion-match' : null

					return (
						<Scroll key={index} type="id" element={suggestion} offset={-30}>
							<span className={className}>
								{part.text}
							</span>
						</Scroll>
					)
				})}
			</span>
		)
	}

	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		})
	}

	render() {
		const {value, suggestions} = this.state
		const inputProps = {
			placeholder: "Sök på ämne, t.ex. 'bredband'",
			value: value,
			onChange: this.onChange
		}

		return (
			<div>
				<Autosuggest 
					suggestions={suggestions}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					getSuggestionValue={this.getSuggestionValue}
					renderSuggestion={this.renderSuggestion}
					inputProps={inputProps}
				/>
			</div>
		)
	}
}