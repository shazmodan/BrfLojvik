import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Route} from 'react-router-dom'
import {Switch, withRouter} from 'react-router'
import {connect} from 'react-redux'
import Navigation from './Common/Navigation/navigation'
import Footer from './Common/Footer/footer'
import StartPage from './StartPage/startPage'
import {ArticlePage} from './ArticlePage/articlePage'
import BoardMembers from './BoardMembers/boardMembers'
import SearchPage from './SearchPage/searchPage'
import {getAppData} from './actions/appData'
import {map} from 'ramda'
import GoogleAnalytics from './googleAnalytics'

import './bootstrap.css'
import './main.css'

class App extends Component {
	static propTypes = {
		getAppData: PropTypes.func.isRequired,
		articles: PropTypes.array,
		boardMembersData: PropTypes.object,
		searchPageData: PropTypes.object,
	}

	state = {
		appData: null
	}

	componentWillMount() {
		this.props.getAppData()
	}
    
	render() {
		const {articles, searchPageData, boardMembersData} = this.props

		if (__DEV__) {
			console.log('App, this.props.articles', articles)
			console.log('App, this.props.boardMembersData', boardMembersData)
		}
		

		return (
			<div className="App">
				<Navigation />
				<Switch>
					{map((article) => (
						<Route key={article.id} path={article.url} render={(routerProps) =>
							<ArticlePage article={article} {...routerProps} />
						} />
					), articles)}
					{searchPageData && <Route path={searchPageData.url} component={SearchPage} /> } 
					{boardMembersData && <Route path={boardMembersData.url} component={BoardMembers} />}
					<Route path="/" component={StartPage} /> {/* Must be at the bottom (best match with Switch). */}
				</Switch>
				<GoogleAnalytics />
				<Footer />
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	articles: state.appData.articles,
	boardMembersData: state.appData.boardMembersData,
	searchPageData: state.appData.searchPageData,
})

export default withRouter(connect(mapStateToProps, {
	getAppData,
})(App))

