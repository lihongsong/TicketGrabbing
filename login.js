$(function () {
    $(".btn").click(function () {
        Login();
    });
    $(".return_arrow").click(function () {
        history.go(-1);
    });
});
function Login() {
    var username = $("#username").val();
    var password = $("#password").val();
    if (username.length == 0) {
        Tips.alert("用户名不能为空");
        return;
    }
    if (password.length == 0) {
        Tips.alert("密码不能为空");
        return;
    }
    ajax({
        url: homePath + "Login/Login",
        data: {
            userID: username,
            password: password
        },
        action: function (data) {
            if (sessionStorage.returnurl == undefined) {
                onHref(homePath + "Mine/Index");
            }
            else {
                onHref(sessionStorage.returnurl);
                sessionStorage.removeItem("returnurl");
            }
        }
    });
}