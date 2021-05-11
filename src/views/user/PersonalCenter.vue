/* 个人中心页面 */
<template>
  <div class="flex a-c">
    <div>
      <el-image
        style="width: 200px; height: 200px"
        :src="BASE_URL_AdminImg + (admin.photo || 'admin_default.jpg')"
        fit="cover"
      ></el-image>
    </div>

    <div class="content">
      <p>账号：{{ admin.loginId }}</p>
      <p>姓名：{{ admin.name }}</p>
      <p>电话：{{ admin.phone }}</p>
      <p>角色：{{admin.role.roleName}}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { BASE_URL_AdminImg } from "../../config/index";

export default {
  name: "PersonalCenter",
  data() {
    return {
      BASE_URL_AdminImg,
    };
  },
  computed: {
    ...mapState("admin", ["admin"]),
  },
};
</script>

<style scoped lang="scss">
.content {
  margin-left: 10px;
  p {
    line-height: 30px;
  }
}
</style>