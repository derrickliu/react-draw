import './common/rem.js';

import '../css/share.less';

var React = require('react');
var ReactDOM = require('react-dom');

var Button = require('./components/button.js');

var Prizelist = require('./components/prizelist.js');

var ajax = require('./common/ajax.js');

var url = 'http://jinkaimai.kf0309.3g.qq.com/webapp_sdi/draw/index.do';

var Wrapper = React.createClass({
	btnClick: function(){
		location = this.props.items[0].jump;
	},
	render: function(){
		return (
			<div className="box">
				<div className="wrapper">
					<div className="wrapper-inner">
						<Prizelist items={this.props.items} onState={false} />
						<div className="prize-info">
							<p>太走运啦</p>
							<p>我刚刚抽中了 <span className="hot">{this.props.items[0].comment}</span></p>
						</div>
					</div>
				</div>
				<footer>
					<Button fn={this.btnClick} text="我也要奖品" />
				</footer>
			</div>
		);
	}
});

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return decodeURIComponent(r[2]); return null;
}

var ids = GetQueryString('ids');

ajax(url,{method: 'getDrawLogByIds', ids: ids},function(result){
	if(result.result == 1){	
		ReactDOM.render(<Wrapper items={result.info.drawLog} />, document.getElementById('container'));
	}
});

