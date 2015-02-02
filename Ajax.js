/**
 * Created by Mr.Harry on 2015/2/1.
 */
(function(window,undefined){
    var Ajax ={};
    /**
     * Ajax请求函数
     * @param url
     * @param opt
     * @returns {XMLHttpRequest}
     */
    Ajax.request = function(url,opt){
        //定义一个空函数
        function fn(){}
        //取得相应参数，或者使用默认参数
        var async = opt.async !== false,   //默认为true，为异步
          method = opt.method || 'GET',
          data = opt.data || null,
          encode = opt.encode || 'utf-8',   //设置请求头编码
          success = opt.success || fn,
          failure = opt.failure || fn;

        method = method.toUpperCase();  //请求方法统一使用大写形式

        //新建xhr对象，兼容ie
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
        xhr.onreadystatechange = function(){
            _onStateChange(xhr,success,failure);
        };

        //如data为对象，则转化为字符串键值对
        if(data && typeof data == 'object'){
            data = Ajax.serialize(data)
        }
        //如果是GET方法且有参数，则把参数拼接到url上
        if(method == 'GET' && data){
          url = url + (url.indexOf('?') == -1 ? '?' : '&') + data;
          data = null;
        }

        xhr.open(method,url,async);
        if(method == 'POST'){
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset="+encode);
        }
        xhr.send(data); //GET时data为null

        //返回xhr对象
        return xhr;
    };

    //工具方法
    /**
     * 将form表单转化为hash对象
     * @param form
     * @returns {{}}
     */
    Ajax.formToHash = function(form){
        var hash = {},
            ele;

        for(var i= 0,len = form.elements.length; i < len;i++){
            ele = form.elements[i];
            if(ele.name=='' || ele.disabled){
                //若元素不存在name或者为disabled时,跳过当前元素的处理，进入下次循环
                continue;
            }
            switch(ele.tagName.toLowerCase()){
                case 'fieldset':break;
                case 'button':break;
                case 'input':
                    switch (ele.type.toLowerCase()){
                        case 'button':break;
                        case 'image':break;
                        case 'radio' :
                            if(ele.checked){
                                hash[ele.name] = ele.value;
                            }
                            break;
                        case 'checkbox':
                            if(ele.checked){
                                if(!hash[ele.name]){
                                    hash[ele.name] = [ele.value];
                                }else{
                                    hash[ele.name].push(ele.value);
                                }
                            }
                            break;
                        default :
                            hash[ele.name] = ele.value;
                    }
                    break;
                case 'select':
                    if(ele.multiple){
                        //若为多选
                        for(var j = 0,lens = ele.options.length; j<lens ; j++){
                            if(ele.options[j].selected){
                                if(!hash[ele.name]){
                                    hash[ele.name] = [ele.options[j].value];
                                }else{
                                    hash[ele.name].push(ele.options[j].value)
                                }
                            }
                        }
                    }else{
                        hash[ele.name] = ele.options.value;
                    }
                    break;
                default :
                    hash[ele.name] = ele.value;
            }
        }

        //清空变量
        form = ele = null;
        return hash;
    };

    /**
     * 将对象字符串化为请求参数
     * @param obj
     * @returns {Array}
     */
    Ajax.serialize = function(obj){
        var data = [];
        for(var key in obj){
            var value = obj[key];
            //若对象某一属性为数组，则将每一个数组元素与属性都作处理。
            if(value instanceof Array){
                for(var i=0 ; i< value.length;i++){
                    //encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
                    data.push(key+ '='+encodeURIComponent(value[i]) )
                }
            }else{
                data.push(key + '='+ encodeURIComponent(value) )
            }
        }

        data = data.join('&');
        return data;
    };

    //私有方法
    function _onStateChange(xhr,success,failure){
        if(xhr.readyState == 4){
            var s = xhr.status;
            if(s>=200 && s<300){
                //请求成功
                success(xhr.response);
            }else{
                var err = xhr.status;
                failure(err,xhr);
            }
        }
    };

    //提供唯一接口
    window.Ajax = Ajax;
})(window);