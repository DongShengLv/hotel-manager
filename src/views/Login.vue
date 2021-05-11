/* 登录页面 */
<template>
  <div class="main">
    <!-- 背景画布 -->
    <canvas id="particle-canvas" width="1919" height="377"></canvas>

    <div class="login">
      <el-form
        size="mini"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="50px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="loginId">
          <el-input
            type="text"
            v-model="ruleForm.loginId"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="loginPwd">
          <el-input
            type="password"
            v-model="ruleForm.loginPwd"
            autocomplete="off"
            @keyup.enter.native="sign('ruleForm')"
          ></el-input>
        </el-form-item>

        <el-form-item lable="" prop="">
          <el-checkbox v-model="ruleForm.checkMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//导入 MD5加密方法
import { strToMd5 } from "../util/md5";
//导入背景动画方法
import { startAnimation } from "../assets/js/login";

export default {
  name: "Login",
  data() {
    //验证登录名的方法
    let validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    //验证密码的方法
    let validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      //表单数据
      ruleForm: {
        //登录名
        loginId: "",
        //登录密码
        loginPwd: "",
        checkMe: false,
      },
      //校验
      rules: {
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
      },
    };
  },

  mounted() {
    //调用背景动画方法
    startAnimation();
  },
  methods: {
    //公共函数
    public(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //实现登录
          //对密码进行加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          let { success, message } = await this.$get(
            "/Admin/Login",
            this.ruleForm
          );
          console.log(success, message);
          if (success) {
            //判断是否登录成功 success为 true返回一个 token 里面保存的是你的身份信息
            let { token } = await this.$get("/Admin/Login", this.ruleForm);
            //保存该 token信息 保存到浏览器的缓存空间中
            sessionStorage.setItem("token", token);
            //将账号名保存到浏览器的缓存空间长久储存
            localStorage.setItem("loginId", this.ruleForm.loginId);

            //判断是否记住密码
            if (this.ruleForm.checkMe) {
              this.ruleForm.loginId = localStorage.setItem(
                "loginId",
                this.ruleForm.loginId
              );
              this.ruleForm.loginPwd = localStorage.setItem(
                "loginPwd",
                this.ruleForm.loginPwd
              );
            }

            //将 token放入请求头中
            //this.$setToken();

            this.$msg_s(message, 1000);
            //跳转到后台管理页面
            this.$router.push("/layout");
          } else {
            this.$msg_e(message, 1000);
          }
        } else {
          return false;
        }
      });
    },
    //表单提交方法
    submitForm(formName) {
      this.public(formName);
    },
    //表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    sign(formName) {
      this.public(formName);
    },
  },
};
</script>

<style scoped lang="scss">
/* 背景画布样式 */
#particle-canvas {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgb(10, 10, 50) 0%,
    rgb(60, 10, 60) 100%
  );
  vertical-align: middle;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login {
    position: fixed;
    width: 400px;
    height: 220px;
    border: 1px solid #ccc;
    border-radius: 10px;

    .el-form {
      padding: 30px;
    }
  }
}
</style>