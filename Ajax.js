/**
 * Created by Mr.Harry on 2015/2/1.
 */
(function(window,undefined){
    var Ajax ={};

    Ajax.request = function(url,opt){
        //定义一个空函数
        function fn(){}
        //取得相应参数，或者使用默认参数
        var async = opt.async !== false,   //默认为true，为异步
          method = opt.method || 'GET',
          data = opt.data || null,
          success = opt.success || fn,
          failure = opt.failure || fn;

        method = method.toUpperCase();  //请求方法统一使用大写形式

        //新建xhr对象，兼容ie
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
        xhr.onreadystatechange = function(){
            Ajax._onStateChange(xhr,success,failure);
        };

        //如果是GET方法且有参数，则把参数拼接到url上
        if(method == 'GET' && data){
          url = url + (url.indexOf('?') == -1 ? '?' : '&') + data;
          data = null;
        }

        xhr.open(method,url,async);
        if(method == 'POST'){
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }
        xhr.send(data); //GET时data为null

        //返回xhr对象
        return xhr;
    };
    Ajax._onStateChange = function(xhr,success,failure){
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