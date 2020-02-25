<style lang="scss" scoped src="./style/index.scss"/>

<template>
    <div class="remaining-change-log">
        <div class="filter-wrap">
            <el-form ref="FilterForm" :model="filterForm" label-width="90px">
                <el-row :gutter="24">
                    <el-col :span="1">
                        <el-button icon="el-icon-back" @click="handleBack"/>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作人" prop="userId">
                            <el-select v-model="filterForm.userId" placeholder="请选择操作人" style="width: 100%">
                                <el-option v-for="item in usersOptions" :key="item.id" :label="item.nickname"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="理由关键词" prop="reason">
                            <el-input v-model="filterForm.reason" placeholder="请输入理由关键词"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="handleSearch">搜 索</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column label="序号" type="index" :index="indexMethod"/>
                <el-table-column label="商品名称" prop="commodity_name"/>
                <el-table-column label="修改前余量" prop="old_remaining_number"/>
                <el-table-column label="修改后余量" prop="new_remaining_number"/>
                <el-table-column label="理由" prop="reason" show-overflow-tooltip/>
                <el-table-column label="操作人" prop="operation_nickname"/>
                <el-table-column label="操作时间" prop="operation_time">
                    <template #default="{row}">
                        <span>{{ row.operation_time | timeFormat }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-wrap">
            <el-pagination :current-page="paginationConfig.pageNum"
                           :page-size="paginationConfig.pageSize"
                           :total="total"
                           :page-sizes="pageSizes"
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"/>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'remainingChangeLog',
    data() {
      return {
        commodityId: '',
        usersOptions: [],
        tableData: [],
        paginationConfig: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
        filterForm: {
          userId: '',
          reason: ''
        }
      }
    },
    methods: {
      handleBack() {
        this.$router.back()
      },
      handleSizeChange(pageSize) {
        this.paginationConfig.pageSize = pageSize
        this.paginationConfig.pageNum = 1
        this.getTableData()
      },
      handleCurrentChange(currentPageNum) {
        this.paginationConfig.pageNum = currentPageNum
        this.getTableData()
      },
      indexMethod(index) {
        return (this.paginationConfig.pageNum - 1) * this.paginationConfig.pageSize + index + 1
      },
      handleSearch() {
        this.paginationConfig.pageNum = 1
        this.getTableData()
      },
      handleReset() {
        this.$refs.FilterForm.resetFields()
        this.paginationConfig.pageNum = 1
        this.getTableData()
      },
      getUsersOptions() {
        this.axios.get('/api/users-dic').then(res => {
          res = res.data
          if (res.code === 'success') this.usersOptions = res.data
          else this.$message.error('获取用户选项失败')
        })
      },
      getTableData() {
        const params = Object.assign(this.filterForm, this.paginationConfig)
        params.commodityId = this.commodityId
        this.axios.get('/api/modify-remaining-number-log-list', {params}).then(res => {
          res = res.data
          if (res.code === 'success') {
            this.tableData = res.data.list
            this.total = res.data.total
          } else this.$message.error(res.message)
        })
      }
    },
    filters: {
      timeFormat(val) {
        return moment(val).format('YYYY-MM-DD')
      }
    },
    created() {
      this.commodityId = this.$route.params.commodityId
      this.getUsersOptions()
      this.getTableData()
    }
  }
</script>