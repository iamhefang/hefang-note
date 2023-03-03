## 插件

插件使用 hook 方式,在特定的时机调用插件的方法

安装的插件保存在`$APPDATA/plugins`中,以 id 做为目录,目录内有一个 js 文件,默认导出一个 IPlugin 对象
