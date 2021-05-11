/* 客房管理页面 */
<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 筛选 -->
      <el-select
        size="mini"
        v-model="roomTypeId"
        placeholder="请选择客房类型"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roomTypeList"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"
        >
        </el-option>
      </el-select>

      <el-select
        size="mini"
        v-model="roomStateId"
        placeholder="请选择客房状态"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roomStateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick"
        >查询
      </el-button>

      <el-button type="warning" size="mini" @click="excelClick"
        >导出Excel
      </el-button>

      <el-button type="primary" size="mini" @click="drawer = true"
        >添加</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini" class="table">
      <el-table-column label="房间号" width="160">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间类型" width="160">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypeName }}
        </template>
      </el-table-column>

      <el-table-column label="床位数" width="160">
        <template slot-scope="scope">
          {{ scope.row.roomType.bedNum }}
        </template>
      </el-table-column>

      <el-table-column label="价格" width="160">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              size="medium"
              type="info"
              style="cursor: pointer; color: yellowgreen"
              >{{ scope.row.roomType.roomTypePrice }}</el-tag
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="160">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              size="medium"
              :type="tag[scope.row.roomState.roomStateName]"
              style="cursor: pointer"
              >{{ scope.row.roomState.roomStateName }}</el-tag
            >
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
            type="warning"
            @click="handleShowImg(scope.$index, scope.row)"
          >
            图片
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
        @current-change="currentChange"
      >
      </el-pagination>
    </div>

    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加客房' : '修改客房'"
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
          <el-form-item label="房间编号" prop="roomId">
            <el-input
              v-model="ruleForm.roomId"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="客房数量" prop="bedNum">
            <el-input
              v-model="ruleForm.bedNum"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              clearable
              style="margin-right: 10px"
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

          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              size="mini"
              v-model="ruleForm.roomStateId"
              placeholder="请选择客房状态"
              clearable
              style="margin-right: 10px"
            >
              <el-option
                v-for="item in roomStateList2"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <quill-editor
              v-model="ruleForm.description"
              ref="myQuillEditor"
              style="height: 160px; margin-bottom: 120px"
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

    <!-- 图片弹出层 -->
    <el-dialog
      title="房间图片"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClosePic"
      top="30vh"
    >
      <!-- 上传图片 -->
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 用于预览图片的弹出层 -->
      <el-dialog
        :visible.sync="dialogVisible2"
        width="45%"
        top="0vh"
        append-to-body
      >
        <el-image
          style="width: 100%"
          :src="dialogImageUrl"
          fit="cover"
        ></el-image>
        <!--  <img width="100%" :src="dialogImageUrl" alt="" /> -->
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
//导入房间图片上传路径 导入图片显示的根路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config/index";

//导入 导出 excel方法
import { xlsx } from "../../util/xlsx";

export default {
  name: "RoomType",
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

    //验证房间状态
    let validateroomStateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间状态"));
      } else {
        callback();
      }
    };

    //验证客房数量
    let validatebedNum = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error("添加的房间数不应小于1"));
      } else {
        callback();
      }
    };

    return {
      //是否显示弹出层
      dialogVisible: false,
      //是否显示预览图片的弹出层、
      dialogVisible2: false,
      //预览图片的 url
      dialogImageUrl: "",
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

      //筛选客房类型的数组  (用于查询)
      roomTypeList: [],
      //筛选客房状态的数组  (用于查询)
      roomStateList: [],
      //客房状态列表   (用于添加和修改)
      roomStateList2: [],
      //房间类型编号
      roomTypeId: "",
      //客房状态编号
      roomStateId: "",

      //定义当前房间图片对应的房间号
      roomId: "",

      //房间墙显示图片的列表
      fileList: [],

      //表单数据
      ruleForm: {
        //客房编号
        roomId: "",
        //客房类型
        roomTypeId: "",
        //客房状态
        roomStateId: "",
        //客房描述
        description: "",
      },
      //校验
      rules: {
        //客房类型
        roomTypeId: [{ validator: validateroomTypeId, trigger: "blur" }],
        //客房数量
        bedNum: [{ validator: validatebedNum, trigger: "blur" }],
        //客房状态
        roomStateId: [{ validator: validateroomStateId, trigger: "blur" }],
        //客房编号
        roomId: [{ validator: validateroomId, trigger: "blur" }],
      },

      //房间图片上传路径
      Upload_RoomImg_URL,
      //房间图片根路径
      BASE_URL_RoomImg,
      //客房状态标签
      tag: {
        '空闲': "success",
        '入住': "warning",
        '维修': "info",
      },
    };
  },

  created() {
    //获取客房类型表格数据的方法
    this.getTableData();

    //获取客房类型数组的方法
    this.getRoomTypeList();

    //获取客房状态数组的方法
    this.getRoomStateList();
  },

  methods: {
    //获取客房数据的方法
    async getTableData() {
      //在页面中请求接口获取数据
      let { data, count } = await this.$get("/Room/List", {
        pageIndex: this.pageIndex,
        roomTypeId: this.roomTypeId || 0,
        roomStateId: this.roomStateId || 0,
      });
      //设置表格显示的房间信息
      this.tableData = data;
      //设置每页显示的信息数量
      this.count = count;
    },

    //获取客房类型列表的方法
    async getRoomTypeList() {
      let data = await this.$get("/RoomType/List");
      this.roomTypeList = data;
    },

    //获取客房状态列表的方法
    async getRoomStateList() {
      let data = await this.$get("/RoomState/List");
      this.roomStateList = data;

      //获取房间状态信息  默认没有 入住选项
      let data2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList2 = data2;
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

    //导出 Excel
    excelClick() {
      //数据
      let json = this.tableData.map((item) => {
        return {
          roomId: item.roomId,
          roomType: item.roomType.roomTypeName,
          bendNum: item.roomType.bedNum,
          price: item.roomType.roomTypePrice,
          roomState: item.roomState.roomStateName,
        };
      });

      //表头对象
      let fields = {
        roomId: "客房编号",
        roomType: "客房类型",
        bendNum: "床位数",
        price: "价格",
        roomState: "客房状态",
      };

      //定义文件名称
      let filename = "客房信息表";

      xlsx(json, fields, filename);
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
              "/Room/Add",
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
              "/Room/Update",
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

    //编辑按钮
    async handleEdit(index, row) {
      //获取编号
      let { roomId } = row;
      let res = await this.$get("/Room/GetOne", { roomId });
      this.ruleForm = res;
      //给表单对象添加一个 ID 用于备份房间号
      this.ruleForm.id = res.roomId;
      //变成修改
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },

    //删除表格数据
    handleDelete(index, row) {
      //获取编号
      let { roomId } = row;

      this.$confirm("确认要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定 删除对应的账号信息
          let { success, message } = await this.$post("/Room/Delete", {
            roomId,
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
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        roleId: "",
        photo: "",
      };
      this.roomTypeId2 = "";
      this.roomStateId2 = "";
    },

    //查看客房图片
    handleShowImg(index, row) {
      //显示上传图片弹出层
      this.dialogVisible = true;
      //获取当前客房的编号
      this.roomId = row.roomId;
      //根据客房查询所有的客房图片
      this.showImg();
    },

    //上传图片成功的方法
    async handleAvatarSuccess(res, file) {
      //返回上传图片的状态信息以及上传成功后的图片名称
      let { success, message, filename } = res;

      //成功
      if (success) {
        await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename,
        });

        //图片添加成功 重新显示上传的图片列表
        // this.showImg();

        this.$msg_s(message, 1000);
      } else {
        this.$msg_e(message, 1000);
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    //上传图片之前的方法
    beforeAvatarUpload(file) {
      //可以上传图片的类型
      let img_type_list = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      //是否包含
      const isJPG = img_type_list.includes(file.type);
      //限制图片大小   < 1M
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传客房图片只能是 JPG PNG GIF JPEG 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传客房图片大小不能超过 1MB!");
      }

      return isJPG && isLt1M;
    },

    //删除照片墙里面的照片
    async handleRemove(file) {
      //删除图片根据图片的 ID 和图片名称
      let roomImgId = file.id;
      let { name } = file;
      //删除对应的图片信息
      let { success, message } = await this.$post("/RoomImg/Delete", {
        roomImgId,
        filename: name,
      });
      if (success) {
        this.$msg_s(message, 1000);
      } else {
        this.$msg_e(message, 1000);
      }
    },

    //预览照片
    handlePictureCardPreview(file) {
      //设置显示预览图片的地址
      this.dialogImageUrl = file.url;
      //预览图片的弹出层打开
      this.dialogVisible2 = true;
    },

    //公共函数  展示图片列表
    async showImg() {
      let res = await this.$get("/RoomImg/List", { roomId: this.roomId });
      //设置房间照片墙上显示的图片
      this.fileList = res.map((r) => {
        return {
          id: r.roomImgId,
          name: r.imgUrl,
          url: this.BASE_URL_RoomImg + r.imgUrl,
        };
      });
    },
  },
};
</script>


<style scoped lang="scss">
.table {
  height: calc(100vh - 60px - 58px - 40px);
  overflow-y: auto;
}
</style>