import http from './http';

export const success_code = 20000;

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

//发送邮箱验证码
export const sendEmailVerifyCode = (email, type) => {
    return http.requestGet("api/user/verify_code?email=" + email + "&type=" + type);
}

//更新邮箱
export const updateEmail = (email, verifyCode) => {
    return http.requestPut("api/user/email?email=" + email + "&verify_code=" + verifyCode);
}

//更新用户信息
export const updateUserInfo = (id, user) => {
    return http.requestPut("api/user/user_info/" + id, user);
}

//获取网站title
export const getWebSizeTitle = () => {
    return http.requestGet("api/admin/web_size_info/title");
}

//更新网站title
export const updateWebSizeInfo = title => {
    return http.requestPut("api/admin/web_size_info/title?title=" + title);
}

//获取网站seo信息
export const getSeoInfo = () => {
    return http.requestGet("api/admin/web_size_info/seo");
}

//更新网站seo信息
export const updateSeoInfo = (description, keywords) => {
    return http.requestPut("api/admin/web_size_info/seo?description=" + description + "&keywords=" + keywords);
}

//友情链接列表
export const listFriendLink = () => {
    return http.requestGet("api/admin/friend_link/list");
}

//获取单条友情链接
export const getFriendLink = id => {
    return http.requestGet("api/admin/friend_link/" + id);
}

//添加友情链接
export const addFriendLink = (friendLink) => {
    return http.requestPost("api/admin/friend_link", friendLink);
}

//更新友情链接
export const updateFriendLink = (id, friendLink) => {
    return http.requestPut("api/admin/friend_link/" + id, friendLink);
}

//删除友情链接
export const deleteFriendLink = id => {
    return http.requestDelete("api/admin/friend_link/" + id);
}

//获取图片列表
export const getListImage = (page, size, original = "") => {
    return http.requestGet("api/admin/image/list/" + page + "/" + size + "?original=" + original);
}

//获取文章列表
export const getListArticle = (page, size, keyword, categoryId, state) => {
    return http.requestGet("api/admin/article/list/" + page + "/" + size + "?keyword=" + keyword + "&categoryId=" + categoryId + "&state=" + state);
}

//删除文章
export const deleteArticleById = id => {
    return http.requestDelete("api/admin/article/" + id);
}

//软删除文章
export const deleteArticleByUpdateState = id => {
    return http.requestPut("api/admin/article/state/" + id);
}

//新增文章
export const addArticle = article => {
    return http.requestPost("api/admin/article", article);
}

//更新文章
export const updateArticle = (articleId, article) => {
    return http.requestPut("api/admin/article/" + articleId, article);
}

//置顶文章
export const topArticle = id => {
    return http.requestPut("api/admin/article/top/" + id);
}

//获取文章详情
export const getArticle = id => {
    return http.requestGet("api/admin/article/" + id);
}

//获取评论列表
export const getListComment = (page, size) => {
    return http.requestGet("api/admin/comment/list?page=" + page + "&size=" + size);
}

//删除评论
export const deleteCommentById = id => {
    return http.requestDelete("api/admin/comment/" + id);
}

//置顶评论
export const topComment = id => {
    return http.requestPut("api/admin/comment/top/" + id);
}
