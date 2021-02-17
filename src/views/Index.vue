<template>
  <el-container>
    <el-header class="header">
      <el-card></el-card>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu :default-active="currentActive" class="menu">
          <el-menu-item @click="$router.push('/index/warehouse')" index="1">
            <template slot="title">
              <i class="el-icon-house">
                <span>货仓管理</span>
              </i>
            </template>
          </el-menu-item>
          <el-menu-item @click="$router.push('/index/inventory')" index="2">
            <template slot="title">
              <i class="el-icon-box">
                <span>库存管理</span>
              </i>
            </template>
          </el-menu-item>
          <el-menu-item @click="$router.push('/index/deliveryman')" index="3">
            <template slot="title">
              <i class="el-icon-bicycle">
                <span>快递员管理</span>
              </i>
            </template>
          </el-menu-item>
          <el-menu-item index="4">
            <template slot="title">
              <i class="el-icon-truck">
                <span>配送管理</span>
              </i>
            </template>
          </el-menu-item>
          <el-menu-item @click="$router.push('/login')" index="5">
            <template slot="title">
              <i class="el-icon-back">
                <span>登出</span>
              </i>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main"><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      currentActive: "1"
    };
  },
  mounted() {
    const pathIndex = {
      '/index/warehouse': 1,
      '/index/inventory': 2,
      '/index/deliveryman': 3,
    }
    if (this.$router.currentRoute.fullPath in pathIndex) {
      this.currentActive = pathIndex[this.$router.currentRoute.fullPath].toString();
    }
  }
};
</script>

<style lang="scss">
$header-height: 50px;
$side-width: 200px;

@mixin without-padding {
  padding: 0 !important;
}

.header {
  height: $header-height !important;
  @include without-padding;
  > .el-card {
    height: calc(100% - 3px);
  }
}

.main {
  @include without-padding;
}

.el-aside {
  width: $side-width !important;
}

.menu {
  height: calc(100vh - #{$header-height});
  width: $side-width - 1px;
}
</style>
