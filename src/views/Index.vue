<template>
  <el-container>
    <el-header class="header">
      <el-card></el-card>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu default-active="1" class="menu"></el-menu>
      </el-aside>
      <el-main class="main">main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import { api } from "../utils";

export default {
  name: "Index",
  mounted() {
    api.bind(this)("/asdf", {}, () => {});
  },
};
</script>

<style lang="scss">
$header-height: 50px;
.without-padding {
  padding: 0;
  .header {
    height: $header-height !important;
  }
  .main {
  }
}
.menu {
  height: calc(100vh - $header-height);
  width: 200px;
}
</style>
