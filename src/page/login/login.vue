<template>
  <div class="admin-login-box">
    <!-- 后台登录入口，只有登录，没有注册，也没有找回密码 -->
    <!-- 只有门户一个用户入口，如果是管理员则跳转到管理中心，否则，跳转到首页/重定向到首页 -->
    <!-- 如果是门户的登录，则有登录、注册、找回密码这些功能 -->
    <!-- 顶部内容 -->
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">博客系统|登录</div>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="admin-login-center-box">
      <div class="center login-center-box">
        <el-row>
          <el-col :span="10">
            <el-form label-width="100px">
              <el-form-item label="帐号" required>
                <el-input
                  clearable
                  v-model="user.userName"
                  placeholder="请输入帐号"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input
                  show-password
                  clearable
                  v-model="user.password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="人类验证码" required>
                <el-input
                  @keyup.enter.native="submitLogin"
                  clearable
                  v-model="loginInfo.verifyCode"
                  placeholder="请输入人类验证码"
                />
                <img
                  :src="captchPath"
                  @click="updateVerifyCode"
                  class="captcha-code"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitLogin">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 底部内容 -->
  </div>
</template>

<script>
import { doLogin } from "@/api/app";
export default {
  data() {
    return {
      user: {
        userName: "路不离开",
        password: "123456",
      },
      loginInfo: {
        verifyCode: "",
        captcha_key: "",
        from: "p_",
      },
      captchPath: "",
    };
  },
  methods: {
    toastError(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: "error",
      });
    },
    submitLogin() {
      if (this.userName === "") {
        this.toastError("帐号不能为空");
        return;
      }
      if (this.password === "") {
        this.toastError("密码不能为空");
        return;
      }
      if (this.loginInfo.verifyCode === "") {
        this.toastError("人类验证码不能为空");
        return;
      }
      doLogin(
        this.loginInfo.verifyCode,
        this.loginInfo.captcha_key,
        this.loginInfo.from,
        this.user
      ).then((result) => {
        if (result.code === 20001) {
          this.$router.push("/");
        } else {
          this.toastError(result.message);
          this.updateVerifyCode();
        }
      });
    },
    updateVerifyCode() {
      this.captchPath =
        "http://localhost:2020/user/captcha?captcha_key=" +
        this.loginInfo.captcha_key +
        "&random=" +
        Date.parse(new Date());
    },
  },
  mounted() {
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode();
  },
};
</script>
<style>
.captcha-code {
  cursor: pointer;
  width: 120px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  border-radius: 4px;
  border: solid 1px #e6e6e6;
  vertical-align: middle;
}

.admin-login-header-box {
  width: 100%;
  height: 46px;
  background: dodgerblue;
  margin-bottom: 20px;
}

.center {
  margin: 0 auto;
  width: 1140px;
}
.admin-login-header-center {
  line-height: 46px;
}

.login-center-box .el-input {
  width: 200px;
}

.login-center-box {
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 10px 0 #afafaf;
}

.admin-login-logo {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}
</style>