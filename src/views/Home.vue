<template>
  <el-button @click="logout" type="info">退出</el-button>
</template>

<script>
export default {
  name: "Home",
  methods: {
    //退出方法
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页面
      this.$router.replace("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>