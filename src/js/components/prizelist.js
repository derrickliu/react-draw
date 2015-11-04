var React = require('react');
var Mask = require('./mask.js');

var Item = React.createClass({
	render: function() {
		var mask = (this.props.item.on ? <Mask show={this.props.item.on} /> : null);
		return (
			<li>
				<img src={this.props.item.image} />
				<p>{this.props.item.comment}</p>
				{mask}
			</li>
		);
	}
});
var Prizelist = React.createClass({
	render: function(){
		return (
			<ul className={"prize-list" + (this.props.onState ? (this.props.items.length == 4 ? ' col-2' : ' col-3') : '')}>
				{this.props.items.map(function(result){
					if(this.props.onState){
						if(result.id == this.props.onState){
							result.on = true;
						}else{
							result.on = false;
						}
					}
					return <Item key={result.id} item={result} />
				}.bind(this))}
			</ul>
		);
	}
});

module.exports = Prizelist;