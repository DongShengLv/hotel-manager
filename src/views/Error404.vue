/* 404页面 */
<template>
  <div class="error404">
    <img src="/image/404.jpg" alt="404" @click="goHome" />
  </div>
</template>

<script>
export default {
  name: "Error404",
  methods:{
      //点击图片返回首页
      goHome(){
          this.$router.push('/layout');
      }
  }
};
</script>

<style scoped lang="scss">
.error404 {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;

  img {
    width: 46%;
    height:60%;
    cursor: pointer;
  }
}
</style>