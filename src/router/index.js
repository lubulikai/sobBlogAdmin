import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// const home = () => import("@/components/home");
// const article = () => import("@/components/article");
// const login = () => import("@/page/login/login");//登录界面
const loop = () => import("@/page/operation/loop");//轮播图配置
const manageCategory = () => import("@/page/operation/manage-category");//文章分类管理
const friendLink = () => import("@/page/settings/friend-link");//友情链接管理
const websizeInfo = () => import("@/page/settings/websize-info");//网站信息管理
const email = () => import("@/page/user/email");//用户email管理
const info = () => import("@/page/user/info");//管理员信息
const list = () => import("@/page/user/list");//用户列表管理
const restPassword = () => import("@/page/user/rest-password");//重置密码
const articleManage = () => import("@/page/content/manage-article");//文章管理
const commentManage = () => import("@/page/content/manage-comment");//评论管理
const imageManage = () => import("@/page/content/manage-image");//图片管理
const postArticle = () => import("@/page/content/post-article");//上传文章
const index = () => import("@/page/dashboard/index");//首页
const baseView = () => import("@/layout/base-view");//母版页
const rightContent = () => import("@/layout/right-content");//右侧内容


export const routes = [
    {
        path: '/home',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: "/index",
                name: "首页",
                icon: "el-icon-s-home",
                hidden: false,
                component: index
            },
            {
                path: '/content',
                name: "内容",
                icon: "el-icon-tickets",
                hidden: false,
                component: rightContent,
                children: [
                    {
                        path: 'post-article',
                        name: "发表文章",
                        icon: "el-icon-edit-outline",
                        hidden: false,
                        component: postArticle
                    },
                    {
                        path: 'manage-image',
                        name: "图片管理",
                        icon: "el-icon-picture-outline",
                        hidden: false,
                        component: imageManage
                    },
                    {
                        path: 'manage-comment',
                        name: "评论管理",
                        icon: "el-icon-chat-line-round",
                        hidden: false,
                        component: commentManage
                    },
                    {
                        path: 'manage-article',
                        name: "文章管理",
                        icon: "el-icon-document",
                        hidden: false,
                        component: articleManage
                    }
                ]
            },
            {
                path: '/user',
                name: "用户",
                icon: "el-icon-user",
                hidden: false,
                component: rightContent,
                children: [
                    {
                        path: 'rest-password',
                        name: "重置密码",
                        icon: "el-icon-view",
                        hidden: false,
                        component: restPassword
                    },
                    {
                        path: 'list',
                        name: "用户列表",
                        icon: "el-icon-document",
                        hidden: false,
                        component: list
                    },
                    {
                        path: 'info',
                        name: "用户信息",
                        icon: "el-icon-notebook-2",
                        hidden: false,
                        component: info
                    },
                    {
                        path: 'email',
                        name: "邮箱管理",
                        icon: "el-icon-message",
                        hidden: false,
                        component: email
                    }
                ]
            },
            {
                path: '/operation',
                name: "运营",
                icon: "el-icon-s-flag",
                hidden: false,
                component: rightContent,
                children: [
                    {
                        path: 'loop',
                        name: "轮播图",
                        hidden: false,
                        icon: "el-icon-water-cup",
                        component: loop
                    },
                    {
                        path: 'manage-category',
                        name: "文章分类",
                        icon: "el-icon-s-order",
                        hidden: false,
                        component: manageCategory
                    }
                ]
            }
            ,
            {
                path: '/settings',
                name: "设置",
                icon: "el-icon-setting",
                hidden: false,
                component: rightContent,
                children: [
                    {
                        path: 'websize-info',
                        name: "网站信息",
                        icon: "el-icon-s-platform",
                        hidden: false,
                        component: websizeInfo
                    },
                    {
                        path: 'friend-link',
                        name: "友情链接",
                        icon: "el-icon-share",
                        hidden: false,
                        component: friendLink
                    }
                ]
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

export default router;