/* 重置密码页面 */
<template>
  <div style="width: 300px; margin: 70px auto 0">
    <el-form
      size="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldLoginPwd">
        <el-input
          v-model="ruleForm.oldLoginPwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newLoginPwd">
        <el-input
          v-model="ruleForm.newLoginPwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmLoginPwd">
        <el-input
          v-model="ruleForm.confirmLoginPwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { strToMd5 } from "../../util/md5";

export default {
  name: "ResetPwd",

  data() {
    //验证原密码
    let validateoldLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatenewLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    //验证确认密码
    let validateconfirmLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if(value != this.ruleForm.newLoginPwd){
          callback(new Error("两次密码不一致"));
      }else {
        callback();
      }
    };

    return {
      ruleForm: {
        //管理员编号
        id: this.$store.state.admin.admin.id,
        //原密码
        oldLoginPwd: "",
        //新密码
        newLoginPwd: "",
        //确认新密码
        confirmLoginPwd: "",
      },
      rules: {
        oldLoginPwd: [{ validator: validateoldLoginPwd, trigger: "blur" }],
        newLoginPwd: [{ validator: validatenewLoginPwd, trigger: "blur" }],
        confirmLoginPwd: [
          { validator: validateconfirmLoginPwd, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //提交按钮
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          //对原密码进行加密
          this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
          //对新密码加密
          this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
          //执行添加功能
          let { success, message } = await this.$post(
            "/Admin/ResetPwd",
            this.ruleForm
          );
          //判断是否添加成功
          if (success) {
            //成功
            this.$msg_s(message, 1000);
            //清空表单
          } else {
            this.$msg_e(message, 1000);
          }
        } else {
          return false;
        }
      });
    },
    //取消按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        //管理员编号
        id: this.$store.state.admin.admin.id,
        //原密码
        oldLoginPwd: "",
        //新密码
        newLoginPwd: "",
        //确认新密码
        confirmLoginPwd: "",
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>