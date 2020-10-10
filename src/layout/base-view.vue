<template>
  <div class="base-container-box">
    <el-container class="base-el-container">
      <el-header id="base-header">
        <topHeader />
      </el-header>
      <el-container class="base-main-container">
        <el-aside id="base-aside" width="220px">
          <leftMenu />
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import topHeader from "@/layout/top-header";
import leftMenu from "@/layout/left-menu";
export default {
  components: {
    leftMenu,
    topHeader,
  },
  // mounted() {
  //   let headHeight = document.getElementById("base-header").offsetHeight;
  //   let windowHeight = window.innerHeight;
  //   let baseAside = document.getElementById("base-aside");
  //   baseAside.style.height = windowHeight - headHeight + "px";
  // },
};
</script>
<style>
.base-main-container {
  position: absolute;
  top: 46px;
  bottom: 0;
  width: 100%;
}
.el-header {
  background-color: dodgerblue;
  line-height: 46px;
  height: 46px !important;
}
#base-aside {
  border-right: solid 1px #e6e6e6;
}
.el-main {
  padding: 0;
}
</style>