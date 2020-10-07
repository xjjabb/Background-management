<template>
  <div id="home">
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    name: 'Home',
    methods: {
        logout(){
            window.sessionStorage.clear();
            this.$message.success('退出成功');
            this.$router.push('/login');
        }
    }
}
</script>

<style lang="less" scoped>

</style>