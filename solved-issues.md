
### 413 Request Entity Too Large
Nginx出现“413 Request Entity Too Large”错误解决方法  

2011-03-25 13:49:55|  分类： 默认分类 |  标签：413  request  entity  too  large  nginx出现  错误解决方法   |举报|字号 订阅
    
  下载LOFTER我的照片书  |
今天使用Wordpress的flash版文件上传功能的时候，总是提示接口错误，很是郁闷。换小文件发现没有问题，所以问题肯定出现在文件大小上，找了半天没有发现wordpress有限制上传文件大小的地方。

切换到传统文件上传界面，重新上传一个大文件，这回出来错误提示了，413 Request Entity Too Large，google了一下，发现是Nginx的错误提示。

解决方法：打开nginx主配置文件nginx.conf，找到http{}段，添加
client_max_body_size 20m;
Centos下 vi /usr/local/nginx/conf/nginx.conf

重启NGINX
kill -HUP `cat /usr/local/nginx/nginx.pid `
恢复正常