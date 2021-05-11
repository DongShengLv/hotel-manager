/* 角色管理页面 */
<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini" class="table">
      <el-table-column label="角色编号" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.roleName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" style="cursor:pointer">{{ scope.row.roleName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            type="success"
            @click="handleSetting(scope.$index, scope.row)"
            >设置权限</el-button
          >
          <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>

          <el-button
            slot="reference"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="ruleForm.roleName"
              type="text"
              autocomplete="off"
            ></el-input>
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

export default {
  data() {
    //验证角色名称的方法
    let validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      //是否打开抽屉
      drawer: false,
      //自右向左
      direction: "rtl",
      //表格数据
      tableData: [],
      //抽屉是否为添加
      isAdd: true,

      ruleForm: {
        roleName: "",
      },
      //校验
      rules: {
        roleName: [{ validator: validateRoleName, trigger: "blur" }],
      },
    };
  },

  created() {
    this.getTableList();
  },

  methods: {
    //获取角色表格数据的方法
    async getTableList() {
      //在页面中请求接口获取数据
      let res = await this.$get("/Role/List");
      //通过 api层接口获取数据
      // let res = await role_api.list();
      this.tableData = res;
    },

    //编辑按钮
    async handleEdit(index, row) {
      //获取角色编号
      let { roleId } = row;
      //根据角色编号获取角色对象
      //let res = await role_api.getOne({roleId});
      let res = await this.$get("/Role/GetOne", { roleId });
      this.ruleForm = res;
      //变成修改
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },

    //删除表格数据
    handleDelete(index, row) {
      //获取角色编号
      let { roleId } = row;

      this.$confirm("确认要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定
          let { success, message } = await this.$post("/Role/Delete", {
            roleId,
          });
          if (success) {
            //删除成功
            this.$msg_s(message, 1000);
            this.getTableList();
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
            let { success, message } = await this.$post(
              "/Role/Add",
              this.ruleForm
            );
            //判断是否添加成功
            if (success) {
              //成功
              this.$msg_s(message, 1000);
              //获取最新数据渲染表单
              this.getTableList();
              //清空表单
              this.resetForm('ruleForm');
              //关闭抽屉
              this.drawer = false;
            } else {
              this.$msg_e(message, 1000);
            }
          } else {
            //执行修改功能
            let { success, message } = await this.$post(
              "/Role/Update",
              this.ruleForm
            );
            //判断是否修改成功
            if (success) {
              //成功
              this.$msg_s(message, 1000);
              //获取最新数据渲染表单
              this.getTableList();
              //清空表单
              this.resetForm('ruleForm');
              //关闭抽屉
              this.drawer = !this.drawer;
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
  height: calc(100vh - 60px - 58px);
  overflow-y: auto;
}

.table::-webkit-scrollbar {
  width: 0 !important;
}
</style>