import './common/rem.js';

import '../css/style.less';


var React = require('react');
var ReactDOM = require('react-dom');

var Prizelist = require('./components/prizelist.js');

var LinkedStateMixin = require('react-addons-linked-state-mixin');

var url = '';

var Mask = require('./components/mask.js');

var Button = require('./components/button.js');

var ajax = require('./common/ajax.js');
var GJ = require('./common/gj.js');

var QQ;

// var aid = __config.aid;

var AlertBox = React.createClass({
	render: function(){
		var btns = this.props.tips.info.btns,
			text = this.props.tips.info.text,
			_btns = (btns && btns.length) ? <AlertBtnbar btns={btns} /> : null,
			_text = text ? <AlertContent text={text} /> : null;
		return (
			<div className={"alert" + (this.props.tips.show ? " alert-show" : "")}>
				{_text}
				{_btns}
			</div>
		);
	}
});

var AlertContent = React.createClass({
	render: function(){
		return (
			<div className="alert-content">
				{this.props.text}
			</div>
		);
	}
});

var AlertBtnbar = React.createClass({
	render: function(){
		return (
			<div className={"alert-btnbar" + (this.props.btns.length == 2 ? ' btn-col-2' : '')}>
				{this.props.btns.map(function(result,index){
					return <button key={index} onClick={result.fn} className="alert-btn">{result.text}</button>
				})}
			</div>
		);
	}
});

var ErrTips = React.createClass({
	render: function(){
		return <p className={"err-tips" + (this.props.show ? " err-tips-show" : "")}>{this.props.text}</p>;
	}
});

var PrizeText = React.createClass({
	render: function(){
		return (
			<div className="prize-text">
				<p>恭喜抽中 <span className="hot">{this.props.comment}</span></p>
				<p>你是今天的幸运星。</p>
			</div>
		);
	}
});

var UserInfoForm = React.createClass({
	mixins: [LinkedStateMixin],
	getInitialState: function(){
		return {
			name: '',
			tel: '',
			address: ''
		};
	},
	submit: function(e){
		e.preventDefault();
		if(!this.state.name || (!this.state.tel || !/^1[3578]\d{9}$/.test(this.state.tel)) || !this.state.address){
			return;
		}
		this.props.callback({
			name: this.state.name,
			mobile: this.state.tel,
			address: this.state.address
		});
		
	},
	render: function(){
		var nameState,
			telState,
			addressState,
			telErrText = '';
		
		nameState = !this.state.name;
		addressState = !this.state.address;
		if(!this.state.tel){
			telState = true;
			telErrText = '请输入手机号码';
		}else{
			if(!/^1[3578]\d{9}$/.test(this.state.tel)){
				telState = true;
				telErrText = '请输入格式正确的手机号码';
			}
		}

		return (
			<div>
				<h3>恭喜抽中 <span className="hot">{this.props.prize}</span></h3>
				<p>请填写清楚个人信息，以便我们尽快的将礼品送到你手中哦。</p>
				<form className="user-form" onSubmit={this.submit}>
					<input type="text" placeholder="姓名" valueLink={this.linkState('name')} />
					<ErrTips show={nameState} text="请填写姓名" />
					<input type="tel" placeholder="联系电话" valueLink={this.linkState('tel')} />
					<ErrTips show={telState} text={telErrText} />
					<input type="text" placeholder="联系地址" valueLink={this.linkState('address')} />
					<ErrTips show={addressState} text="请填写联系地址" />
					<button type="submit" className="alert-btn">提交</button>
				</form>
			</div>
		);
	}
});

var DrawList = React.createClass({
	getInitialState: function() {
		return {
			on: -1,
			btnState: 0, // 0表示有抽奖资格； 1表示正在抽奖中；2表示已抽奖并中奖；22表示已抽奖并没有中奖; 3表示没有抽奖资格；4表示分享
			tips: {
				show: false,
				type: ''
			}
		};
	},
	drawClick: function() {
		switch(this.state.btnState){
			// 正在抽奖
			case 1: return;
			// 已抽过奖品，并中奖
			case 2: this.showTips('2-1');return;
			// 已抽过奖品，没有中奖
			case 22: this.showTips('2-2');return;
			// 无抽奖资格
			case 3: this.showTips('3');return;
			// 分享
			case 4: this.share();return;
		}
		

		this.setState({btnState: 1});

		var that = this;
		var items = this.props.items;
		var len = this.props.items.length;

		// 要先获取获奖id，但是要先让抽奖转起来
		var goal = Math.floor(Math.random() * (len - 1)) + 1;

		
		// alert(QQ)
		// GJ.getClientInfo(QQ,function(imei,skey,guid){
		// 	var data = {
		// 		method: 'doDraw',
		// 		qq: QQ,
		// 		imei: imei,
		// 		skey: skey,
		// 		guid: guid,
		// 		aid: aid
		// 	};
		// 	ajax(url,data,function(result){
		// 		if(result.result == 1){
		// 			goal = result.info.bonus.id;
		// 		}else{
		// 			// 出错了，给出提示信息
		// 			goal = -4;
		// 			that.setState({
		// 				on: -1,
		// 				btnState: 0,
		// 				tips: {
		// 					show: true,
		// 					type: '2-2'
		// 				}
		// 			});
		// 		}
		// 	});

		// });

		
		// 转动速度
		var speed = 300;
		// 循环转动的次数
		var turns = 3;
		// 已经转了的次数
		var turned = 0;

		// 随机生成一个开始的慢速度转动的个数
		var startCount = Math.floor(Math.random() * len);
		
		// 结束状态
		var end = false;

		// console.log(goal + '--' + startCount);

		function run(idx,speed){

			if(goal == -4){
				return;
			}
			
			// 如果在第一圈，并且小于开始的慢速度
			if(turned == 0 && idx > startCount){
				speed = 50;
			}
			if(idx >= len){
				idx = 0;
				turned += 1;
			}

			// 如果已经转了3圈，还没拿到中奖结果，再来三圈
			if(turned >= turns && goal == -1){
				turns += 3;
			}

			if(turned >= turns){
				speed = 300;
				if(items[idx].id == goal){
					end = true;
				}
			}
			// console.log(idx + '--' + speed);
			that.setState({on: items[idx].id});

			if(!end){
				setTimeout(function(){
					run(idx+1,speed);
				},speed);
			}else{
				// 奖品类型，ship表示实物, digit表示虚拟，其他的表示跳第三方
				
				var __type;
				switch(items[idx].type){
					case 'ship': __type = '1-2';break;
					case 'digit': __type = '1-1';break;
					default: __type = '1-3'; break;
				}
				that.showTips(__type);
				that.setState({btnState: 4});
			}
		};

		run(0,speed);
	},

	showTips: function(type){
		this.setState({
			tips: {
				show: true, 
				type: type
			}
		});
	},

	// 弹框类型配置
	tipsType: function(type,comment){
		var ruleConfig = {
			// 规则
			'rule': {
				text: '规则',
				btns: [
					{
						text: '关闭',
						fn: this.close
					}
				]
			},
			// 抽奖后，中的是虚拟物品，直接给出提示
			'1-1': {
				text: <PrizeText comment={comment} />,
				btns: [
					{
						text: '知道了',
						fn: this.close
					}
				]
			},
			// 抽奖后，中的是实物奖品，需要填写联系方式
			'1-2': {
				text: <UserInfoForm prize={comment} callback={this.submitUserInfo} />
			},
			// 抽奖后，中的是第三方奖品，需要跳转
			'1-3': {
				text: <PrizeText comment={comment} />,
				btns: [
					{
						text: '取消',
						fn: this.close
					},
					{
						text: '去领取',
						fn: this.jump
					}
				]
			},
			// 抽奖后，没有中奖
			'1-4': {
				text: '运气差点，没有中奖。',
				btns: [
					{
						text: '知道了',
						fn: this.close
					}
				]
			},
			// 已抽过奖，并中奖
			'2-1': {
				text: '你已获得了 '+ comment +' 奖品，等待我们送到你手中哦。',
				btns: [
					{
						text: '知道了',
						fn: this.close
					}
				]
			},
			// 已抽过奖，没有中奖
			'2-2':{
				text: '你已经抽过了，下次再来吧。',
				btns: [
					{
						text: '知道了',
						fn: this.close
					}
				]
			},
			// 没有抽奖资格
			'3': {
				text: '没有抽奖资格',
				btns: [
					{
						text: '好吧',
						fn: this.close
					}
				]
			},
			// 出错了
			'4': {
				text: '抽奖接口出错，请重新抽',
				btns: [
					{
						text: '好吧',
						fn: this.close
					}
				]
			},
			// 提交联系人信息成功
			'5':{
				text: '提交联系人信息成功，等待我们送到你手中哦。',
				btns: [
					{
						text: '好的',
						fn: this.close
					}
				]
			}
		};

		return ruleConfig[type];
	},
	getTipsByType: function(type){
		var comment;
		if(type && type !== 'rule'){
			this.props.items.map(function(result){
				if(result.id == this.state.on){
					comment = result.comment;
				}
			}.bind(this));
		}

		if(type == '' || type == undefined){
			return {
				text: '',
				btns: []
			};
		}
		return this.tipsType(type,comment);
	},
	close: function(){
		this.setState({tips: {show: false}});
	},
	share: function(){
		GJ.shareTimeline({
			imgUrl: '',
			img_width: "240",
			img_height: "240",
			link: 'share.html?ids=' + this.state.on,
			desc: '中奖这事，不小心就来啦！',
			title: '中奖这事，不小心就来啦！'
		});
	},
	jump: function(){
		var url = '';

		this.props.items.map(function(item){
			if(item.id == this.state.on){
				url = item.jump;
				return;
			}
		}.bind(this));

		window.open(url);
	},
	submitUserInfo: function(data){
		var that = this;
		GJ.getClientInfo(QQ,function(imei,skey,guid){

			var data = {
				method: 'saveUserInfo',
				qq: QQ,
				name: data.name,
				mobile: data.tel,
				address: data.address,
				imei: imei,
				skey: skey,
				guid: guid,
				aid: aid
			};
			ajax(url,data,function(result){
				if(result.result == '1'){
					that.showTips('5');
				}
			});

		});
	},
	openRule: function(e){
		e.preventDefault();
		this.showTips('rule');
	},

	// 按钮状态对应的文字
	btnText: {
		'0': '我要大奖',
		'1': '正在抽奖中...',
		'2': '查看奖品',
		'22': '没有中奖哦',
		'3': '没有抽奖资格',
		'4': '炫耀一下'
	},

	// componentDidMount: function(){
	// 	var url = this.props.source,
	// 		that = this;
			

	// 	GJ.getClientInfo(QQ,function(imei,skey,guid){
	// 		var data = {
	// 			method: 'canDraw', 
	// 			qq: QQ,
	// 			imei: imei,
	// 			skey: skey,
	// 			guid: guid,
	// 			aid: aid
	// 		};
		
	// 		ajax(url,data,function(result){
	// 			// -4表示已经抽过了
	// 			if(result.result == '-4'){
	// 				if (that.isMounted()) {
	// 					// 表示已中奖
	// 					if(result.info.drawLog.length){
	// 						that.setState({on: result.info.drawLog.id, btnState: 2});
	// 					}else{
	// 						that.setState({ btnState: 22});
	// 					}
						
	// 				}
	// 			}
				
	// 		});
	// 	});
	// },
	render: function() {
		// 选中的奖品id
		var onId = this.state.on;

		// 抽奖按钮的状态
		var btnText = this.btnText[this.state.btnState];

		var alert = null,
			mask = null,
			alertOptions = null;// 弹框的属性

		if(this.state.tips.show){
			alertOptions = {
				show: this.state.tips.show,
				info: this.getTipsByType(this.state.tips.type)
			};
			alert = <AlertBox tips={alertOptions} />;
			mask = <Mask show={this.state.tips.show} />;
		}

		return (
			<div className="box">
				<div className="wrapper">
					<div className="wrapper-inner">
						<Prizelist items={this.props.items} onState={onId} />
					</div>
				</div>
				<footer>
					<Button fn={this.drawClick} text={btnText} />
					<a href="#" onTouchEnd={this.openRule} className="draw-rule-link">查看规则</a>
				</footer>
				{alert}
				{mask}
			</div>
		);
	}
});

var items = [{
	image: '',
	comment: '1',
	id: 1,
	type: 'ship'
},{
	image: '',
	comment: '2',
	id: 2,
	type: 'digit'
},{
	image: '',
	comment: '3',
	id: 3,
	type: 'digit'
},{
	image: '',
	comment: '4',
	id: 4,
	type: 'ship'
},{
	image: '',
	comment: '5',
	id: 5,
	type: 'xxx'
},{
	image: '',
	comment: '6',
	id: 6,
	type: 'xxx'
}];

ReactDOM.render(<DrawList items={items} />, document.getElementById('container'));


window.onerror = function(msg){
	alert(msg);
}






