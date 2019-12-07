// ==UserScript==
// @name         U校园脚本
// @namespace    https://github.com/Brush-JIM/UXiaoYuan-Unipus
// @version      2019.08.16
// @description  自动登录，关闭环境检测、长时间无操作、未开麦克风等窗口
// @author       Billchuan
// @match        https://sso.unipus.cn/sso*
// @match        https://u.unipus.cn/user/student*
// @match        https://u.unipus.cn/index.html/?logout=true
// @match        https://ucontent.unipus.cn/_pc_default/pc.html*
// @match        http://sso.unipus.cn/sso*
// @match        http://u.unipus.cn/user/student*
// @match        http://u.unipus.cn/index.html/?logout=true
// @match        http://ucontent.unipus.cn/_pc_default/pc.html*
// @match        https://u.unipus.cn/index.html*
// @match        http://u.unipus.cn/index.html*
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://u.unipus.cn/favicon.ico
// @supportURL   https://github.com/Brush-JIM/UXiaoYuan-Unipus
// ==/UserScript==

(function() {
    if (unsafeWindow.location.protocol != 'https:')
    {
        alert("页面正在使用不安全的http，接下来将为您跳转到https加密链接\n");
        unsafeWindow.location.href = 'https:' + unsafeWindow.location.href.substring
        (
            unsafeWindow.location.protocol.length
        )
    }
    else
    {
        var url = unsafeWindow.location.href;
        if (unsafeWindow.location.href == "https://sso.unipus.cn/sso/userinfo.html")
        {
            unsafeWindow.localStorage.removeItem('username');
            unsafeWindow.localStorage.removeItem('password');
            alert("重置成功");
            unsafeWindow.location.href = "https://sso.unipus.cn/sso/logout";
        }
        else if (url.indexOf("https://sso.unipus.cn/sso/login") != -1)
        {
            var uswename = unsafeWindow.localStorage.getItem('username');
            var password = unsafeWindow.localStorage.getItem('password');
            if (uswename == null || password == null || uswename == undefined || password == undefined)
            {
                $(unsafeWindow.document).ready
                (
                    function ()
                    {
                        $("button[class='btn btn-login btn-fill']")[0].innerText = '自动登录\n（鼠标点击，不要回车）';
                        $("button[class='btn btn-login btn-fill']").bind
                        (
                            'click',
                            function ()
                            {
                                $('input[name="rememberMe"]')[0].checked = false;
                                unsafeWindow.localStorage.setItem('username',$('input[name="username"]')[0].value);
                                unsafeWindow.localStorage.setItem('password',$("input[name='password']")[0].value);
                            }
                        );
                    }
                )
            }
            else
            {
                $(document).ready
                (
                    function ()
                    {
                        $('input[name="rememberMe"]')[0].checked = false;
                        $("input[name='username']")[0].value = unsafeWindow.localStorage.getItem('username');
                        $("input[name='password']")[0].value = unsafeWindow.localStorage.getItem('password');
                        $("button[class='btn btn-login btn-fill']")[0].click();
                    }
                )
            }
        }
        else if (url.indexOf('https://u.unipus.cn/user/student') != -1)
        {
            function myBrowser(){
                var userAgent = unsafeWindow.navigator.userAgent;
                var isOpera = userAgent.indexOf("Opera") > -1;
                if (isOpera) {
                    return "Opera"
                };
                if (userAgent.indexOf("Firefox") > -1) {
                    return "FF";
                };
                if (userAgent.indexOf("Chrome") > -1){
                    return "Chrome";
                };
                if (userAgent.indexOf("Safari") > -1) {
                    return "Safari";
                };
                if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                    return "IE";
                };
            }
            var myBrowser_ = myBrowser();
            //注入sessionStorage、cookie、localStorage用来关闭各种窗口
            unsafeWindow.sessionStorage.setItem("__env_tested__", Date());
            unsafeWindow.localStorage.setItem("__env_tested__" + myBrowser_, myBrowser_);
            unsafeWindow.localStorage.setItem("__version_tested__v21553593265" + myBrowser_,myBrowser_);
            unsafeWindow.document.cookie = "__version_tested__v21553593265" + myBrowser_ + "=" + myBrowser_;
            unsafeWindow.document.cookie = "__env_tested__" + myBrowser_ + "=" + myBrowser_;
            $(document).ready
            (
                function ()
                {
                    //Hook window.GotoEnv函数，禁止弹窗
                    unsafeWindow.GotoEnv = function()
                    {
                        console.log('取消环境检测');
                        $('#env_newnotice').hide();
                        return true;
                    }
                    //Hook window.UserFirstHelp函数，禁止新手提示
                    unsafeWindow.UserFirstHelp = function()
                    {
                        console.log('取消新手提示');
                        $('#fp').fadeOut();
                        return true;
                    }
                    //Hook window.GotoVersion函数，禁止版本说明
                    unsafeWindow.GotoVersion = function()
                    {
                        console.log('取消版本说明');
                        $('#version_newnotice').hide();
                        return true;
                    }
                    //再次执行取消版本、环境检测的小点提示，关闭新手提示
                    $('#version_newnotice').hide();
                    $('#env_newnotice').hide();
                    $('#fp').fadeOut();
                    //定时器，重置无操作计时
                    setInterval (
                        function () {
                            unsafeWindow.timeline.revived();
                        }
                        , 6000
                    );
                    var _iIntervalID = setInterval(function() {
                        if ($("[class='menu-li']").length > 2)
                        {
                            clearInterval(_iIntervalID);
                            //增加重置登录信息元素
                            $("[class='hiden-menu']").append("<div class=\"menu-li\" id=\"relogin\">重置登录信息</a>");
                            $("div[id='relogin']").bind
                            (
                                'click',
                                function()
                                {
                                    unsafeWindow.location.href = "https://sso.unipus.cn/sso/userinfo.html";
                                }
                            )
                            //更改元素
                            $('[class="menu-li"]')[2].innerText = '重新登录';
                        }
                    },20);
                }
            )
        }
        else if (unsafeWindow.location.href.indexOf('https://ucontent.unipus.cn/_pc_default/pc.html') != -1)
        {
            $(document).ready
            (
                function ()
                {
                    //定时器，重置无操作计时
                    setInterval (
                        function () {
                            unsafeWindow.timeline.revived();
                        }
                        , 6000
                    );
                    //去除弹窗
                    setInterval (
                        function () {
                            for (var count = 0;count < document.querySelectorAll('button[type="button"][tabindex="0"]').length;count++)
                            {
                                var text = document.querySelectorAll('button[type="button"][tabindex="0"]')[count].innerText;
                                if (text == '确定' || text == '查看答案')
                                {
                                    try
                                    {
                                        document.querySelectorAll('button[type="button"][tabindex="0"]')[count].click();
                                    }
                                    catch (error)
                                    {
                                        ;
                                    }
                                }
                            }
                        }
                        , 100
                    )
                }
            )
        }
        else if (unsafeWindow.location.href.indexOf('https://u.unipus.cn/index.html') != -1)
        {
            $(document).ready
            (
                function ()
                {
                    try
                    {
                        unsafeWindow.login();
                    }
                    catch (error)
                    {
                        unsafeWindow.location.href = 'https://sso.unipus.cn/sso/login';
                    }
                }
            )
        }
    }
})();