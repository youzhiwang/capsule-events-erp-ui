<template>
    <div class="cost-manage">
        <div class="filter-wrap">
            <el-form ref="FilterForm" :model="filterForm" label-width="80px" @submit.native.prevent>
                <el-row :gutter="24">
                    <el-col :span="6">
                        <el-form-item label="采购商品" prop="purchaseGoods">
                            <el-input v-model="filterForm.purchaseGoods"
                                      placeholder="请输入采购商品名称"
                                      @keyup.enter.native="handleSearch"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="handleSearch">搜 索</el-button>
                        <el-button @click="handleReset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <hr>
        <div class="operation-wrap">
            <el-button type="primary" @click="addDialogVisible = true">新增采购</el-button>
            <el-button @click="$message.info('导出功能正在开发中')">导 出</el-button>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column type="expand">
                    <template #default="{row}">
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <p>
                                    <span>联系地址: </span>
                                    <span>{{ row.contact_address }}</span>
                                </p>
                            </el-col>
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
                <el-table-column label="采购商品" prop="purchase_goods"/>
                <el-table-column label="采购价格" prop="purchase_price"/>
                <el-table-column label="单位" prop="unit"/>
                <el-table-column label="采购时间" prop="purchase_time"/>
                <el-table-column label="联系人" prop="contact_person"/>
                <el-table-column label="联系电话" prop="contact_phone"/>
                <el-table-column label="操作" width="100px">
                    <template #default="{row}">
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

        <el-dialog title="新增采购"
                   :visible.sync="addDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleAddCancel">
            <el-form ref="AddForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="采购商品" prop="purchaseGoods">
                    <el-input v-model="addForm.purchaseGoods" placeholder="请输入采购商品"/>
                </el-form-item>
                <el-form-item label="采购价格" prop="purchasePrice">
                    <el-input v-model="addForm.purchasePrice" type="number" placeholder="请输入价格商品，最多保留2位小数"/>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="addForm.unit" placeholder="请输入单位"/>
                </el-form-item>
                <el-form-item label="采购时间" prop="purchaseTime">
                    <el-date-picker v-model="addForm.purchaseTime" value-format="yyyy-MM-dd" placeholder="请选择采购时间"
                                    style="width: 100%;"/>
                </el-form-item>
                <el-form-item label="联系人" prop="contactPerson">
                    <el-input v-model="addForm.contactPerson" placeholder="请输入联系人"/>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                    <el-input v-model="addForm.contactPhone" placeholder="请输入联系电话"/>
                </el-form-item>
                <el-form-item label="联系地址" prop="contactAddress">
                    <el-input v-model="addForm.contactAddress" placeholder="请输入联系地址"/>
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

        <el-dialog title="编辑采购"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="addRules" label-width="80px">
                <el-form-item label="采购商品" prop="purchaseGoods">
                    <el-input v-model="editForm.purchaseGoods" disabled placeholder="请输入采购商品"/>
                </el-form-item>
                <el-form-item label="采购价格" prop="purchasePrice">
                    <el-input v-model="editForm.purchasePrice" type="number" placeholder="请输入价格商品，最多保留2位小数"/>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="editForm.unit" placeholder="请输入单位"/>
                </el-form-item>
                <el-form-item label="采购时间" prop="purchaseTime">
                    <el-date-picker v-model="editForm.purchaseTime" value-format="yyyy-MM-dd" placeholder="请选择采购时间"
                                    style="width: 100%;"/>
                </el-form-item>
                <el-form-item label="联系人" prop="contactPerson">
                    <el-input v-model="editForm.contactPerson" placeholder="请输入联系人"/>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                    <el-input v-model="editForm.contactPhone" placeholder="请输入联系电话"/>
                </el-form-item>
                <el-form-item label="联系地址" prop="contactAddress">
                    <el-input v-model="editForm.contactAddress" placeholder="请输入联系地址"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark" type="textarea" placeholder="请输入备注"/>
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
  export default {
    name: 'costManage',
    data() {
      return {
        filterForm: {
          purchaseGoods: ''
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
          purchaseGoods: '',
          purchasePrice: '',
          unit: '',
          purchaseTime: '',
          contactPerson: '',
          contactPhone: '',
          contactAddress: '',
          remark: ''
        },
        addRules: {
          purchaseGoods: [
            {required: true, trigger: 'blur', message: '请输入采购商品'},
            {max: 100, trigger: 'blur', message: '长度最大为100个字符'}
          ],
          purchasePrice: [
            {required: true, trigger: 'blur', message: '请输入价格商品，最多保留2位小数'}
          ],
          unit: [
            {required: true, trigger: 'blur', message: '请输入单位'},
            {max: 100, trigger: 'blur', message: '长度最大为100个字符'}
          ],
          purchaseTime: [
            {required: true, trigger: 'blur', message: '请选择采购时间'}
          ],
          contactPerson: [
            {max: 100, trigger: 'blur', message: '长度最大为100个字符'}
          ],
          contactPhone: [
            {max: 100, trigger: 'blur', message: '长度最大为100个字符'}
          ],
          contactAddress: [
            {max: 100, trigger: 'blur', message: '长度最大为100个字符'}
          ],
          remark: [
            {max: 200, trigger: 'blur', message: '长度最大为200个字符'}
          ]
        },
        editDialogVisible: false,
        editForm: {
          id: '',
          purchaseGoods: '',
          purchasePrice: '',
          unit: '',
          purchaseTime: '',
          contactPerson: '',
          contactPhone: '',
          contactAddress: '',
          remark: ''
        },
      }
    },
    methods: {
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
      handleAddCancel() {
        this.$refs.AddForm.resetFields()
        this.addDialogVisible = false
      },
      handleAddConfirm() {
        this.$refs.AddForm.validate(v => {
          if (v) {
            this.axios.post('/api/cost', this.addForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.handleAddCancel()
                this.getTableData()
                this.$message.success('添加成功')
              } else this.$message.error(res.message)
            })
          }
        })
      },
      getTableData() {
        this.axios.get('/api/cost-list', {
          params: Object.assign(this.filterForm, this.paginationConfig)
        }).then(res => {
          res = res.data
          if (res.code === 'success') {
            this.tableData = res.data.list
            this.total = res.data.total
          }
        })
      },
      handleSearch() {
        this.paginationConfig.pageNum = 1
        this.getTableData()
      },
      handleReset() {
        this.paginationConfig.pageNum = 1
        this.$refs.FilterForm.resetFields()
        this.getTableData()
      },
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            this.axios.put('/api/cost', this.editForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.handleEditCancel()
                this.getTableData()
                this.$message.success('编辑成功')
              } else this.$message.error(res.message)
            })
          }
        })
      },
      handleEdit(row) {
        this.editForm.id = row.id
        this.editForm.purchaseGoods = row.purchase_goods
        this.editForm.purchasePrice = row.purchase_price
        this.editForm.unit = row.unit
        this.editForm.purchaseTime = row.purchase_time
        this.editForm.contactPerson = row.contact_person
        this.editForm.contactPhone = row.contact_phone
        this.editForm.contactAddress = row.contact_address
        this.editForm.remark = row.remark
        this.editDialogVisible = true
      },
      handleDelete(row) {
        this.$confirm(`是否删除采购商品「${row.purchase_goods}」`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/cost/${row.id}`).then(res => {
            res = res.data
            if (res.code === 'success') {
              this.$message.success('删除成功')
              this.getTableData()
            }
          })
        })
      }
    },
    created() {
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
    .cost-manage {
        width: 100%;
        height: 100%;
        padding: 0 16px;
        box-sizing: border-box;

        .filter-wrap {
            padding-top: 18px;
        }

        hr {
            margin: 0;
        }

        .operation-wrap {
            padding: 16px 0;
        }

        .table-wrap {
            height: calc(100% - 68px - 2px - 64px - 32px);
        }

        .pagination-wrap {
            text-align: right;
        }
    }
</style>