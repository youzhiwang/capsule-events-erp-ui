<template>
    <div class="brand-manage">
        <div class="operation-wrap">
            <el-button type="primary" @click="dialogVisible = true">新增品牌</el-button>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" border stripe height="100%">
                <el-table-column type="index" label="序号" :index="indexMethod"/>
                <el-table-column label="品牌名称" prop="brand_name"/>
                <el-table-column label="品牌类型">
                    <template #default="{row}">
                        <span>
                            <i v-if="row.brand_type === 1" class="el-icon-s-flag"/>
                            <i v-if="row.brand_type === 2" class="el-icon-s-opportunity"/>
                            {{ row.brand_type | brandType  }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template #default="{row}">
                        <el-button type="text" @click="handleCheckSubclass(row)">查看子类</el-button>
                        <el-button type="text" @click="handleEditBrand(row)">编辑</el-button>
                        <el-button type="text" @click="handleDeleteBrand(row)">删除</el-button>
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

        <el-dialog title="新增品牌"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleCancel">
            <el-form ref="Form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="form.brandName" placeholder="请输入品牌名称"/>
                </el-form-item>
                <el-form-item label="品牌类型" prop="brandType">
                    <el-select v-model="form.brandType" placeholder="请选择品牌类型" style="width: 100%;">
                        <el-option v-for="(item, index) in brandTypeOptions" :key="index" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑品牌"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="editForm.brandName" placeholder="请输入品牌名称"/>
                </el-form-item>
                <el-form-item label="品牌类型" prop="brandType">
                    <el-select v-model="editForm.brandType" placeholder="请选择品牌类型" style="width: 100%;">
                        <el-option v-for="(item, index) in brandTypeOptions" :key="index" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
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
    name: 'brandManage',
    data() {
      return {
        tableData: [],
        paginationConfig: {
          pageNum: 1,
          pageSize: 10
        },
        pageSizes: [10, 20, 30, 40, 50],
        total: 0,
        dialogVisible: false,
        form: {
          brandName: '',
          brandType: ''
        },
        brandTypeOptions: [
          {label: '自有', value: 1},
          {label: '合作', value: 2}
        ],
        rules: {
          brandName: [
            {required: true, trigger: 'blur', message: '请输入品牌名称'},
            {max: 100, trigger: blur, message: '最长100个字符'}
          ],
          brandType: [
            {required: true, trigger: 'change', message: '请选择品牌类型'}
          ]
        },
        editDialogVisible: false,
        editForm: {
          id: '',
          brandName: '',
          brandType: ''
        }
      }
    },
    methods: {
      indexMethod(index) {
        return (this.paginationConfig.pageNum - 1) * this.paginationConfig.pageSize + index + 1
      },
      getTableData() {
        this.axios.get('/api/brand-list', {
          params: this.paginationConfig
        }).then(res => {
          res = res.data
          this.tableData = res.data.list
          this.total = res.data.total
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
      handleCancel() {
        this.$refs.Form.resetFields()
        this.dialogVisible = false
      },
      handleConfirm() {
        this.$refs.Form.validate(v => {
          if (v) {
            this.axios.post('/api/brand', this.form).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.getTableData()
                this.handleCancel()
                this.$message.success('添加品牌成功')
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      handleEditBrand(row) {
        this.editForm.id = row.id
        this.editForm.brandName = row.brand_name
        this.editForm.brandType = row.brand_type
        this.editDialogVisible = true
      },
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            this.axios.put('/api/brand', this.editForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.getTableData()
                this.handleEditCancel()
                this.$message.success('编辑品牌成功')
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      handleDeleteBrand(row) {
        this.$confirm(`是否删除品牌「${row.brand_name}」`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/brand/${row.id}`).then(res => {
            res = res.data
            if (res.code === 'success') {
              this.$message.success('删除成功')
              this.getTableData()
            }
          })
        })
      },
      handleCheckSubclass(row) {
        this.$router.push({name: 'subclass', params: {id: row.id, brandName: row.brand_name}})
      }
    },
    filters: {
      brandType(val) {
        switch (val) {
          case 1:
            return '自有'
          case 2:
            return '合作'
          default:
            return '未知'
        }
      }
    },
    created() {
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
    .brand-manage {
        width: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;

        .operation-wrap {
            box-sizing: border-box;
            padding: 16px 0;
        }

        .table-wrap {
            height: calc(100% - 64px - 32px);
        }

        .pagination-wrap {
            text-align: right;
        }
    }
</style>