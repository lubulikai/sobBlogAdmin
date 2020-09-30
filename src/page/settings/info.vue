<template>
  <!-- 管理员信息页面 -->
  <div>
    <el-form class="user-info-el-form" label-width="80px">
      <el-form-item label="用户ID">
        <el-input v-model="userInfo.id" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email" disabled />
        <el-button type="primary" @click="goToChangeEmail">去修改</el-button>
      </el-form-item>
      <el-form-item label="用户名" required>
        <el-input
          v-model="userInfo.userName"
          clearable
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="签名">
        <el-input v-model="userInfo.sign" clearable placeholder="请输入签名" />
      </el-form-item>
      <el-form-item label="头像">
        <el-image
          class="avatar-el-image"
          @click="changeAvatar"
          :src="userInfo.avatar"
          fit="fill"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doUpdate"> 更新用户信息</el-button>
      </el-form-item>
    </el-form>
    <my-upload
      field="file"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="uploadShow"
      :width="300"
      :height="300"
      url="api/admin/image"
      img-format="png"
    ></my-upload>
  </div>
</template>

<script>
import * as api from "@/api/api";
import myUpload from "vue-image-crop-upload";
export default {
  components: {
    myUpload,
  },
  data() {
    return {
      userInfo: {
        id: "",
        email: "",
        userName: "",
        sign: "",
        avatar: "",
      },
      uploadShow: false,
    };
  },
  methods: {
    //上传成功
    cropUploadSuccess(res, field) {
      if (res.code === api.success_code) {
        this.userInfo.avatar = api.base_url + "portal/image/" + res.data.id;
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    //上传失败
    cropUploadFail(status, field) {
      this.$message.error("头像上传失败");
    },
    changeAvatar() {
      this.uploadShow = true;
    },
    doUpdate() {
      if (this.userInfo.userName === "") {
        this.$message.error("用户名不能为空");
        return;
      }
      api.updateUserInfo(this.userInfo.id, this.userInfo).then((res) => {
        if (res.code === api.success_code) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    goToChangeEmail() {
      this.$router.push("/settings/email");
    },
    getUserInfo() {
      api.checkToken().then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          this.userInfo.id = data.id;
          this.userInfo.email = data.email;
          this.userInfo.userName = data.userName;
          this.userInfo.sign = data.sign;
          this.userInfo.avatar = data.avatar;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>
<style>
.avatar-el-image {
  width: 100px;
  height: 100px;
}
.user-info-el-form .el-form-item {
  width: 600px;
}
.user-info-el-form > .el-form-item .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>