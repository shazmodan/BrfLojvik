import React, {Component} from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import {getWindowWidth} from '../utils'

import './articlePage.css'

export class ArticlePage extends Component {
	static propTypes = {
		article: PropTypes.object.isRequired,
	}

	render() {
		const {article} = this.props
		const backgroundSrc = article.backgroundImage 
			? `${article.backgroundImage.url}?fm=jpg&fl=progressive&w=${parseInt(getWindowWidth() + (getWindowWidth() / 2))}`
			: null

		return (
			<article>
				{article.backgroundImage && (
					<div className="article-image__container">
						<img className="article-image" src={backgroundSrc} alt="background" />
					</div>
				)}
				<div className="container article-page">
					<div className="row">
						<div className="col-xs-12 text-center">
							{article.icon && 
								<img className="article-page__icon" src={article.icon.url} alt={article.icon.alt} />
							}
							<h1>{article.heading}</h1>
							<hr className="article-page__hr" />
							<div className="article-page__markdown" 
								dangerouslySetInnerHTML={{__html: marked(article.markdownText)}} 
							/>
						</div>
					</div>
				</div>
			</article>
		)
	}
}