function ajax(url,data,callback){
	var _data = [];
	for(var k in data){
		_data.push(k + '=' + data[k]);
	}
	var xhr = new window.XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				callback(JSON.parse(xhr.responseText));
			}else{
				// alert(xhr.status);
			}
		}
	};
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send(_data.join('&'));
}

module.exports = ajax;