var React = require('react');
var Button = React.createClass({
	render: function(){
		return <button onTouchEnd={this.props.fn} className="draw-btn">{this.props.text}</button>;
	}
});

module.exports = Button;