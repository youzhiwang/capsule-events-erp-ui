<template>
    <div class="layout">
        <div class="top-nav-wrap">
            <div class="logo">
                <h3>Capsule Events ERP <sub>v: 1.0.0</sub></h3>
            </div>
            <div class="blank"/>
            <div class="user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                    <div class="el-dropdown-link nickname">
                        你好,{{ nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="main-wrap">
            <div class="left-nav-warp">
                <el-menu default-active="home"
                         class="el-menu-vertical-demo"
                         background-color="#545c64"
                         text-color="rgba(255, 255, 255, .6)"
                         active-text-color="#ffffff"
                         :router="true">
                    <el-menu-item index="/home">
                        <i class="el-icon-guide"/>
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
                        <i class="el-icon-setting"/>
                        <span slot="title">成本管理</span>
                    </el-menu-item>
                </el-menu>
            </div>
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
        nickname: ''
      }
    },
    methods: {
      handleCommand(commandItem) {
        if (commandItem === 'changePassword') {
          this.$message.info('开发中')
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
      }
    },
    created() {
      const loginStatus = localStorage.getItem('loginStatus')
      if (loginStatus) this.nickname = localStorage.getItem('nickname')
    }
  }
</script>

<style lang="scss" scoped>
    .layout {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .top-nav-wrap {
            height: 60px;
            flex-shrink: 0;
            flex-grow: 0;
            background-color: rgba(0, 0, 0, .8);
            display: flex;
            flex-direction: row;

            .logo {
                color: #ffffff;
                padding: 0 24px;

                sub {
                    font-size: 12px;
                    color: rgba(255, 255, 255, .8);
                }
            }

            .blank {
                flex: 1;
            }

            .user-info {
                padding: 0 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                align-content: center;

                .nickname {
                    color: #fff;
                }
            }
        }

        .main-wrap {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: row;
            height: 100%;
            overflow: hidden;

            .left-nav-warp {
                width: 250px;
                flex-shrink: 0;
                flex-grow: 0;
                background-color: #545c64;
            }

            .main {
                flex: 1;
                width: 100%;
                overflow: hidden;
            }
        }
    }
</style>