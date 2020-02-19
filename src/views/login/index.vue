<template>
  <div class="login">
    <div class="form-wrap">
      <h3>Capsule Events ERP</h3>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="el-form--custom"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            @keypress.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-tooltip
            effect="light"
            content="需要帮助，请联系管理员"
            placement="top"
            :open-delay="500"
          >
            <el-button>帮助</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.Form.validate(v => {
        if (v) {
          this.axios.post('/api/login', this.form).then(res => {
            res = res.data
            if (res.code === 'success') {
              // 设置登录信息
              localStorage.setItem('username', res.data.username)
              localStorage.setItem('nickname', res.data.nickname)
              localStorage.setItem('loginStatus', true)
              this.$message.success('登录成功')
              this.$router.push({ name: 'home' })
            } else this.$message.error(res.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('../../assets/login-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;

  .form-wrap {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    padding: 0 24px;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: ease 0.3s;
    &:hover {
      background: rgba(255, 255, 255, 1);
    }

    .el-form--custom {
      width: 100%;
    }
  }
}
</style>
