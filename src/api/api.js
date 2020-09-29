import http from './http';

export const success_code = 20000;

export const base_url = "http://192.168.63.128:2020/";

//解析token
export const checkToken = () => {
    return http.requestGet("api/user/check-token");
};

//登录
export const doLogin = (verifyCode, verifyKey, from, user) => {
    return http.requestPost("api/user/login/" +
        verifyCode +
        "/" +
        verifyKey +
        "?from=" +
        from, user);
}

//获取分类列表信息
export const listCategories = () => {
    return http.requestGet("api/admin/category/list");
}

//获取单个分类信息
export const getCategory = (id) => {
    return http.requestGet("api/admin/category/" + id)
}

//添加分类信息
export const addCategory = (category) => {
    return http.requestPost("api/admin/category", category);
}

//更新分类信息
export const updateCategory = (id, category) => {
    return http.requestPut("api/admin/category/" + id, category);
}

//软删除分类信息
export const deleteCategory = (id) => {
    return http.requestDelete("api/admin/category/" + id);
}

//获取轮播图列表信息
export const listLoop = () => {
    return http.requestGet("api/admin/looper/list");
}

//获取单个轮播图信息
export const getLoop = (id) => {
    return http.requestGet("api/admin/looper/" + id);
}

//添加轮播图信息
export const addLoop = (loop) => {
    return http.requestPost("api/admin/looper", loop);
}

//更新轮播图信息
export const updateLoop = (id, loop) => {
    return http.requestPut("api/admin/looper/" + id, loop);
}

//删除轮播图信息
export const deleteLoop = (id) => {
    return http.requestDelete("api/admin/looper/" + id);
}

//用户列表信息
export const listUser = (page, size, email = "", userName = "") => {
    return http.requestGet("api/user/list?page=" + page + "&size=" + size + "&email=" + email + "&userName=" + userName + "");
}

//重置用户密码
export const resetUserPassword = (userId, password) => {
    return http.requestPut("api/user/reset-password/" + userId + "?password=" + password);
}

//软删除用户
export const deleteUser = id => {
    return http.requestDelete("api/user/" + id);
}