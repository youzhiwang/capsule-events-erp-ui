<template>
    <div class="home">
        <el-divider content-position="left">通知</el-divider>
        <el-card shadow="hover">
            <div class="operation-wrap">
                <el-button type="primary" size="mini">发布</el-button>
            </div>
            <div v-for="(item, index) in noticeList" :key="index" class="notice-box">
                <p v-html="item.event" class="event"/>
                <p class="time-and-nickname">{{ item.time }} by {{ item.nickname }}
                    <el-button type="text">删除</el-button>
                </p>
            </div>
        </el-card>
        <el-divider content-position="left">KPI达成情况</el-divider>
        <el-card shadow="hover">
            <div class="operation-wrap">
                <el-button type="primary" size="mini">创建KPI</el-button>
            </div>
            <el-table :data="tableData" border stripe>
                <el-table-column label="一月"></el-table-column>
                <el-table-column label="二月"></el-table-column>
                <el-table-column label="三月"></el-table-column>
                <el-table-column label="四月"></el-table-column>
                <el-table-column label="五月"></el-table-column>
                <el-table-column label="六月"></el-table-column>
                <el-table-column label="七月"></el-table-column>
                <el-table-column label="八月"></el-table-column>
                <el-table-column label="九月"></el-table-column>
                <el-table-column label="十月"></el-table-column>
                <el-table-column label="十一月"></el-table-column>
                <el-table-column label="十二月"></el-table-column>
            </el-table>
        </el-card>
        <el-divider content-position="left">最近30天入库报表</el-divider>
        <el-card shadow="hover">
            <span style="font-size: 12px; color: grey;">折线图...开发中</span>
        </el-card>
        <el-divider content-position="left">最近30天销库报表</el-divider>
        <el-card shadow="hover">
            <span style="font-size: 12px; color: grey;">折线图...开发中</span>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        noticeList: [
          {
            time: '2020-03-01',
            nickname: '蝙蝠侠',
            event: '2020年5月1日，为庆祝公司销量破1000亿，打算在大灶头农家山庄举办公司年会，请大家务必准时参加。<br>里面的新冠状蝙蝠汤真的非常的美味！'
          },
          {
            time: '2020-03-01',
            nickname: '蝙蝠侠',
            event: '2020年5月1日，为庆祝公司销量破1000亿，打算在大灶头农家山庄举办公司年会，请大家务必准时参加。<br>里面的新冠状蝙蝠汤真的非常的美味！'
          },
          {
            time: '2020-03-01',
            nickname: '蝙蝠侠',
            event: '2020年5月1日，为庆祝公司销量破1000亿，打算在大灶头农家山庄举办公司年会，请大家务必准时参加。<br>里面的新冠状蝙蝠汤真的非常的美味！'
          }
        ],
        tableData: []
      }
    }
  }
</script>

<style lang="scss" scoped>
    .home {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 16px;
        overflow-y: scroll;

        .operation-wrap {
            padding-bottom: 16px;
        }

        .notice-box {
            margin-bottom: 16px;

            &:last-child {
                margin-bottom: 0;
            }

            .event {
                margin: 0;
                font-size: 12px;
                color: rgba(0, 0, 0, .7);
            }

            .time-and-nickname {
                margin: 0;
                font-size: 12px;
                color: rgba(0, 0, 0, .6)
            }
        }
    }
</style>