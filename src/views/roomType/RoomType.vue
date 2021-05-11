/* 客房类型页面 */
<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加客房类型</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini" class="table">
      <el-table-column label="类型编号" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.roomTypeId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.roomTypeName }}
        </template>
      </el-table-column>

      <el-table-column label="床位数" width="150">
        <template slot-scope="scope">
          {{ scope.row.bedNum }}
        </template>
      </el-table-column>

      <el-table-column label="价格" width="150">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" style="cursor: pointer">{{
               scope.row.roomTypePrice 
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

    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加客房类型' : '修改客房类型'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="35%"
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
          <el-form-item label="类型名称" prop="roomTypeName">
            <el-input
              v-model="ruleForm.roomTypeName"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="床位数" prop="bedNum">
            <el-input
              v-model="ruleForm.bedNum"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model="ruleForm.roomTypePrice"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="typeDescription">
            <quill-editor
              v-model="ruleForm.typeDescription"
              ref="myQuillEditor"
              style="height: 200px;margin-bottom:120px"
            ></quill-editor>
          </el-form-item>

          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="submitForm('ruleForm')">
                {{ isAdd ? "添加" : "修改" }}</el-button
              >
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//导入角色 API
//import * as role_api from "@/api/role_api";


import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config/index";

export default {
    name:'RoomType',
  data() {
    //验证客房名称
    let validateroomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房名称"));
      } else {
        callback();
      }
    };
    //验证价格
    let validateroomTypePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房价格"));
      } else {
        callback();
      }
    };
    //验证床位数
    let validatebedNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入床位数"));
      } else if (value < 1) {
        callback(new Error("床位数最少为 1"));
      } else {
        callback();
      }
    };

    return {
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

      newVal: "1234",

      //表单数据
      ruleForm: {
        //客房类型编号
        roomTypeId: "",
        //客房类型名称
        roomTypeName: "",
        //客房价格
        roomTypePrice: "",
        //客房床位数
        bedNum: "",
        //客房类型描述
        typeDescription: "",
      },
      //校验
      rules: {
        //客房名称
        roomTypeName: [{ validator: validateroomTypeName, trigger: "blur" }],
        //价格
        roomTypePrice: [{ validator: validateroomTypePrice, trigger: "blur" }],
        //床位数
        bedNum: [{ validator: validatebedNum, trigger: "blur" }],
      },

      //管理员头像根路径
      BASE_URL_AdminImg,
      //管理员头像上穿路径
      Upload_AdminImg_URL,
    };
  },

  created() {
    //获取客房类型表格数据的方法
    this.getTableData();

    //获取角色列表数据
    this.getRoleList();
  },

  methods: {
    //获取客房类型数据的方法
    async getTableData() {
      //在页面中请求接口获取数据
      let data = await this.$get("/RoomType/List");
      this.tableData = data;
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
      //获取编号
      let {roomTypeId} = row;
      //根据编号获取角色对象 并赋值
      let res = await this.$get("/RoomType/GetOne", { roomTypeId });
      this.ruleForm = res;
      //变成修改
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },

    //删除表格数据
    handleDelete(index, row) {
      //获取编号
      let { roomTypeId } = row;

      this.$confirm("确认要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定 删除对应的账号信息
          let { success, message } = await this.$post("/RoomType/Delete", {
            roomTypeId
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
          //判断是否提交表单的类型
          if (this.isAdd) {
            //执行添加功能
            let {message,success} = await this.$post(
              "/RoomType/Add",
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
            } else {
              this.$msg_e(message, 1000);
            }
          } else {
            //执行修改功能
            let { success, message } = await this.$post(
              "/RoomType/Update",
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
  },
};
</script>

<style scoped lang="scss">
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