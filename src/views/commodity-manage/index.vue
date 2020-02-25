<template>
    <div class="commodity-manage">
        <div class="filter-wrap">
            <el-form ref="FilterForm" :model="filterForm" label-width="80px">
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="品牌过滤" prop="brandId">
                            <el-select v-model="filterForm.brandId" filterable placeholder="请选择品牌" style="width: 100%;">
                                <el-option v-for="(item, index) in brandOptions" :key="index" :label="item.brand_name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="子类过滤" prop="subclassId">
                            <el-select v-model="filterForm.subclassId" filterable placeholder="请选择子类"
                                       style="width: 100%;">
                                <el-option v-for="(item, index) in subclassOptions" :key="index"
                                           :label="item.subclass_name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品名称" prop="commodityName">
                            <el-input v-model="filterForm.commodityName" placeholder="请输入商品名称"/>
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
            <el-button type="primary" @click="addDialogVisible = true">新增商品</el-button>
            <el-button @click="$message.info('导出功能正在开发中')">导 出</el-button>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column type="expand">
                    <template #default="{row}">
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <p>
                                    <span>尺寸(mm): </span>
                                    <span>{{ row.size === '' ? '-' : row.size }}</span>
                                </p>
                            </el-col>
                            <el-col :span="24">
                                <p>
                                    <span>备注: </span>
                                    <span>{{ row.remark === '' ? '-' : row.remark }}</span>
                                </p>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" :index="indexMethod"/>
                <el-table-column label="品牌" prop="brand_name"/>
                <el-table-column label="子类" prop="subclass_name"/>
                <el-table-column label="商品名称" prop="commodity_name"/>
                <el-table-column label="商品别称" prop="commodity_nickname"/>
                <el-table-column label="总成本(¥)" prop="cost">
                    <template #default="{row}">
                        <span>{{ row.cost === 0 ? '-' : row.cost.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="页面价(¥)" prop="price">
                    <template #default="{row}">
                        <span>{{ row.price === 0 ? '-' : row.price.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template #default="{row}">
                        <el-button type="text" @click="handleActivityPrice(row)">活动价</el-button>
                        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(row)">删除</el-button>
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

        <el-dialog title="新增商品"
                   :visible.sync="addDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleAddCancel">
            <el-form ref="AddForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="品牌" prop="brandId">
                    <el-select v-model="addForm.brandId" filterable placeholder="请选择品牌" style="width: 100%;">
                        <el-option v-for="(item, index) in brandOptions" :key="index" :label="item.brand_name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="子类" prop="subclassId">
                    <el-select v-model="addForm.subclassId" filterable placeholder="请选择子类" style="width: 100%;">
                        <el-option v-for="(item, index) in addFormSubclassOptions" :key="index"
                                   :label="item.subclass_name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="commodityName">
                    <el-input v-model="addForm.commodityName" placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="商品别称" prop="commodityNickname">
                    <el-input v-model="addForm.commodityNickname" placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="总成本" prop="cost">
                    <el-input v-model="addForm.cost" type="number" placeholder="请输入总成本，保留2位小数">
                        <template slot="append">¥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="页面价" prop="price">
                    <el-input v-model="addForm.price" type="number" placeholder="请输入页面价，保留2位小数">
                        <template slot="append">¥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="尺寸" prop="price">
                    <el-input v-model="addForm.size" placeholder="请输入尺寸">
                        <template slot="append">mm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleAddCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑商品"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="addRules" label-width="80px">
                <el-form-item label="品牌" prop="brandId">
                    <el-select v-model="editForm.brandId" placeholder="请选择品牌" disabled style="width: 100%;">
                        <el-option v-for="(item, index) in brandOptions" :key="index" :label="item.brand_name"
                                   :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="子类" prop="subclassId">
                    <el-select v-model="editForm.subclassId" placeholder="请选择子类" disabled style="width: 100%;">
                        <el-option v-for="(item, index) in addFormSubclassOptions" :key="index"
                                   :label="item.subclass_name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="commodityName">
                    <el-input v-model="editForm.commodityName" disabled placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="商品别称" prop="commodityNickname">
                    <el-input v-model="editForm.form.commodityNickname" placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="总成本" prop="cost">
                    <el-input v-model="editForm.form.cost" type="number" placeholder="请输入总成本，保留2位小数">
                        <template slot="append">¥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="页面价" prop="price">
                    <el-input v-model="editForm.form.price" type="number" placeholder="请输入页面价，保留2位小数">
                        <template slot="append">¥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="尺寸" prop="size">
                    <el-input v-model="editForm.form.size" placeholder="请输入尺寸">
                        <template slot="append">mm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.form.remark" type="textarea" placeholder="请输入备注"/>
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
  import mixin from '../../mixins/index'

  export default {
    name: 'commodityManage',
    data() {
      return {
        brandOptions: [],
        subclassOptions: [],
        filterForm: {
          brandId: '',
          subclassId: '',
          commodityName: ''
        },
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
          brandName: '',
          subclassId: '',
          subclassName: '',
          commodityName: '',
          commodityNickname: '',
          cost: 0.00,
          price: 0.00,
          size: '',
          remark: ''
        },
        addRules: {
          brandId: [
            {required: true, trigger: 'change', message: '请选择品牌'}
          ],
          subclassId: [
            {required: true, trigger: 'change', message: '请选择子类'}
          ],
          commodityName: [
            {required: true, trigger: 'blur', message: '请输入商品名称'},
            {max: 100, trigger: 'blur', message: '最长100个字符'}
          ],
          cost: [
            {validator: this.priceValidator, trigger: 'blur'}
          ],
          price: [
            {validator: this.priceValidator, trigger: 'blur'}
          ]
        },
        addFormSubclassOptions: [],
        editDialogVisible: false,
        editForm: {
          brandId: '',
          subclassId: '',
          commodityName: '',
          form: {
            id: '',
            commodityNickname: '',
            cost: 0.00,
            price: 0.00,
            size: '',
            remark: ''
          }
        }
      }
    },
    watch: {
      'filterForm.brandId': {
        handler(newVal) {
          if (newVal === '') return
          this.subclassOptions = []
          this.filterForm.subclassId = ''

          this.$nextTick(() => {
            this.axios.get('/api/subclass-dic', {
              params: {brandId: newVal}
            }).then(res => {
              res = res.data
              if (res.code === 'success') this.subclassOptions = res.data
              else this.$message.error('获取子类失败')
            })
          })
        }
      },
      'addForm.brandId': {
        handler(newVal) {
          if (newVal === '') return
          const brandOption = this.brandOptions.find((item) => item.id === newVal)
          this.addForm.brandName = brandOption.brand_name

          this.addFormSubclassOptions = []
          this.addForm.subclassId = ''
          this.addForm.subclassName = ''

          this.$nextTick(() => {
            this.axios.get('/api/subclass-dic', {
              params: {brandId: newVal}
            }).then(res => {
              res = res.data
              if (res.code === 'success') this.addFormSubclassOptions = res.data
              else this.$message.error('获取新增表单子类失败')
            })
          })
        }
      },
      'addForm.subclassId': {
        handler(newVal) {
          if (newVal === '') return
          const subclassOption = this.addFormSubclassOptions.find((item) => item.id === newVal)
          this.addForm.subclassName = subclassOption.subclass_name
        }
      }
    },
    mixins: [mixin],
    methods: {
      indexMethod(index) {
        return (this.paginationConfig.pageNum - 1) * this.paginationConfig.pageSize + index + 1
      },
      getBrandList() {
        this.axios.get('/api/brand-dic').then(res => {
          res = res.data
          if (res.code === 'success') this.brandOptions = res.data
          else this.$message.error('品牌选项获取失败')
        })
      },
      getTableData() {
        this.axios.get('/api/commodity-list', {
          params: Object.assign(this.filterForm, this.paginationConfig)
        }).then(res => {
          res = res.data
          if (res.code === 'success') {
            this.tableData = res.data.list
            this.total = res.data.total
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
      handleAddCancel() {
        this.$refs.AddForm.resetFields()
        this.addForm.brandName = ''
        this.addForm.subclassName = ''
        this.addDialogVisible = false
      },
      handleAddConfirm() {
        this.$refs.AddForm.validate(v => {
          if (v) {
            this.axios.post('/api/commodity', this.addForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('新增商品成功')
                this.handleAddCancel()
                this.getTableData()
              } else this.$message.error('新增商品失败')
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
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            this.axios.put('/api/commodity', this.editForm.form).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.handleEditCancel()
                this.getTableData()
                this.$message.success('修改成功')
              }
            })
          }
        })
      },
      handleEdit(row) {
        this.editDialogVisible = true
        this.editForm.brandId = row.brand_id
        this.editForm.subclassId = row.subclass_id
        this.editForm.commodityName = row.commodity_name

        this.editForm.form.id = row.id
        this.editForm.form.commodityNickname = row.commodity_nickname
        this.editForm.form.cost = row.cost
        this.editForm.form.price = row.price
        this.editForm.form.size = row.size
        this.editForm.form.remark = row.remark
      },
      handleDelete(row) {
        this.$confirm(`是否删除商品「${row.commodity_name}」`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/commodity/${row.id}`).then(res => {
            res = res.data
            if (res.code === 'success') {
              this.$message.success('删除成功')
              this.getTableData()
            }
          })
        })
      },
      handleActivityPrice(row) {
        this.$router.push({
          name: 'activityPrice',
          params: {
            commodityId: row.id,
            commodityName: row.commodity_name
          }
        })
      }
    },
    created() {
      this.getBrandList()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
    .commodity-manage {
        padding: 0 16px;
        box-sizing: border-box;
        height: 100%;
        width: 100%;

        .filter-wrap {
            padding-top: 16px;
        }

        .divider--custom {
            margin: 0;
        }

        .operation-wrap {
            padding: 16px 0;
        }

        .table-wrap {
            height: calc(100% - 66px - 1px - 64px - 32px);
        }

        .pagination-wrap {
            text-align: right;
        }
    }
</style>