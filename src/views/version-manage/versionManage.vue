<template>
    <div class="version-manage">
        <el-timeline>
            <el-timeline-item timestamp="future" placement="top">
                <el-card>
                    <h4>feat:</h4>
                    <p>1、首页功能</p>
                    <p>2、进销存管理</p>
                    <p>3、用户功能需求反馈</p>
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
</template>

<script>
  export default {
    name: 'versionManage'
  }
</script>

<style lang="scss" scoped>
    .version-manage{
        padding: 16px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
    }
</style>