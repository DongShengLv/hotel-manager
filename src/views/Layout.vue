/* 整体布局页面 */
<template>
  <div class="main">
    <!-- 左侧导航 -->
    <div class="left" :style="{ background: themeColor }">
      <div :class="{'logo':!isCollapse,'active':isCollapse}">System</div>
      <el-menu
        :default-active="activeIndexLeft"
        class="el-menu-vertical-demo"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账户管理</span>
          </template>
          <el-menu-item v-if="$store.state.admin.admin.roleId == 1" index="/layout/role">角色管理</el-menu-item>
          <el-menu-item index="/layout/admin">账户管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>客房管理</span>
          </template>
          <el-menu-item v-if="$store.state.admin.admin.roleId == 1" index="/layout/roomType">类型管理</el-menu-item>
          <el-menu-item index="/layout/room">客房管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/layout/guest">客户管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4" v-if="$store.state.admin.admin.roleId == 1">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="/layout/authority">权限管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!-- 右侧内容 -->
    <div class="right">
      <!-- 顶部导航 -->
      <div class="nav" :style="{ background: themeColor }">
        <div class="icon" @click="change">
          <i class="el-icon-s-fold" v-show="!isCollapse"></i>
          <i class="el-icon-s-unfold" v-show="isCollapse"></i>
        </div>
        <el-menu
         :default-active="activeIndexRight"
          class="el-menu-demo"
          mode="horizontal"
          :background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="min-width:650px"
          router
        >
          <el-menu-item index="/layout"
            ><i class="el-icon-s-home"></i>Home</el-menu-item
          >
          <el-menu-item index="/layout/message"
            ><i class="el-icon-message"></i>Message</el-menu-item
          >
          <el-menu-item index="/layout/email"
            ><i class="el-icon-position"></i>Email</el-menu-item
          >
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-help"></i>Theme</template>
            <el-menu-item
              @click="changeTheme(item.value)"
              :index="item.value"
              v-for="(item, index) in theme"
              :key="index"
              >{{ item.name }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"
              ><i class="el-icon-user-solid"></i>{{ admin.name }}</template
            >
            <el-menu-item index="/layout/personalCenter">个人中心</el-menu-item>
            <el-menu-item index="/layout/resetPwd">修改密码</el-menu-item>
            <el-menu-item index="exit" @click="exit">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- 内容区 -->
      <div class="content">
        <!-- 路由视图 -->
       <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
//导入 vuex的映射函数
import { mapState, mapMutations } from "vuex";

export default {
  name: "Layout",
  data() {
    return {
      activeIndexLeft:'',
      activeIndexRight:"/layout",
      //主题颜色
      themeColor: localStorage.getItem("theme") || "#101f30",
      //是否展开
      isCollapse: false,
    };
  },

  async created() {
    //获取当前登录的用户名
    let loginId = localStorage.getItem("loginId");

    //如果浏览器缓存中没有用户信息，需返回到登陆页面
    if (!loginId) {
      this.$router.push("/login");
    } else {
      //根据用户名获取用户信息
      let res = await this.$get("/Admin/GetOne", { loginId }) || null;
      this.setAdmin(res);

      //在浏览器缓存中 保存当前登录用户的角色编号
    localStorage.setItem('roleId',res.roleId);
    }
    
  },

  computed: {
    //导入 vuex 主题
    ...mapState("theme", ["theme"]),
    ...mapState("admin", ["admin"]),
  },

  methods: {
    //导入 vuex登录账户的方法
    ...mapMutations("admin", ["setAdmin"]),

    //切换主题颜色
    changeTheme(color) {
      //设置当前主题颜色
      this.themeColor = color;
      //将主题颜色保存到浏览器的缓存中
      localStorage.setItem("theme", color);
    },

    //折叠导航栏
    change() {
      this.isCollapse = !this.isCollapse;
    },

    //退出登录
    exit() {
      //清除浏览器缓存中的登录名 密码 token 等数据
      sessionStorage.clear();
      localStorage.clear();

      //跳转到登录页面
      this.$router.push("/login");
    },
    
  
  },

  watch:{
    $route(to){
      if(!to.meta.mark){
        this.activeIndexRight = "";
        this.activeIndexLeft = to.path;
      }else{
        this,this.activeIndexLeft = "";
        this.activeIndexRight = to.path;
      }
    }
  }

};
</script>



<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  display: flex;

  .left {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
    .logo {
      width: 90%;
      color: white;
      font-size: 18px;
      text-align: center;
      padding: 8px 0;
      border: 1px solid #ccc;
      margin: 10px auto;
      transition: .3s;
    }
    .active{
      width: 90%;
      color: white;
      font-size:14px;
      text-align: center;
      padding: 8px 0;
      border: 1px solid #ccc;
      margin: 10px auto;
      transition: .8s;
    }

    ul {
      margin-top: 14px;
      border-right-width: 0px;
    }
  }
  .right {
    flex: 1;

    .nav {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .icon {
        padding-left: 5px;
        cursor: pointer;
        i {
          color: white;
          font-size: 20px;
        }
      }
    }

    .content {
      padding: 8px 0;
  }
  }
}
</style>