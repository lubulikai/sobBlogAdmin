<template>
  <div>
    <el-form class="email-manage-el-form" label-width="80px">
      <el-form-item label="邮箱" required>
        <el-input
          class="email-manage-e-input"
          v-model="params.email"
          placeholder="请输入邮箱"
          clearable
        />
        <el-button
          type="primary"
          @click="getVerifyCode"
          :disabled="btnSendDisabled"
          >{{ btnSendText }}</el-button
        >
      </el-form-item>
      <el-form-item label="验证码" required>
        <el-input
          class="email-manage-e-input"
          v-model="params.verifyCode"
          placeholder="请输入验证码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doUpdate">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from "@/api/api";
const emailReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
export default {
  data() {
    return {
      params: {
        email: "",
        verifyCode: "",
      },
      btnSendText: "获取验证码",
      btnSendDisabled: false,
      sendInterval: null,
    };
  },
  methods: {
    doUpdate() {
      if (!emailReg.test(this.params.email)) {
        this.$message.error("邮箱格式不正确");
        return;
      }
      if (this.params.verifyCode === "") {
        this.$message.error("验证码不能为空");
        return;
      }
      api.updateEmail(this.params.email, this.params.verifyCode).then((res) => {
        if (res.code === api.success_code) {
          this.$message.success(res.message);
          this.resetSendBtn();
          this.params.verifyCode = "";
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getVerifyCode() {
      if (!emailReg.test(this.params.email)) {
        this.$message.error("邮箱格式不正确");
        return;
      }
      api.sendEmailVerifyCode(this.params.email, "update").then((res) => {
        if (res.code === api.success_code) {
          this.btnSendDisabled = true;
          let countDownNumber = 60;
          this.sendInterval = setInterval(() => {
            if (countDownNumber <= 0) {
              this.resetSendBtn();
            } else {
              this.btnSendText = "获取验证码(" + countDownNumber-- + ")";
            }
          }, 1000);
          this.$message.success("验证码已发送");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    resetSendBtn() {
      clearInterval(this.sendInterval);
      this.btnSendText = "获取验证码";
      this.btnSendDisabled = false;
    },
  },
  beforeDestroy() {
    if (this.sendInterval != null) {
      clearInterval(this.sendInterval);
    }
  },
};
</script>
<style>
.email-manage-el-form {
  width: 600px;
}
.email-manage-e-input {
  width: 200px;
  margin-right: 10px;
}
</style>