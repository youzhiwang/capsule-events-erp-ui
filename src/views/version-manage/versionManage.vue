<template>
    <div class="version-manage">
        <div class="operation-wrap">
            <el-button type="primary" @click="$message.info('该功能正在开发中')">需求申请</el-button>
            <el-button type="primary" @click="$message.info('该功能正在开发中')">BUG反馈</el-button>
        </div>
        <el-divider class="divider--custom"/>
        <div class="timeline-wrap">
            <p class="title">开发日志</p>
            <el-timeline>
                <el-timeline-item timestamp="Future" placement="top" color="red">
                    <el-card>
                        <h4>feat:</h4>
                        <p>- 首页功能</p>
                        <p>- 用户功能需求反馈</p>
                        <p>- excel 导入与导出</p>
                        <p>- 用户操作日志记录</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2020-02-25" placement="top" color="lightGreen">
                    <el-card>
                        <h4>version: 1.1.2</h4>
                        <p>1、优化了余量查询：在进入余量修改记录历史之后，返回将会保存余量查询之前的状态</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2020-02-25" placement="top">
                    <el-card>
                        <h4>version: 1.1.1</h4>
                        <p>1、修复了一些问题</p>
                        <p>2、增加 ERP 模块</p>
                        <p>3、首页增加一些静态模块</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2020-02-19" placement="top">
                    <el-card>
                        <h4>version: 1.0.1</h4>
                        <p>1、修复了一些样式问题</p>
                        <p>2、修复了错误的文案</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2020-02-19" placement="top">
                    <el-card>
                        <h4>version: 1.0.0</h4>
                        <p>1、品牌管理</p>
                        <p>2、商品管理</p>
                        <p>3、成本管理</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'versionManage'
  }
</script>

<style lang="scss" scoped>
    .version-manage {
        padding: 0 16px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;

        .operation-wrap {
            padding: 16px 0;
        }

        .divider--custom {
            margin: 0;
        }

        .timeline-wrap {
            padding: 16px 40px 16px 0;

            .title {
                margin: 0 0 16px 0;
                padding-left: 40px;
                color: rgba(0, 0, 0, .7);
            }
        }
    }
</style>