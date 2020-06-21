/**
 * 静态文件服务器测试例子
 * User: xuwm
 * Date: 13-5-17
 * Time: 上午8:38
 * To change this template use File | Settings | File Templates.
 */
var port=2000;
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");

var config = {
    Welcome:{
        file:'index.html'
    },
    Expires: {
        fileMatch: /^(gif|png|jpg|js|css)$/ig,
        maxAge: 606024365
    },
    Compress: {
        match:/css|js|html/ig
    }
};
var mime = {

  "css": "text/css",

  "gif": "image/gif",

  "html": "text/html",

  "ico": "image/x-icon",

  "jpeg": "image/jpeg",

  "jpg": "image/jpeg",

  "js": "text/javascript",

  "json": "application/json",

  "pdf": "application/pdf",

  "png": "image/png",

  "svg": "image/svg+xml",

  "swf": "application/x-shockwave-flash",

  "tiff": "image/tiff",

  "txt": "text/plain",

  "wav": "audio/x-wav",

  "wma": "audio/x-ms-wma",

  "wmv": "video/x-ms-wmv",

  "xml": "text/xml"

};
//创建http服务端
var server=http.createServer(function(request,response){
    var obj= url.parse(request.url);
    response.setHeader("Server","Node/V8");
    var pathname=obj.pathname;
    if(pathname.slice(-1)==="/"){
        pathname=pathname+config.Welcome.file;   //默认取当前默认下的index.html
    }
    var realPath = path.join(fs.realpathSync('.'), path.normalize(pathname.replace(/\.\./g, "")));
    var pathHandle=function(realPath){
    //用fs.stat方法获取文件
        fs.stat(realPath,function(err,stats){
            if(err){
                console.log(realPath+'处的文件找不到')
                response.writeHead(404,"not found",{'Content-Type':'text/plain'});
                response.write("the request "+realPath+" is not found");
                response.end();
            }else{
                if(stats.isDirectory()){
                }else{
                    var ext = path.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknown';
                    var contentType = mime[ext] || "text/plain";
                    response.setHeader("Content-Type", contentType);

                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModified);

                    if (ext.match(config.Expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                    }

                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        var raw = fs.createReadStream(realPath);
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                        var matched = ext.match(config.Compress.match);

                        if (matched && acceptEncoding.match(/\bgzip\b/)) {
                            response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                            raw.pipe(zlib.createGzip()).pipe(response);
                        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                            response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                            raw.pipe(zlib.createDeflate()).pipe(response);
                        } else {
                            response.writeHead(200, "Ok");
                            raw.pipe(response);
                        }
                    }
                }
            }
        });

    }
    pathHandle(realPath);
});
server.listen(port);
console.log("http server run in port:"+port);