import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {map, isEmpty, isNil} from 'ramda'
import {IconBox} from './iconBox'

import ikonArrowRight from '../images/pil_vit.svg'

const colors = [
	'#001f3f',
	'#605ca8',
	'#00a65a',
	'#d81b60',
	'#f15f5c',
	'#6ba9a3',
	'#16a9e0',
	'#8c386f',
	'#39cccc',
]


export class GoodToKnow extends Component {
	static propTypes = {
		goodToKnowItems: PropTypes.array,
	}
	

	render() {
		if (!this.props.goodToKnowItems) {
			return null
		} 

		let colorIndex = -1
		const goodToKnowItems = map(item => {
			if (!isNil(item.arrowColor) && !isEmpty(item.arrowColor)) {
				return {
					...item,
					backgroundColor: item.arrowColor
				}
			}
			colorIndex++
			if (colorIndex === colors.length) {
				colorIndex = 0
			}
			return {
				...item,
				backgroundColor: colors[colorIndex]
			}
		}, this.props.goodToKnowItems)

		return (
			<div className="container-fluid bg-grey start-page__articles">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="text-uppercase text-center"><strong>Bra att veta</strong></h2>
							<hr className="style1" />
						</div>
					</div>
					<div className="row">
						{map(item => (
							<div className="col-xs-12 col-sm-6 col-md-3" key={item.heading}>
								<IconBox 
									url={item.url}
									backgroundColor={item.backgroundColor}
									iconSrc={item.icon.url}
									heading={item.heading}
									text={item.text}
									arrowSrc={ikonArrowRight}
								/>
							</div>
						), goodToKnowItems)}
					</div>
				</div>
			</div>
		)
	}
}
