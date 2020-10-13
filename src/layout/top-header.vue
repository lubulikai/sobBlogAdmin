<template>
  <div>
    <div class="header-left-box">
      <div class="header-logo">博客系统管理中心</div>
    </div>
    <div class="header-right-box">
      <el-image class="image-avater" :src="avatar" fit="fill" />
      <el-dropdown class="el-dropdown-avatar" @command="handleCommand">
        <span class="el-dropdown-link el-dropdown-link-title">
          {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userInfo"> 用户信息 </el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      avatar: "",
      userName: "",
    };
  },
  methods: {
    getUserInfo() {
      this.avatar = window.localStorage.getItem("avatar");
      this.userName = window.localStorage.getItem("userName");
    },
    handleCommand(command) {
      if (command === "userInfo") {
        this.$router.push("/settings/info");
      } else if (command === "logout") {
        this.$confirm("确定要退出吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          api.doLogout().then((res) => {
            if (res.code === api.success_code) {
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          });
        });
      }
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>
<style>
.header-logo {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}
.header-left-box {
  float: left;
}
.header-right-box {
  float: right;
  cursor: pointer;
}
.el-dropdown-link-title {
  color: white;
  font-weight: 600;
}
.image-avater {
  float: left;
  margin-right: 5px;
}
.image-avater img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}
.el-dropdown-avatar {
  float: right;
}
</style>