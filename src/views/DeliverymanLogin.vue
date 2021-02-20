<template>
  <div class="out">
    <el-card class="login-pad">
      <div slot="header">
        <span>快递员登录</span>
      </div>
      <div class="info-text">
        本系统仅限快递人员登录，账号由公司统一配发
      </div>
      <el-form>
        <el-form-item>
          <el-input
              placeholder="用户名"
              v-model="loginForm['username']"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="密码"
              type="password"
              v-model="loginForm['password']"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginFunc()">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {api} from "@/utils";

export default {
  name: "DeliverymanLogin",
  data: () => {
    return {
      loginForm: {username: "", password: ""},
      loginFunc() {
        api.bind(this)(
            "/deliveryman/login",
            this.loginForm,
            (response) => {
              if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                this.$router.push("/deliveryman");
              }
            },
            false
        );
      },
    };
  },
};
</script>

<style>
.info-text {
  color: gray;
  font-size: 0.7em;
  margin-bottom: 10px;
}

.out {
  height: 100vh;
  width: 100vw;
  background: #003a6c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-pad {
  width: 300px;
  background: rgba(255, 255, 255, 0.5);
}
</style>