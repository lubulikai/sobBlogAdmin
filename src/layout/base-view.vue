<template>
  <div>
    <el-container>
      <el-header id="base-header">
        <topHeader />
      </el-header>
      <el-container>
        <el-aside id="base-aside" width="200px">
          <leftMenu />
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer>底部内容</el-footer>
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
    topHeader
  },
  mounted() {
    let headHeight = document.getElementById("base-header").offsetHeight;
    let windowHeight = window.innerHeight;
    let baseAside = document.getElementById("base-aside");
    baseAside.style.height = windowHeight - headHeight + "px";
  },
};
</script>
<style>
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