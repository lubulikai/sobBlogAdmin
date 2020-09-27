<template>
  <div>
    <el-menu id="base-menu" :default-active="$route.path" router unique-opened>
      <template v-for="(item,index) in menuList">
        <el-submenu v-show="!item.hidden" v-if="item.children" :key="index" :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item
            v-show="!child.hidden"
            :key="index+'-'+number"
            v-for="(child,number) in item.children"
            :index="item.path+'/'+child.path"
          >
            <i :class="child.icon"></i>
            {{child.name}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-show="!item.hidden" v-else :key="index" :index="item.path">
          <i :class="item.icon"></i>
          {{item.name}}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { routes } from "../router";
export default {
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
    let list = routes[0].children;
    this.menuList = list;
    console.log(this.$route);
  },
};
</script>
<style>
#base-menu{
  border-right: none;
}
</style>