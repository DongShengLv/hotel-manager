import Vue from 'vue'
import VueRouter from 'vue-router'

//导入 nprogress 加载进度条的库
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(VueRouter)

const routes = [
  //首页
  {
    path: '/',
    meta: {
      title: 'hotelManageSystem',
      //允许数字代号为 1的角色访问
      // authority:[1,3,6]
    },
    component: () => import("@v/Index.vue"),
  },
  //登录页
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@v/Login.vue'),
  },
  //整体布局页
  {
    path: '/layout',
    meta: {
      title: 'layout'
    },
    component: () => import('@v/Layout.vue'),
    //配置嵌套路由
    children: [{
        path: '',
        meta: {
          title: '首页',
          mark:'r'
        },
        component: () => import('@v/user/Home.vue'),
      },
      {
        path: 'message',
        meta: {
          title: '系统消息',
          mark:'r'
        },
        component: () => import('@v/user/Message.vue'),
      },
      {
        path: 'email',
        meta: {
          title: '电子邮件',
          mark:'r'
        },
        component: () => import('@v/user/Email.vue'),
      },
      {
        path: 'personalCenter',
        meta: {
          title: '个人中心',
          mark:'r'
        },
        component: () => import('@v/user/PersonalCenter.vue'),
      },
      {
        path: 'resetPwd',
        meta: {
          title: '修改密码',
          mark:'r'
        },
        component: () => import('@v/user/ResetPwd.vue'),
      },
      {
        path: 'role', //角色管理
        meta: {
          title: '角色管理',
          //权限
          authority:[1],
        },
        component: () => import('@v/role/Role.vue'),
      },
      {
        path: 'admin', //账号管理
        meta: {
          title: '账号管理'
        },
        component: () => import('@v/admin/Admin.vue'),
      },
      {
        path: 'roomType', //客房类型
        meta: {
          title: '客房类型管理',
          authority:[1],

        },
        component: () => import('@v/roomType/RoomType.vue'),
      },
      {
        path: 'room', //客房
        meta: {
          title: '客房管理'
        },
        component: () => import('@v/room/Room.vue'),
      },
      {
        path: 'guest', //客户
        meta: {
          title: '客户管理'
        },
        component: () => import('@v/guest/Guest.vue'),
      },
      {
        path: 'authority', //权限
        meta: {
          title: '权限管理',
          authority:[1],

        },
        component: () => import('@v/authority/Authority.vue'),
      },
    ]
  },
  {
    // * 号表示剩余的全部情况
    path: "*",
    meta: {
      title: "404"
    },
    component: () => import("@v/Error404.vue"),
  },

];




const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//导航前置守卫
router.beforeEach((to, from, next) => {
  //现实加载进度条
  NProgress.start();
  //设置网页的 title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  //验证权限 authority有值说明是系统管理员
  if (to.meta && to.meta.authority) {
    if (to.meta.authority.includes(parseInt(localStorage.getItem('roleId')))) {
      next();
    } else {
     router.push("/layout");
    }
  }
  next();
})

router.afterEach(() => {
  //关闭加载进度条
  NProgress.done();
})

export default router