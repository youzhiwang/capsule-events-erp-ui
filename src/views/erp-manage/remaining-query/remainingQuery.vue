<style lang="scss" scoped src="./style/index.scss"/>

<template>
    <div class="remaining-query">
        <div class="filter-wrap">
            <el-form ref="FilterForm" :model="filterForm" :rules="filterFormRules" label-width="80px">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="品牌过滤" prop="brandId">
                            <el-select v-model="filterForm.brandId" filterable placeholder="请选择品牌" style="width: 100%;">
                                <el-option v-for="item in brandOptions" :key="item.id" :label="item.brand_name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="子类过滤" prop="subclassId">
                            <el-select v-model="filterForm.subclassId" filterable placeholder="请选择子类"
                                       style="width: 100%;">
                                <el-option v-for="item in filterFormSubclassOptions" :key="item.id"
                                           :label="item.subclass_name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品" prop="commodityId">
                            <el-select v-model="filterForm.commodityId" filterable placeholder="请选择商品"
                                       style="width: 100%;">
                                <el-option v-for="item in filterFormCommodityOptions" :key="item.id"
                                           :label="item.commodity_name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="handleSearch">搜 索</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider class="divider--custom"/>
        <div class="operation-wrap">
            <el-button type="primary" @click="$message.info('导出功能开发中')">导出所有库存数据</el-button>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column label="品牌" prop="brand_name"/>
                <el-table-column label="子类" prop="subclass_name"/>
                <el-table-column label="商品" prop="commodity_name"/>
                <el-table-column label="库存余量" prop="amount"/>
                <el-table-column label="操作" width="180px">
                    <template #default="{row}">
                        <el-button type="text" @click="handleFixAmount(row)">修改余量</el-button>
                        <el-button type="text" @click="handleChangeLog(row)">余量修改记录</el-button>
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

        <el-dialog title="修改余量"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="editFormRules" label-width="80px">
                <el-form-item label="商品名称" prop="commodityName">
                    <el-input v-model="editForm.commodityName" disabled placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="新的余量" prop="newRemainingNumber">
                    <el-input v-model="editForm.newRemainingNumber" type="number" placeholder="请输入商品余量"/>
                </el-form-item>
                <el-form-item label="修改理由" prop="reason">
                    <el-input v-model="editForm.reason" type="textarea" placeholder="请输入修改理由"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleEditCancel">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import mixin from '../../../mixins/index'
  export default {
    name: 'remainingQuery',
    data() {
      return {
        brandOptions: [],
        filterFormSubclassOptions: [],
        filterFormCommodityOptions: [],
        filterForm: {
          brandId: '',
          subclassId: '',
          commodityId: ''
        },
        filterFormRules: {
          brandId: [
            {required: true, trigger: 'change', message: '请选择品牌'}
          ]
        },
        tableData: [],
        paginationConfig: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
        editDialogVisible: false,
        editForm: {
          commodityId: '',
          commodityName: '',
          newRemainingNumber: '',
          reason: ''
        },
        editFormRules: {
          commodityName: [
            {required: true, trigger: 'blur', message: '请输入品牌'}
          ],
          newRemainingNumber: [
            {required: true, trigger: 'blur', message: '请输入新的余量'},
            {validator: this.noNegativeIntegerValidator, trigger: 'blur'}
          ],
          reason: [
            {required: true, trigger: 'blur', message: '请输入修改理由'}
          ]
        }
      }
    },
    watch: {
      'filterForm.brandId'(newValue) {
        // 先清除子类和商品
        this.filterForm.subclassId = ''
        this.filterForm.commodityId = ''
        this.$nextTick(() => {
          // 获取子类
          if (newValue !== '') {
            this.axios.get('/api/subclass-dic', {
              params: {brandId: newValue}
            }).then(res => {
              res = res.data
              if (res.code === 'success') this.filterFormSubclassOptions = res.data
              else this.$message.error('获取子类失败')
            })
          }
        })
      },
      'filterForm.subclassId'(newValue) {
        // 先清商品
        this.filterForm.commodityId = ''
        this.$nextTick(() => {
          this.$nextTick(() => {
            // 获取商品
            if (newValue !== '') {
              this.axios.get('/api/commodity-dic', {
                params: {
                  brandId: this.filterForm.brandId,
                  subclassId: newValue
                }
              }).then(res => {
                res = res.data
                if (res.code === 'success') this.filterFormCommodityOptions = res.data
                else this.$message.error('获取商品失败')
              })
            }
          })
        })
      }
    },
    mixins: [mixin],
    methods: {
      handleSearch() {
        this.getTableData()
      },
      handleReset() {
        this.tableData = []
        this.$nextTick(() => {
          this.$refs.FilterForm.resetFields()
          this.paginationConfig.pageNum = 1
          this.getTableData()
        })
      },
      getBrandOptions() {
        this.axios.get('/api/brand-dic').then(res => {
          res = res.data
          if (res.code === 'success') this.brandOptions = res.data
          else this.$message.error('获取品牌选项失败')
        })
      },
      handleFixAmount(row) {
        this.editForm.commodityId = row.id
        this.editForm.commodityName = row.commodity_name
        this.editDialogVisible = true
      },
      handleChangeLog(row) {
        const commodityId = row.id
        this.$router.push({
          name: 'remainingChangeLog',
          params: {commodityId}
        })
      },
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
        this.editForm.commodityId = ''
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            this.axios.put('/api/remaining-query', this.editForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('余量修改成功')
                this.handleEditCancel()
                this.getTableData()
              } else this.$message.error(res.message)
            })
          }
        })
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
      getTableData() {
        this.$refs.FilterForm.validate(v => {
          if (v) {
            const params = Object.assign(this.filterForm, this.paginationConfig)
            this.axios.get('/api/remaining-query', {params}).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.tableData = res.data.list
                this.total = res.data.total
              }
            })
          }
        })
      }
    },
    created() {
      this.getBrandOptions()
    }
  }
</script>