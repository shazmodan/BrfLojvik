import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {pathOr} from 'ramda'
import marked from 'marked'

import './footer.css'

class Footer extends Component {
	static propTypes = {
		leftHeading: PropTypes.string.isRequired,
		leftText: PropTypes.string.isRequired,
		rightHeading: PropTypes.string.isRequired,
		rightText: PropTypes.string.isRequired,
	}

	render() {
		return (
			<div className="container-fluid footer text-left">
				<div className="container footer-margin">
					<div className="row">
						<div className="col-xs-4">
							<h4 className="text-uppercase" 
								dangerouslySetInnerHTML={{__html: marked(this.props.leftHeading)}} 
							/>
							<hr className="footer-hr" />
							<div dangerouslySetInnerHTML={{__html: marked(this.props.leftText)}} />
						</div>
						<div className="col-xs-4">
							<h4 className="text-uppercase" 
								dangerouslySetInnerHTML={{__html: marked(this.props.rightHeading)}} 
							/>
							<hr className="footer-hr" />
							<div dangerouslySetInnerHTML={{__html: marked(this.props.rightText)}} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	leftHeading: pathOr('', ['appData', 'footerData', 'leftHeading'], state),
	leftText: pathOr('', ['appData', 'footerData', 'leftText'], state),
	rightHeading: pathOr('', ['appData', 'footerData', 'rightHeading'], state),
	rightText: pathOr('', ['appData', 'footerData', 'rightText'], state),
})

export default connect(mapStateToProps, null)(Footer)