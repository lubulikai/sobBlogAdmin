import http from './http';

//解析token
export const checkToken = () => {
    return http.requestGet("/user/check-token");
};

//登录
export const doLogin = (verifyCode, verifyKey, from, user) => {
    return http.requestPost("/user/login/" +
        verifyCode +
        "/" +
        verifyKey +
        "?from=" +
        from, user);
}