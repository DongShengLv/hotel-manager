/* 首页 */
<script>
export default {
  name: "Index",
  data() {
    return {};
  },

  async created() {
    //从浏览器的缓存中 获取登录名和密码
    let loginId = localStorage.getItem("loginId");
    let loginPwd = localStorage.getItem("loginPwd");
    //如果未获取到登录名或密码  则跳转到登录页
    if (!loginId || !loginPwd) {
      this.$router.push("/login");
    } else {
      let {success,token} = await this.$get("/Admin/Login", {
        loginId,
        loginPwd,
      });

      //判断是否登陆成功
      if (success) {
        //保存 token
        sessionStorage.setItem("token", token);
        //将 token信息放入请求头中
        this.$setToken();
        //跳转到后台页面
        this.$router.push("/layout");
      }else{
        this.$router.push("/login")
      }
    }
  },
};
</script>

<style scoped lang="scss">
</style>