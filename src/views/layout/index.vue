<style lang="scss" scoped src="./style/index.scss" />
<style lang="scss" src="./style/el-hack.scss" />

<template>
    <div class="layout">
        <div class="top-nav-wrap">
            <div class="logo">
                <h3>Capsule Events ERP <sub>v: 1.0.1</sub></h3>
            </div>
            <div class="blank"/>
            <div class="user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                    <div class="el-dropdown-link nickname">
                        {{ greetingWords }}，{{ nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="main-wrap">
            <el-scrollbar>
                <div class="left-nav-warp">
                    <el-menu default-active="/home"
                             class="el-menu-vertical-demo"
                             background-color="#545c64"
                             text-color="rgba(255, 255, 255, .6)"
                             active-text-color="#ffffff"
                             :default-openeds="['erp-manage']"
                             :router="true">
                        <el-menu-item index="/home">
                            <i class="el-icon-s-home"/>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <el-menu-item index="/brand-manage">
                            <i class="el-icon-menu"/>
                            <span slot="title">品牌管理</span>
                        </el-menu-item>
                        <el-menu-item index="/commodity-manage">
                            <i class="el-icon-document"/>
                            <span slot="title">商品管理</span>
                        </el-menu-item>
                        <el-menu-item index="/cost-manage">
                            <i class="el-icon-s-opportunity"/>
                            <span slot="title">成本管理</span>
                        </el-menu-item>
                        <el-submenu index="erp-manage">
                            <template slot="title">
                                <i class="el-icon-receiving"></i>
                                <span slot="title">进销存管理</span>
                            </template>
                            <el-menu-item index="/storage-in">
                                <i class="el-icon-shopping-bag-1"/>
                                <span slot="title">入库管理</span>
                            </el-menu-item>
                            <el-menu-item index="/storage-out">
                                <i class="el-icon-sold-out"/>
                                <span slot="title">销库管理</span>
                            </el-menu-item>
                            <el-menu-item index="/remaining-query">
                                <i class="el-icon-shopping-bag-2"/>
                                <span slot="title">库余查询</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item index="/version-manage">
                            <i class="el-icon-s-order"/>
                            <span slot="title">版本日志</span>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-scrollbar>
            <div class="main">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'layout',
    data() {
      return {
        greetingWords: '',
        nickname: ''
      }
    },
    methods: {
      handleCommand(commandItem) {
        if (commandItem === 'changePassword') {
          this.$prompt('请输入密码', '修改密码', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'password',
            inputPattern: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
            inputErrorMessage: '最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'
          }).then(({value}) => {
            const params = {password: value}
            this.axios.put('/api/users-password', params).then(res => {
              res = res.data
              if (res.code === 'success') this.$message.success('密码修改成功，下次登录将使用新密码')
              else this.$message.error(res.message)
            })
          }).catch(() => {
          })
        }
        if (commandItem === 'logout') {
          this.axios.get('/api/logout').then(res => {
            res = res.data
            if (res.code === 'success') {
              // 清除登录信息
              localStorage.removeItem('username')
              localStorage.removeItem('nickname')
              localStorage.removeItem('loginStatus')

              this.$message.success(res.message)
              this.$router.push({name: 'login'})
            }
          })
        }
      },
      setGreetingWords() {
        const now = new Date()
        const hour = now.getHours()
        let greetingWords = ''
        if (hour < 6) greetingWords = '凌晨好'
        else if (hour < 9) greetingWords = '早上好'
        else if (hour < 12) greetingWords = '上午好'
        else if (hour < 14) greetingWords = '中午好'
        else if (hour < 17) greetingWords = '下午好'
        else if (hour < 19) greetingWords = '傍晚好'
        else if (hour < 22) greetingWords = '晚上好'
        else {
          greetingWords = '夜里好'
          this.$message.warning('深夜了，赶紧休息吧～')
        }
        this.greetingWords = greetingWords
      }
    },
    created() {
      this.setGreetingWords()
      const loginStatus = localStorage.getItem('loginStatus')
      if (loginStatus) this.nickname = localStorage.getItem('nickname')
    }
  }
</script>