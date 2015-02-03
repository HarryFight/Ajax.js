# Ajax.js
封装了Ajax操作的简易工具

这里采用单例模式封装成一个对象，即只有一个全局的变量将其赋值给Ajax，该对象有一个request方法。request有两个参数，第一个为请求的url(必要的)，字符串类型，第二个opt为配置参数(可选的)，对象类型。

目前提供的api：

`Ajax.request(url,option)`
`Ajax.get(url,data,callback)` 参数`data`,可缺省。
`Ajax.post(url,data,callback)` 参数`data`,可缺省。

默认参数：
```javascript
var async = opt.async !== false,   //默认为true，为异步
          method = opt.method || 'GET',
          data = opt.data || null,
          encode = opt.encode || 'utf-8',   //设置请求头编码
          success = opt.success || fn,
          failure = opt.failure || fn;
```
```javascript
      Ajax.request('http://localhost:3006/postData',{
          data:data,
          method:'post',
          async:false,
          success:function(data){
              console.log(data);
          }
      })
      
      Ajax.get('./getHtml',function(d){
           console.log(d)
      })
      
      Ajax.post('./getHtml',data,function(d){
           console.log(d)
      })
```
`Ajax.formToHash(form)`:
用于将form表单转化为hash对象
```javascript
  Ajax.formToHash(xy)
  Object {name: "xy", sex: "male", select: Array[1]}
```

`Ajax.serialize(obj)`:
将数据对象字符串化为请求参数
```javascript
  Ajax.serialize(Ajax.formToHash(xy))
  "name=xy&sex=male&select=peer"
```
