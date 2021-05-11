/* 客户管理页面 */
<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 筛选 -->
      <el-input
        v-model="guestName"
        size="mini"
        style="width: 200px; margin-left: 20px"
        placeholder="请输入客户姓名"
        clearable
      ></el-input>

      <el-select
        size="mini"
        v-model="resideStateId"
        placeholder="请选择结账状态"
        clearable
        style="margin: 0 20px"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
        >
        </el-option>
      </el-select>

      <el-button type="success" size="mini" @click="searchClick"
        >查询
      </el-button>

      <el-button type="warning" size="mini" @click="excelClick"
        >导出excel
      </el-button>

      <el-button type="primary" size="mini" @click="drawer = true"
        >添加</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 99%; margin: 0"
      size="mini"
      class="table"
    >
      <el-table-column label="姓名" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.guestName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" width="100">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="身份证" width="150">
        <template slot-scope="scope">
          {{ scope.row.identityId }}
        </template>
      </el-table-column>

      <el-table-column label="住房号" width="65">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>

      <el-table-column label="房类型" width="70">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypeName }}
        </template>
      </el-table-column>

      <el-table-column label="房间价" width="65">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              size="medium"
              type="info"
              style="cursor: pointer; color: yellowgreen"
              >{{ scope.row.room.roomType.roomTypePrice }}</el-tag
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="入住日期" width="135">
        <template slot-scope="scope">
          {{ scope.row.resideDate }}
        </template>
      </el-table-column>

      <el-table-column label="离开日期" width="135">
        <template slot-scope="scope">
          {{ scope.row.leaveDate }}
        </template>
      </el-table-column>

      <el-table-column label="押金" width="50">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>

      <el-table-column label="消费" width="50">
        <template slot-scope="scope">
          {{ scope.row.totalMoney }}
        </template>
      </el-table-column>

      <el-table-column label="人数" width="40">
        <template slot-scope="scope">
          {{ scope.row.guestNum }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="60">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="
              `${scope.row.resideState.resideStateId}` == 1 ? 'info' : 'success'
            "
          >
            {{ scope.row.resideState.resideStateName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.resideStateId === 1"
            style="cursor: pointer"
            slot="reference"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-tag>

          <el-tag
            v-if="scope.row.resideStateId === 1"
            style="cursor: pointer"
            slot="reference"
            size="mini"
            type="warning"
            @click="handlePay(scope.$index, scope.row)"
          >
            结账
          </el-tag>

          <!-- 已结账的用户才能删除 -->
          <el-tag
            v-if="scope.row.resideStateId === 2"
            style="cursor: pointer"
            slot="reference"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex j-c" style="margin-top: 5px; text-align: center">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="count"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>

    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加' : '修改'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="30%"
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
          <el-form-item label="姓名" prop="guestName">
            <el-input
              v-model="ruleForm.guestName"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="身份证" prop="identityId">
            <el-input
              v-model="ruleForm.identityId"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="客房类型" prop="roomTypeId">
            <el-select
              @change="roomTypeChange"
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              clearable
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客房" prop="roomId">
            <el-select
              size="mini"
              v-model="ruleForm.roomId"
              placeholder="请选择客房"
              clearable
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="入住日期" prop="resideDate">
            <el-date-picker
              v-model="ruleForm.resideDate"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="押金" prop="deposit">
            <el-input
              v-model="ruleForm.deposit"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="入住人数" prop="guestNum">
            <el-input
              v-model="ruleForm.guestNum"
              type="number"
              autocomplete="off"
            ></el-input>
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
import { xlsx } from "../../util/xlsx";

export default {
  name: "Guest",
  data() {
    //验证房间编号
    let validateroomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间编号"));
      } else {
        callback();
      }
    };

    //验证房间类型
    let validateroomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间类型"));
      } else {
        callback();
      }
    };

    //验证客户姓名
    let validateguestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };

    //验证身份证
    let validateidentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("身份证不能为空"));
      } else {
        callback();
      }
    };

    //验证手机号
    let validatephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else {
        callback();
      }
    };

    //验证押金
    let validatedeposit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入押金"));
      } else {
        callback();
      }
    };

    //验证入住时间
    let validateresideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择入住时间"));
      } else {
        callback();
      }
    };

    //验证入住人数
    let validateguestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住人数"));
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

      //客户姓名 （用于搜索）
      guestName: "",
      //结账状态编号 （用于搜索）
      resideStateId: "",
      //结账状态列表
      resideStateList: [],

      //客房类型数组 (表单添加修改)
      roomTypeList: [],

      //客房列表 (表单添加修改)
      roomList: [],

      //上一次的房间号
      oldRoomId: "",

      //表单数据
      ruleForm: {
        //客户姓名
        guestName: "",
        //身份证
        identityId: "",
        //电话
        phone: "",
        //客房号
        roomId: "",
        //押金
        deposit: "",
        //入住时间
        resideDate: "",
        //入住人数
        guestNum: "",
        //房间类型编号
        roomTypeId: "",
      },

      //校验
      rules: {
        //客户姓名
        guestName: [{ validator: validateguestName, trigger: "blur" }],
        //身份证
        identityId: [{ validator: validateidentityId, trigger: "blur" }],
        //电话
        phone: [{ validator: validatephone, trigger: "blur" }],
        //客房编号
        roomId: [{ validator: validateroomId, trigger: "blur" }],
        //客房类型编号
        roomTypeId: [{ validator: validateroomTypeId, trigger: "blur" }],
        //押金
        deposit: [{ validator: validatedeposit, trigger: "blur" }],
        //入住时间
        resideDate: [{ validator: validateresideDate, trigger: "blur" }],
        //入住人数
        guestNum: [{ validator: validateguestNum, trigger: "blur" }],
      },
    };
  },

  created() {
    //获取客房类型表格数据的方法
    this.getTableData();

    //获取结账状态数组的方法
    this.getResideStateList();

    //调用获取客房类型列表的方法
    this.getRoomTypeList();
  },

  methods: {
    //获取客房数据的方法
    async getTableData() {
      //在页面中请求接口获取数据
      let { data, count } = await this.$get("/GuestRecord/List", {
        //页码
        pageIndex: this.pageIndex,
        //客户姓名
        guestName: this.guestName,
        //结账状态编号
        resideStateId: this.resideStateId || 0,
      });

      //设置表格显示的房间信息
      this.tableData = data;
      //设置每页显示的信息数量
      this.count = count;
    },

    //获取结账状态列表的方法
    async getResideStateList() {
      let data = await this.$get("/ResideState/List");
      this.resideStateList = data;
    },

    //获取客房列表的方法
    async getRoomTypeList() {
      let data = await this.$get("/RoomType/List");
      this.roomTypeList = data;
    },

    //客房列表选项改变的方法
    async roomTypeChange(roomTypeId) {
      //每次切换客房类型时  先清空表单中 roomId的值
      this.oldRoomId = this.ruleForm.roomId;
      this.ruleForm.roomId = "";
      if (roomTypeId) {
        this.ruleForm.roomTypeId = roomTypeId;
        //根据客房类型编号获取对应的客房信息 客房状态应为 空闲  客户编号也要传过去为了做逻辑处理
        let { data } = await this.$get("/Room/List", {
          roomTypeId,
          roomStateId: 1,
          guestId: this.ruleForm.guestId || 0,
        });
        this.roomList = data;
      }

      return this.oldRoomId;
    },

    //分页方法
    currentChange(pageIndex) {
      //设置当前页码
      this.pageIndex = pageIndex;
      //重新调用获取表格数据的方法
      this.getTableData();
    },

    //查询方法
    searchClick() {
      //重新调用获取表格数据的方法
      this.getTableData();
    },

    //表单添加方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          //判断是否提交表单的类型
          if (this.isAdd) {
            //执行添加功能
            let { message, success } = await this.$post(
              "/GuestRecord/Add",
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
              "/GuestRecord/Update",
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

    //导出 excel方法
    excelClick() {
      //组织导出数据
      let json = this.tableData.map((item) => {
        return {
          guestName: item.guestName,
          phone: item.phone,
          identityId: item.identityId,
          roomId: item.roomId,
          roomTypeName: item.room.roomType.roomTypeName,
          price: item.room.roomType.roomTypePrice,
          resideDate: item.resideDate,
          leaveDate: item.leaveDate,
          deposit: item.deposit,
          totalMoney: item.totalMoney,
          guestNum: item.guestNum,
          resideStateName: item.resideState.resideStateName,
        };
      });

      //设置表头对象
      let fields = {
        guestName: "客户姓名",
        phone: "客户电话",
        identityId: "身份证号",
        roomId: "入住房间",
        roomTypeName: "房间类型",
        price: "房间价格",
        resideDate: "入住日期",
        leaveDate: "离开日期",
        deposit: "押金",
        guestNum: "入住人数",
        resideStateName: "结账状态",
      };

      //定义文件名称
      let filename = "客户管理信息表";

      xlsx(json, fields, filename);
    },

    //编辑按钮
    async handleEdit(index, row) {
      //根据客户 id获取对应信息
      let guestId = row.guestId;
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      this.ruleForm = res;
      //给表单对象添加房间类型编号
      this.ruleForm.roomTypeId = res.room.roomTypeId;

      //根据房间类型编号 调用列表选项改变的方法 房间号为上一次的房间号
      this.ruleForm.roomId = await this.roomTypeChange(
        this.ruleForm.roomTypeId
      );

      //变成修改
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },

    //删除表格数据
    handleDelete(index, row) {
      //获取编号
      let { guestId } = row;

      this.$confirm("确认要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定 删除对应的账号信息
          let { success, message } = await this.$post("/GuestRecord/Delete", {
            guestId,
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

    //结账方法
    handlePay(index, row) {
      //结账确认
      this.$confirm("确认要结账吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //获取客户编号
          let guestId = row.guestId;
          let { totalMoney, message } = await this.$post(
            "GuestRecord/Checkout",
            { guestId }
          );
          if (totalMoney > 0) {
            this.$msg_s(`结账成功，需支付${totalMoney}元`, 3000);
            //重新获取数据
            this.getTableData();
          } else {
            this.$msg_e(message);
          }
        })
        .catch(() => {
          //点击取消
          return false;
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

    //关闭图片弹出层
    handleClosePic(done) {
      done();
      //清空照片墙中缓存的客房照片
      this.fileList = [];
    },

    //表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        guestName: "",
        identityId: "",
        phone: "",
        roomId: "",
        deposit: "",
        resideDate: "",
        guestNum: "",
        roomTypeId: "",
      };
    },
  },
};
</script>


<style scoped lang="scss">
.table {
  height: calc(100vh - 60px - 58px - 50px);
  overflow-y: auto;
}

.table::-webkit-scrollbar {
  width: 0 !important;
}

.el-table::before {
  width: 0;
}
</style>