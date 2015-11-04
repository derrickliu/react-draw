var React = require('react');

var Mask = React.createClass({
	render: function(){
		return <div className={"mask" + (this.props.show ? ' mask-show' : '')}></div>;
	}
});

module.exports = Mask;