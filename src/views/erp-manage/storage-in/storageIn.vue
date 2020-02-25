<style lang="scss" scoped src="./style/index.scss"/>

<template>
    <div class="storage-in">
        <div class="filter-wrap">
            <el-form ref="FilterForm" :model="filterForm" label-width="80px">
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
                            <el-select v-model="filterForm.commodityId" filterable placeholder="请选择商品名称"
                                       style="width: 100%;">
                                <el-option v-for="item in filterFormCommodityOptions" :key="item.id"
                                           :label="item.commodity_name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作用户" prop="userId">
                            <el-select v-model="filterForm.userId" placeholder="请选择操作用户" style="width: 100%;">
                                <el-option v-for="item in usersOptions" :key="item.id" :label="item.nickname"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="入库时间" prop="storageInTime">
                            <el-date-picker v-model="filterForm.storageInTime" value-format="yyyy-MM-dd"
                                            placeholder="请选择入库时间" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="12" style="text-align: right;">
                        <el-button type="primary" @click="handleSearch">搜 索</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider class="divider--custom"/>
        <div class="operation-wrap">
            <el-button type="primary" @click="addDialogVisible = true">入 库</el-button>
            <el-button @click="$message.info('导出功能正在开发中')">导 出</el-button>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column type="expand">
                    <template #default="{row}">
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <p>
                                    <span>备注: </span>
                                    <span>{{ row.remark }}</span>
                                </p>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" :index="indexMethod"/>
                <el-table-column label="品牌" prop="brand_name"/>
                <el-table-column label="子类" prop="subclass_name"/>
                <el-table-column label="商品" prop="commodity_name"/>
                <el-table-column label="入库数量" prop="storage_in_number"/>
                <el-table-column label="入库时间" prop="storage_in_time">
                    <template #default="{row}">
                        <span>{{ row.storage_in_time | timeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作用户" prop="operation_username"/>
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

        <el-dialog title="入库操作"
                   :visible.sync="addDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleAddCancel">
            <el-form ref="AddForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="品牌" prop="brandId">
                    <el-select v-model="addForm.brandId" filterable placeholder="请选择品牌" style="width: 100%;">
                        <el-option v-for="item in brandOptions" :key="item.id" :label="item.brand_name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="子类" prop="subclassId">
                    <el-select v-model="addForm.subclassId" filterable placeholder="请选择子类" style="width: 100%;">
                        <el-option v-for="item in addFormSubclassOptions" :key="item.id" :label="item.subclass_name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品" prop="commodityId">
                    <el-select v-model="addForm.commodityId" filterable placeholder="请选择商品" style="width: 100%;">
                        <el-option v-for="item in addFormCommodityOptions" :key="item.id" :label="item.commodity_name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库数量" prop="storageInNumber">
                    <el-input v-model="addForm.storageInNumber" placeholder="请输入入库数量" type="number"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
            <el-alert title="入库操作无法撤销，请仔细核对！" type="error" :closable="false"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleAddCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import mixin from '../../../mixins/index'

  export default {
    name: 'storageIn',
    data() {
      return {
        brandOptions: [],
        usersOptions: [],
        filterForm: {
          brandId: '',
          subclassId: '',
          commodityId: '',
          userId: '',
          storageInTime: ''
        },
        filterFormSubclassOptions: [],
        filterFormCommodityOptions: [],
        tableData: [],
        paginationConfig: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
        addDialogVisible: false,
        addForm: {
          brandId: '',
          subclassId: '',
          commodityId: '',
          storageInNumber: '',
          remark: ''
        },
        addRules: {
          brandId: [
            {required: true, trigger: 'change', message: '请选择品牌'}
          ],
          subclassId: [
            {required: true, trigger: 'change', message: '请选择子类'}
          ],
          commodityId: [
            {required: true, trigger: 'change', message: '请选择商品'}
          ],
          storageInNumber: [
            {required: true, trigger: 'blur', message: '请输入入库数量'},
            {validator: this.noNegativeIntegerValidator, trigger: 'blur'}
          ]
        },
        addFormSubclassOptions: [],
        addFormCommodityOptions: []
      }
    },
    watch: {
      'addForm.brandId'(newValue) {
        // 先清除子类和商品
        this.addForm.subclassId = ''
        this.addForm.commodityId = ''
        this.$nextTick(() => {
          // 获取子类
          if (newValue !== '') {
            this.axios.get('/api/subclass-dic', {
              params: {brandId: newValue}
            }).then(res => {
              res = res.data
              if (res.code === 'success') this.addFormSubclassOptions = res.data
              else this.$message.error('获取子类失败')
            })
          }
        })
      },
      'addForm.subclassId'(newValue) {
        // 先清商品
        this.addForm.commodityId = ''
        this.$nextTick(() => {
          this.$nextTick(() => {
            // 获取商品
            if (newValue !== '') {
              this.axios.get('/api/commodity-dic', {
                params: {
                  brandId: this.addForm.brandId,
                  subclassId: newValue
                }
              }).then(res => {
                res = res.data
                if (res.code === 'success') this.addFormCommodityOptions = res.data
                else this.$message.error('获取商品失败')
              })
            }
          })
        })
      },
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
      indexMethod(index) {
        return (this.paginationConfig.pageNum - 1) * this.paginationConfig.pageSize + index + 1
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
      getBrandOptions() {
        this.axios.get('/api/brand-dic').then(res => {
          res = res.data
          if (res.code === 'success') this.brandOptions = res.data
          else this.$message.error('获取品牌选项失败')
        })
      },
      getUsersOptions() {
        this.axios.get('/api/users-dic').then(res => {
          res = res.data
          if (res.code === 'success') this.usersOptions = res.data
          else this.$message.error('获取用户选项失败')
        })
      },
      handleAddCancel() {
        this.$refs.AddForm.resetFields()
        this.addDialogVisible = false
      },
      handleAddConfirm() {
        this.$refs.AddForm.validate(v => {
          if (v) {
            this.axios.post('/api/storage-in', this.addForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.handleAddCancel()
                this.getTableData()
                this.$message.success('添加入库记录成功')
              } else this.$message.error(res.message)
            })
          }
        })
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
      getTableData() {
        const params = Object.assign(this.filterForm, this.paginationConfig)
        this.axios.get('/api/storage-in', {
          params
        }).then(res => {
          res = res.data
          if (res.code === 'success') {
            this.tableData = res.data.list
            this.total = res.data.total
          }
        })
      }
    },
    created() {
      this.getBrandOptions()
      this.getUsersOptions()
      this.getTableData()
    }
  }
</script>