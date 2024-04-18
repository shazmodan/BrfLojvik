import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {map} from 'ramda'
import Slider from 'react-slick'

export class Slideshow extends Component {
	static propTypes = {
		slideshowImages: PropTypes.array.isRequired,
	}

	render() {
		const {slideshowImages} = this.props

		const settings = {
			dots: true,
			infinite: true,
			fade: true,
			speed: 500,
			slidesToShow: slideshowImages.length,
			slidesToScroll: slideshowImages.length,
		}
		
		//TOOD: Needs styling on height (422px or something).
		//TODO: Needs styling on dots.
		//TODO: Remove "Previous" and "Next" buttons
		
		return (
			<Slider {...settings}>
				{map(image => (
					<div key={image.id}>
						<img src={image.url} />
					</div>
				), slideshowImages)}
			</Slider>
		)
	}
}