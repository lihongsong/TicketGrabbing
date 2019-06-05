var version = 1.0;
var cache = clearCache();
function clearCache() {
    if (getSession("version")) {
        if (version != getSession("version")) {
            localStorage.clear();
            setSession("version", version);
        }
    } else {
        localStorage.clear();
        setSession("version", version);
    }
}
function setSession(key, val) {
    localStorage[key] = val;
}
function getSession(key) {
    return localStorage[key];
}
function delSession(key) {
    localStorage.removeItem(key);
}

function getCheckStaus(level) {
    switch (level) {
        case 1:
            return "1分&nbsp;很不满意";
        case 2:
            return "2分&nbsp;不满意";
        case 3:
            return "3分&nbsp;一般";
        case 4:
            return "4分&nbsp;满意";
        case 5:
            return "5分&nbsp;非常满意";
        default:
            return "";
    }
}

function getOrderStatus(status) {
    var x = "";
    switch (status) {
        case 255:
            x = "未知";
            break;
        case 0:
            x = "系统受理";
            break;
        case 10:
            x = "等待付款";
            break;
        case 8:
            x = "付款成功";
            break;
        case 13:
            x = "订单成功";
            break;
        case 14:
            x = "系统取消";
            break;
        case 15:
            x = "用户取消";
            break;
        default:
            break;
    }
    return x;
}

function getPayStatus(status) {
    var x = "";
    switch (status) {
        case 255:
            x = "未知";
            break;
        case 0:
            x = "尚未付款";
            break;
        case 10:
            x = "等待付款";
            break;
        case 8:
            x = "付款成功";
            break;
        case 17:
            x = "准备退款";
            break;
        case 18:
            x = "退款完成";
            break;
        default:
            break;
    }
    return x;
}
function getTicketStatus(status) {
    var x = "";
    switch (status) {
        case 0:
            x = "未知";
            break;
        case 1:
            x = "已出票";
            break;
        case 2:
            x = "已入住";
            break;
        case 16:
            x = "已退票";
            break;
        case 255:
            x = "其他";
            break;
        default:
            break;
    }
    return x;
}
//获取当前屏幕的大小
function getWindowSize() {
    var size = { width: 0, height: 0 };
    if (window.innerWidth)
        size.width = window.innerWidth;
    else if (document.documentElement && document.documentElement.clientWidth)
        size.width = document.documentElement.clientWidth;
    else if (document.body)
        size.width = document.body.clientWidth;
    if (window.innerHeight)
        size.height = window.innerHeight;
    else if (document.documentElement && document.documentElement.clientHeight)
        size.height = document.documentElement.clientHeight;
    else if (document.body)
        size.height = document.body.clientHeight;
    return size;
}
//表单提交
function ajaxSubmit(options) {
    var defaults = {
        title: '正在处理，请稍候',
        finished: null,
        success: null
    };
    var opts = $.extend(defaults, options);
    showLoader();
    $(opts.form).ajaxSubmit({
        success: function (data) {
            if (typeof data == 'string')
                data = $.parseJSON(data);
            if (data.isSuccess)
                opts.success(data.data);
            else {
                alert(data.Message);
            }
            if (opts.finished != null)
                opts.finished(true);
            hideLoader();
        },
        error: function (rs, type, info) {
            hideLoader();
            if (rs.status == 500) {
                var m = rs.responseText.match(/<title>(.*?)\<\/title>/);
                if (m.length >= 2) {
                    info += '\n' + m[1];
                }
            }
            //alert("调用 ajax 失败\r\n\r\n" + info);
            if (opts.finished != null)
                opts.finished(false);
        }
    });
}
function showLoader() {
    loading("加载中", "a", false);
}
function hideLoader() {
    loadStop();
}
//ajax提交
function ajax(options) {
    var defaults = {
        url: '',
        type: 'POST',
        data: '',
        action: function () { },
        failfun: null,
        success: null,
        dataType: "json",
        async: true
    };
    var opts = $.extend(defaults, options);
    if (opts.async)
        showLoader();
    if (httpUrl != "") {
        opts.dataType = "jsonp";
        opts.url = httpUrl + opts.url + (opts.url.indexOf("?") == -1 ? "?" : "&") + "rnd=" + Math.random();
    } else {
        opts.url = opts.url + (opts.url.indexOf("?") == -1 ? "?" : "&") + "rnd=" + Math.random();
    }
    if (opts.dataType == "jsonp") {
        opts.jsonp = "callback";
        opts.jsonpCallback = "JSONPHandler";
        opts.url = opts.url + (opts.url.indexOf("?") == -1 ? "?" : "&") + "jsonp=true";
    }
    $.ajax({
        type: opts.type,
        url: opts.url,
        data: opts.data,
        dataType: opts.dataType,
        async: opts.async,
        jsonp: opts.jsonp,
        jsonpCallback: opts.jsonpCallback,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (rs) {
            //rs = $.parseJSON(rs);
            if (opts.async)
                hideLoader();

            if (opts.success != null)
                opts.success(rs);
            else if (rs.isSuccess) {
                opts.action(rs.data);
            }
            else {
                if (typeof (opts.failfun) == 'function')
                    opts.failfun(rs);
                else
                    Tips.alert(rs.Message);
            }
        },
        error: function (rs, type, info) {
            if (opts.async)
                hideLoader();
            if (rs.status == 500) {
                var m = rs.responseText.match(/<title>(.*?)\<\/title>/);
                if (m.length >= 2) {
                    info += '\n' + m[1];
                }
            }
            //alert("调用 ajax 失败\n\n" + info);
        }
    });
}


var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子   
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X   
function IdentityCodeValid(idCard) {
    //idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格                     
    if (idCard.length == 15) {
        return false; // isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split("");                // 得到身份证数组   
        if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
/**      IdentityCodeValid
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 * @return  
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0;                             // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];            // 加权求和   
    }
    valCodePosition = sum % 11;                // 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}
/**  
  * 验证18位数身份证号码中的生日是否是有效生日  
  * @param idCard 18位书身份证字符串  
  * @return  
  */
function isValidityBrithBy18IdCard(idCard18) {
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if (temp_date.getFullYear() != parseFloat(year)
          || temp_date.getMonth() != parseFloat(month) - 1
          || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
/**  
 * 验证15位数身份证号码中的生日是否是有效生日  
 * @param idCard15 15位书身份证字符串  
 * @return  
 */
function isValidityBrithBy15IdCard(idCard15) {
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
    if (temp_date.getYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
//去掉字符串头尾空格   
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


function IdentityCodeValid_old(code) {
    code = $.trim(code);
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code) {
        tip = "身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    return pass;
}
//增加天数
function addDay(time, n) {
    var d = new Date(time);
    d = +d + 1000 * 60 * 60 * 24 * n;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
//获取星期
function getWeek(time) {
    var serverTime = GetServerTime();
    var weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var myDate = new Date(Date.parse(time.replace(/-/g, "/")));
    if (addDay(serverTime, 0) == addDay(myDate, 0)) {
        return "今天";
    }
    else if (addDay(serverTime, 1) == addDay(myDate, 0)) {
        return "明天";
    }
    else if (addDay(serverTime, 2) == addDay(myDate, 0)) {
        return "后天";
    }
    else {
        return weekDay[myDate.getDay()];
    }
}

Date.prototype.Format = function (fmt) {
    var today = new Date();
    var localUtc = today.getTimezoneOffset() / 60;
    var diffTimeZone = localUtc + 8; //与东八区差几个时区
    var date_format = new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours() + diffTimeZone, this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    var o = {
        "M+": date_format.getMonth() + 1, //月份 
        "d+": date_format.getDate(), //日 
        "h+": date_format.getHours(), //小时 
        "m+": date_format.getMinutes(), //分 
        "s+": date_format.getSeconds(), //秒 
        "q+": Math.floor((date_format.getMonth() + 3) / 3), //季度 
        "S": date_format.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date_format.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function GetServerTime() {
    var serverTime = sessionStorage.serverTime;
    if (!serverTime) {
        serverTime = $.ajax({ async: false }).getResponseHeader("Date");
        sessionStorage.serverTime = serverTime;
    }
    var date = new Date(serverTime);
    return date;
}

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息                                 
            trident: u.indexOf('Trident') > -1, //IE内核                                 
            presto: u.indexOf('Presto') > -1, //opera内核                                 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核                                 
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核                                
            mobile: !!u.match(/AppleWebKit.*Mobile.*/)
                    || !!u.match(/AppleWebKit/), //是否为移动终端                                 
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端                 
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器                                 
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器                    
            iPad: u.indexOf('iPad') > -1, //是否iPad       
            webApp: u.indexOf('Safari') == -1,//是否web应该程序，没有头部与底部
            google: u.indexOf('Chrome') > -1
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
function onBack() {
    window.history.back();
}
function onHref(url) {
    window.location.href = url;
}

function SkipReturnUrl(url) {
    sessionStorage.returnurl = url;
    onHref(sessionStorage.returnurl);
}

function loading(text, str, flag) {
    if (!text) {
        text = "加载中...";
    }
    var _width = window.innerWidth;
    var _height = window.innerHeight;
    var htmlstr = "<div id=\"loading\"><div class=\"view  cm-overlay\" style=\"z-index: 2003;\" id=\"ui-view-12\"></div>"
            + "<div class=\"view cm-page-view\" style=\"box-sizing: border-box;width: 50px;position: fixed; left: 50%; top: 50%; margin-left: -25px; margin-top: -25px;z-index: 2004;display: block; \""
            + "id=\"ui-view-4\"><div class=\"spinner js_loading\"> <div class=\"spinner-container container1\">"
             + "<div class=\"circle1\"></div> <div class=\"circle2\"></div> <div class=\"circle3\"></div>"
             + "<div class=\"circle4\"></div> </div> <div class=\"spinner-container container2\">"
             + "<div class=\"circle1\"></div> <div class=\"circle2\"></div> <div class=\"circle3\">"
             + "</div> <div class=\"circle4\"></div> </div> <div class=\"spinner-container container3\">"
             + "<div class=\"circle1\"></div> <div class=\"circle2\"></div> <div class=\"circle3\"></div> <div class=\"circle4\"></div>"
             + "</div></div></div></div>";
    $("body").append(htmlstr);
}
function loadStop() {
    $("#loading").remove();
}


/**
 * LBS iTips (仿iPhone界面版) 
 * Date: 2015-10-25 
 * ====================================================================
 * 1. 宽高自适应(maxWidth:300 minWidth:250)  引入iTips.css iTips.js （建议js css 放在同一目录）
 * ====================================================================
 * 2. 调用方式1: 
    Tips.alert(option) //显示(确定)按钮 
    Tips.confirm(option) //显示(确定 取消)按钮  option.after(boolean) boolean布尔值 确定true 取消false
    Tips.open(option) //无显示按钮 可设置定时关闭 默认不自动关闭需手动关闭
    Tips.close() //手动调用关闭 (方式1/方式2都可以调用)
    * Tips.show(text) // 显示加载提示框 text为弹出文本 默认加载中 
     * Tips.hide() // 隐藏加载提示框
 * ====================================================================
 * 3. 调用方式2:
     Tips.alert(content,fn) //content内容 fn弹出框关闭后执行函数 相当于option.after
     Tips.confirm(content,fn) //fn(boolean) boolean布尔值 确定true 取消false
     Tips.open(content, time) //time自动关闭时间(单位秒) 默认不自动关闭需手动关闭 
 * ====================================================================
 * 4. option选项：
     content：内容(可带html标签自定义样式)
     before: 点击确定按钮 关闭弹出框前 执行函数  (Tips.alert Tips.confirm中有效)
             如果函数返回false 则不会执行(关闭弹出框)和(after) 一般用于做一些检测
     after: 点击确定按钮 关闭弹出框后 执行函数 (Tips.alert Tips.confirm中有效)
     time: 自动关闭时间(单位秒) time 秒后关闭 (Tips.open中有效) 
     define: 定义确定按钮的文本 (Tips.alert Tips.confirm中有效)
     cancel: 定义取消按钮的文本 (Tips.confirm中有效)
 * ====================================================================
 * Tips.BG //遮罩层
 * Tips.Box //弹出框
 * Tips.define //确定按钮
 * Tips.cancel //取消按钮 
 * ====================================================================
**/
(function () {
    window.Tips = {
        _create: function () {
            if (!this.Box) {
                var body = document.getElementsByTagName('body')[0],
                    html = '<div id="tips_content"></div><div id="tips_foot"><a href="javascript:;" id="tips_cancel">取消</a><a href="javascript:;" id="tips_define">确定</a></div>';
                this.BG = document.createElement('div');
                this.BG.id = 'tips_mask';
                this.Box = document.createElement('div');
                this.Box.id = 'tips_box';
                this.Box.innerHTML = html;
                body.appendChild(this.BG);
                body.appendChild(this.Box);
                this.content = this.$('#tips_content');
                this.foot = this.$('#tips_foot');
                this.define = this.$('#tips_define');
                this.cancel = this.$('#tips_cancel');
            }
        },
        minWidth: 250,
        maxWidth: 300,
        _show: function () {
            this._fix = true;
            this.BG.style.display = 'block';
            this.Box.style.display = 'block';
            this._css();
            this._bind();
        },
        _hide: function () {
            this._fix = false;
            this.BG.style.display = 'none';
            this.Box.style.display = 'none';
            this._unbind();
        },
        _pos: function () {
            var d = document,
                doc = d.documentElement,
                body = d.body;
            this.pH = doc.scrollHeight || body.scrollHeight;
            this.sY = doc.scrollTop || body.scrollTop;
            this.wW = doc.clientWidth;
            this.wH = doc.clientHeight;
            if (document.compatMode != "CSS1Compat") {
                this.pH = body.scrollHeight;
                this.sY = body.scrollTop;
                this.wW = body.clientWidth;
                this.wH = body.clientHeight;
            }
        },
        _css: function () {
            this._pos();
            this.BG.style.height = Math.max(this.pH, this.wH) + 'px';
            this.Box.style.width = 'auto';
            this.content.style.cssText = 'float:left';
            var cW = this.content.offsetWidth;
            this.content.style.cssText = '';
            // width max:300 min:200
            if (cW < this.minWidth) cW = this.minWidth;
            if (cW > this.maxWidth) {
                cW = this.maxWidth;
                // this.content.style.whiteSpace = '';
                this.content.style.whiteSpace = 'normal';
            }
            this.Box.style.width = cW + 'px';
            // absolute
            // this.Box.style.left = (this.wW - cW) / 2 + 'px';
            // this.Box.style.top = this.sY + (this.wH - this.Box.offsetHeight) / 2 + 'px';
            // fixed 1
            // this.Box.style.marginLeft = -(cW / 2) + 'px';
            // this.Box.style.marginTop = -(this.Box.offsetHeight / 2) + 'px';
            // fixed 2
            this.Box.style.marginLeft = -(cW / 2) + 'px';
            this.Box.style.top = (this.wH - this.Box.offsetHeight) / 2 + 'px';
        },
        _fixSize: function () {
            var serverTime = GetServerTime();
            var _this = this,
                time = +serverTime;
            this._timeid && clearInterval(this._timeid);
            this._timeid = setInterval(function () {
                if (+serverTime - time > 1000) {
                    clearInterval(_this._timeid);
                    _this._timeid = null;
                    return false;
                }
                _this._css();
            }, 250);
        },
        _define: function (option) {
            var _this = this;
            this.define.onclick = function (e) {
                e.stopPropagation();
                if (typeof option === 'function') {
                    _this._hide();
                    _this.Bool = true;
                    option && option(_this.Bool);
                    return;
                }
                var before = option.before && option.before();
                var bool = false;
                before === false && (bool = true);
                if (bool) {
                    e.stopPropagation();
                    return false;
                }
                _this._hide();
                _this.Bool = true;
                option.after && option.after(_this.Bool);
            };
        },
        _cancel: function (option) {
            var _this = this;
            this.cancel.onclick = function (e) {
                e.stopPropagation();
                _this._hide();
                _this.Bool = false;
                if (typeof option === 'function') {
                    option && option(_this.Bool);
                    return;
                }
                option.after && option.after(_this.Bool);
            };
        },
        _bind: function () {
            this.Box.focus();
            this._setEvent();
        },
        _unbind: function () {
            this.Box.blur();
            this.define.onclick = null;
            this.cancel.onclick = null;
            this.define.innerText = '确定';
            this.cancel.innerText = '取消';
            this._timer && clearTimeout(this._timer);
            this._timer = null;
            this._timeid && clearInterval(this._timeid);
            this._timeid = null;
        },
        _setEvent: function () {
            var _this = this;
            this.on(this.BG, 'touchmove', function (e) {
                e.preventDefault();
            });
            this.on(this.Box, 'touchmove', function (e) {
                e.preventDefault();
            });
            this.on(this.define, 'touchstart', function (e) {
                _this.define.className.indexOf('tips_hover') < 0 && (_this.define.className += ' tips_hover');
            });
            this.on(this.define, 'touchend', function (e) {
                _this.define.className = _this.define.className.replace('tips_hover', '').trim();
            });
            this.on(this.cancel, 'touchstart', function (e) {
                _this.cancel.className.indexOf('tips_hover') < 0 && (_this.cancel.className += ' tips_hover');
            });
            this.on(this.cancel, 'touchend', function (e) {
                _this.cancel.className = _this.cancel.className.replace('tips_hover', '').trim();
            });
            this.on(window, 'resize', function (e) {
                if (!_this._fix) return;
                _this._fixSize();
            });
        },
        _setBtn: function (n, option) {
            this.foot.style.display = 'block';
            this.define.style.display = '';
            this.cancel.style.display = '';
            switch (parseInt(n)) {
                case 1:
                    this.define.className = 'tips_define';
                    this.cancel.style.display = 'none';
                    if (typeof option === 'function') {
                        this.define.innerText = '确定';
                        this._define(function () {
                            option && option();
                        });
                    } else {
                        this.define.innerText = option.define || '确定';
                        this._define(option);
                    }
                    break;
                case 2:
                    this.define.className = '';
                    if (typeof option === 'function') {
                        this.define.innerText = '确定';
                        this.cancel.innerText = '取消';
                        this._define(function (b) {
                            option && option(b);
                        });
                        this._cancel(function (b) {
                            option && option(b);
                        });
                    } else {
                        this.define.innerText = option.define || '确定';
                        this.cancel.innerText = option.cancel || '取消';
                        this._define(option);
                        this._cancel(option);
                    }
                    break;
                case 0:
                    this.foot.style.display = 'none';
                    this.define.style.display = 'none';
                    this.cancel.style.display = 'none';
                    break;
            }
        },
        _setContent: function (html) {
            this.content.innerHTML = html + '';
        },
        _setOption: function (option, n, fn) {
            var content = '';
            this._create();
            if (typeof option === 'string' || typeof option === 'number') {
                content = option || '';
                this._setBtn(n, function (b) {
                    fn && fn(b);
                });
            } else {
                option = option || {},
                    content = option.content || '';
                this._setBtn(n, option);
            }
            this._setContent(content);
            this._show();
        },
        _setTime: function (option, t) {
            var time = 0,
                _this = this;
            time = (typeof option === 'string' ? t : option.time);
            if (parseInt(time) > 0) {
                this._timer = setTimeout(function () {
                    _this._hide();
                }, time * 1000);
            }
        },
        on: function (el, type, handler) {
            el.addEventListener(type, handler, false);
        },
        off: function (el, type, handler) {
            el.removeEventListener(type, handler, false);
        },
        $: function (s) {
            return document.querySelector(s);
        },
        alert: function (option, fn) {
            this._setOption(option, 1, fn);
        },
        confirm: function (option, fn) {
            this._setOption(option, 2, function (b) {
                fn && fn(b);
            });
        },
        open: function (option, t) {
            this._setOption(option, 0);
            this._setTime(option, t);
        },
        close: function () {
            this._hide();
        }
    };
}());