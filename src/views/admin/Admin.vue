/* 账户管理页面 */
<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <el-select
        size="mini"
        v-model="roleId"
        placeholder="请选择角色"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roleListToSearch"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        >
        </el-option>
      </el-select>

      <el-button type="success" size="mini" @click="searchClick"
        >查询
      </el-button>

      <el-button type="primary" size="mini" @click="drawer = true"
        >添加账号</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini" class="table">
      <el-table-column label="编号" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账号" width="150">
        <template slot-scope="scope">
          {{ scope.row.loginId }}
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="电话" width="150">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="头像" width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 31px; height: 31px"
            :src="BASE_URL_AdminImg + (scope.row.photo || 'admin_default.jpg')"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="角色名称" width="150">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" style="cursor: pointer">{{
              scope.row.role.roleName
            }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>

          <el-button
            slot="reference"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex j-c" style="margin-top: 5px; text-align: center">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="count"
        :page-size="8"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>

    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加角色' : '修改角色'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div style="padding: 0 15px">
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="头像" prop="photo">
            <el-upload
              class="avatar-uploader"
              :action="Upload_AdminImg_URL"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image
                v-if="ruleForm.photo"
                :src="BASE_URL_AdminImg + ruleForm.photo"
                class="avatar"
                fit="cover"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="账号" prop="loginId">
            <el-input
              v-model="ruleForm.loginId"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 不需要修改密码 -->
          <el-form-item v-if="isAdd" label="密码" prop="loginPwd">
            <el-input
              v-model="ruleForm.loginPwd"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
            <el-input
              v-model="ruleForm.loginPwd2"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="ruleForm.name"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="ruleForm.roleId"
              placeholder="请选择角色"
              clearable
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              {{ isAdd ? "添加" : "修改" }}</el-button
            >
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//导入角色 API
//import * as role_api from "@/api/role_api";

//导入 MD5加密方法
import { strToMd5 } from "../../util/md5";

import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config/index";

export default {
  data() {
    //验证账号的方法
    let validateloginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    //验证密码的方法
    let validateloginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    //验证确认密码的方法
    let validateloginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.ruleForm.loginPwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    //验证姓名的方法
    let validatename = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    //验证电话的方法
    let validatephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    //验证角色的方法
    let validateroleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      //角色列表选择
      roleList: [],
      //角色列表 (用于搜索)
      roleListToSearch: [],
      //角色编号 (用于根据条件查询账号信息)
      roleId: "",

      //是否打开抽屉
      drawer: false,
      //自右向左
      direction: "rtl",
      //抽屉是否为添加
      isAdd: true,

      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //当前页码
      pageIndex: 1,

      //表单数据
      ruleForm: {
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        roleId: "",
        photo: "",
      },
      //校验
      rules: {
        //账号
        loginId: [{ validator: validateloginId, trigger: "blur" }],
        //密码
        loginPwd: [{ validator: validateloginPwd, trigger: "blur" }],
        //确认密码
        loginPwd2: [{ validator: validateloginPwd2, trigger: "blur" }],
        //姓名
        name: [{ validator: validatename, trigger: "blur" }],
        //电话
        phone: [{ validator: validatephone, trigger: "blur" }],
        //角色
        roleId: [{ validator: validateroleId, trigger: "change" }],
      },

      //管理员头像根路径
      BASE_URL_AdminImg,
      //管理员头像上穿路径
      Upload_AdminImg_URL,
    };
  },

  created() {
    //获取账号表格数据
    this.getTableData();

    //获取角色列表数据
    this.getRoleList();
  },

  methods: {
    //获取表格数据的方法
    async getTableData() {
      //在页面中请求接口获取数据
      // data 账号数组数据  count 总共有多少条数据
      let { data, count } = await this.$get("/Admin/List", {
        roleId: this.roleId || 0,
        pageIndex: this.pageIndex,
        pageSize: 8,
      });
      this.tableData = data;
      this.count = count;
    },

    //分页方法
    currentChange(pageIndex) {
      //设置当前页码
      this.pageIndex = pageIndex;
      //重新调用获取表格数据的方法
      this.getTableData();
    },

    //获取角色列表数据
    async getRoleList() {
      let data = await this.$get("/Role/List");
      this.roleList = data;
      this.roleListToSearch = data;
    },

    //编辑按钮
    async handleEdit(index, row) {
      //获取登录名
      let { loginId } = row;
      //根据登录名获取角色对象
      //let res = await role_api.getOne({roleId});
      let res = await this.$get("/Admin/GetOne", { loginId });
      this.ruleForm = res;
      //变成修改
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },

    //删除表格数据
    handleDelete(index, row) {
      //获取编号 头像图片名称
      let { id, photo } = row;

      this.$confirm("确认要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定 删除对应的账号信息
          let { success, message } = await this.$post("/Admin/Delete", {
            id,
            photo,
          });
          if (success) {
            //删除成功
            this.$msg_s(message, 1000);
            this.getTableData();
          } else {
            this.$msg_e(message);
          }
        })
        .catch(() => {
          //点击取消
        });
    },

    //关闭抽屉方法
    handleClose(done) {
      this.$confirm("确定关闭???")
        .then(() => {
          done();
          //isAdd变成默认状态 添加
          this.isAdd = true;
          //清空表单数据
          this.resetForm("ruleForm");
          return true;
        })
        .catch(() => {
          return false;
        });
    },

    //表单添加方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          //对密码进行加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          //判断是否提交表单的类型
          if (this.isAdd) {
            //执行添加功能
            let { success, message } = await this.$post(
              "/Admin/Add",
              this.ruleForm
            );
            //判断是否添加成功
            if (success) {
              //成功
              this.$msg_s(message, 1000);
              //获取最新数据渲染表单
              this.getTableData();
              //清空表单
              this.resetForm("ruleForm");
              /*  //关闭抽屉
              this.drawer = false; */
            } else {
              this.$msg_e(message, 1000);
            }
          } else {
            //执行修改功能
            let { success, message } = await this.$post(
              "/Admin/Update",
              this.ruleForm
            );

            //判断是否修改成功
            if (success) {
              //成功
              this.$msg_s(message, 1000);
              //获取最新数据渲染表单
              this.getTableData();
              //清空表单
              this.resetForm("ruleForm");
              //关闭抽屉
              this.drawer = false;
              //
            } else {
              this.$msg_e(message, 1000);
            }
          }
        } else {
          return false;
        }
      });
    },

    //表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        roleId: "",
        photo: "",
      };
    },

    //查询方法
    searchClick(){
      //重新调用获取表格数据的方法
      this.getTableData();
    },

    //图片上传成功
    handleAvatarSuccess(res, file) {
      let { success, message, filename } = res;
      //成功
      if (success) {
        this.ruleForm.photo = filename;
        this.$msg_s(message, 1000);
      } else {
        this.$msg_e(message, 1000);
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //图片上传前
    beforeAvatarUpload(file) {
      //可以上传图片的类型
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      //是否包含
      const isJPG = img_type_list.includes(file.type);
      //限制图片大小   < 1M
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG GIF 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
  },
};
</script>

<style lang="scss">
.search {
  padding: 0px 10px 10px 5px;
}

.table {
  height: calc(100vh - 60px - 58px - 40px);
  overflow-y: auto;
}
.table::-webkit-scrollbar {
  width: 0 !important;
}

.el-table::before {
  height: 0;
}

.avatar-uploader {
  transform: translateY(-25%);
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  color: red;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 58px;
  height: 58px;
  line-height: 58px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>