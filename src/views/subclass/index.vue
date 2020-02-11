<template>
    <div class="subclass">
        <div class="operation-wrap">
            <el-button icon="el-icon-back" @click="handleBack"/>
            <el-button type="primary" @click="dialogVisible = true">新增子类</el-button>
            <span class="brand-name">当前品牌：{{ brandName }}</span>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column label="序号" type="index" :index="indexMethod"/>
                <el-table-column label="名称" prop="subclass_name"/>
                <el-table-column label="备注" prop="remark"/>
                <el-table-column label="操作" width="200px">
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

        <el-dialog title="新增子类"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleCancel">
            <el-form ref="Form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="子类名称" prop="subclassName">
                    <el-input v-model="form.subclassName" placeholder="请输入品牌名称"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑子类"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item label="子类名称" prop="subclassName">
                    <el-input v-model="editForm.subclassName" placeholder="请输入品牌名称"/>
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
    name: 'subclass',
    data() {
      return {
        // 品牌id
        id: '',
        // 品牌名称
        brandName: '',
        tableData: [],
        paginationConfig: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
        dialogVisible: false,
        form: {
          subclassName: '',
          remark: ''
        },
        rules: {
          subclassName: [
            {required: true, trigger: 'blur', message: '请输入子类名称'},
            {max: 100, trigger: 'blur', message: '最大长度为100'}
          ],
          remark: [
            {max: 200, trigger: 'blur', message: '最大长度为200'}
          ]
        },
        editDialogVisible: false,
        editForm: {
          id: '',
          subclassName: '',
          remark: ''
        },
      }
    },
    methods: {
      handleBack() {
        this.$router.back()
      },
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
      getTableData() {
        this.axios.get(`/api/subclass-list/${this.id}`, {
          params: this.paginationConfig
        }).then(res => {
          res = res.data
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      handleCancel() {
        this.$refs.Form.resetFields()
        this.dialogVisible = false
      },
      handleConfirm() {
        this.$refs.Form.validate(v => {
          if (v) {
            const params = Object.assign({}, this.form)
            params.brandId = this.id
            this.axios.post('/api/subclass', params).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('添加成功')
                this.handleCancel()
                this.getTableData()
              } else this.$message.error(res.message)
            })
          }
        })
      },
      handleEdit(row) {
        this.editForm.id = row.id
        this.editForm.subclassName = row.subclass_name
        this.editForm.remark = row.remark
        this.editDialogVisible = true
      },
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            const params = Object.assign({}, this.editForm)
            params.brandId = this.id
            this.axios.put('/api/subclass', params).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('修改成功')
                this.handleEditCancel()
                this.getTableData()
              } else this.$message.error(res.message)
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm(`是否删除子类「${row.subclass_name}」`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/subclass/${row.id}`).then(res => {
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
      this.id = this.$route.params.id
      this.brandName = this.$route.params.brandName
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
    .subclass {
        width: 100%;
        height: 100%;
        padding: 0 16px;
        box-sizing: border-box;

        .operation-wrap {
            padding: 14px 0;

            .brand-name {
                font-size: 12px;
                padding: 0 16px;
                color: rgba(0, 0, 0, .8)
            }
        }

        .table-wrap {
            height: calc(100% - 60px - 32px);
        }

        .pagination-wrap {
            text-align: right;
        }
    }
</style>