<template>
    <div class="activity-price">
        <div class="operation-wrap">
            <el-button icon="el-icon-back" @click="handleBack"/>
            <el-button type="primary" @click="dialogVisible = true">新增活动价</el-button>
            <el-button @click="$message.info('报表正在开发中')">历史活动价曲线</el-button>
            <span class="commodity-name">当前商品：{{ commodityName }}</span>
        </div>
        <div class="table-wrap">
            <el-table :data="tableData" stripe border height="100%">
                <el-table-column type="expand">
                    <template #default="{row}">
                        <el-row :gutter="24">
                            <el-col :span="24">
                                <p>
                                    <span>优惠(¥): </span>
                                    <span>{{ (row.period_price - row.activity_price).toFixed(2) }}</span>
                                </p>
                            </el-col>
                            <el-col :span="24">
                                <p>
                                    <span>利润(¥): </span>
                                    <span>{{ (row.activity_price - row.period_cost).toFixed(2) }}</span>
                                </p>
                            </el-col>
                            <el-col :span="24">
                                <p>
                                    <span>活动创建时间: </span>
                                    <span>{{ row.create_time | timeFormat }}</span>
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
                <el-table-column label="序号" type="index"/>
                <el-table-column label="活动名称" prop="activity_name"/>
                <el-table-column label="活动价(¥)" prop="activity_price"/>
                <el-table-column label="同期成本价(¥)" prop="period_cost"/>
                <el-table-column label="同期页面价(¥)" prop="period_price"/>
                <el-table-column label="优惠幅度(%)" prop="discount_rate">
                    <template #default="{row}">
                        <span>{{ (row.discount_rate * 100).toFixed(2) }}%</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动开始时间" prop="start_time">
                    <template #default="{row}">
                        <span>{{ row.start_time | timeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动结束时间" prop="end_time">
                    <template #default="{row}">
                        <span>{{ row.end_time | timeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template #default="{row}">
                        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="新增活动价格"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleCancel">
            <el-form ref="Form" :model="form" :rules="rules" label-width="110px">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model="form.activityName" placeholder="请输入活动名称"/>
                </el-form-item>
                <el-form-item label="活动价" prop="activityPrice">
                    <el-input v-model="form.activityPrice" type="number" placeholder="请输入活动价，保留2位小数">
                        <template slot="append">
                            <span>¥</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动开始时间" prop="startTime">
                    <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd" placeholder="请选择活动开始时间"
                                    style="width: 100%;"/>
                </el-form-item>
                <el-form-item label="活动结束时间" prop="endTime">
                    <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd" placeholder="请选择活动结束时间"
                                    style="width: 100%;"/>
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

        <el-dialog title="编辑活动价格"
                   :visible.sync="editDialogVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleEditCancel">
            <el-form ref="EditForm" :model="editForm" :rules="rules" label-width="110px">
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model="editForm.activityName" placeholder="请输入活动名称"/>
                </el-form-item>
                <el-form-item label="活动价" prop="activityPrice">
                    <el-input v-model="editForm.activityPrice" type="number" disabled placeholder="请输入活动价，保留2位小数">
                        <template slot="append">
                            <span>¥</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动开始时间" prop="startTime">
                    <el-date-picker v-model="editForm.startTime" value-format="yyyy-MM-dd" placeholder="请选择活动开始时间"
                                    style="width: 100%;"/>
                </el-form-item>
                <el-form-item label="活动结束时间" prop="endTime">
                    <el-date-picker v-model="editForm.endTime" value-format="yyyy-MM-dd" placeholder="请选择活动结束时间"
                                    style="width: 100%;"/>
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
    import mixin from '../../mixins/index'
  export default {
    name: 'activityPrice',
    data() {
      return {
        commodityId: '',
        commodityName: '',
        tableData: [],
        dialogVisible: false,
        form: {
          activityPrice: '',
          activityName: '',
          startTime: '',
          endTime: '',
          remark: ''
        },
        rules: {
          activityPrice: [
            {required: true, trigger: 'blur', message: '请输入活动价'}
          ],
          activityName: [
            {required: true, trigger: 'blur', message: '请输入活动名称'},
            {max: 100, trigger: 'blur', message: '最长字符为100'}
          ],
          startTime: [
            {required: true, trigger: 'change', message: '请选择活动开始时间'}
          ],
          endTime: [
            {required: true, trigger: 'change', message: '请选择活动结束时间'}
          ]
        },
        editDialogVisible: false,
        editForm: {
          activityPrice: '',
          id: '',
          activityName: '',
          startTime: '',
          endTime: '',
          remark: ''
        }
      }
    },
    mixins: [mixin],
    methods: {
      handleBack() {
        this.$router.back()
      },
      getTableData() {
        this.axios.get('/api/activity-price-list-all', {
          params: {
            commodityId: this.commodityId
          }
        }).then(res => {
          res = res.data
          if (res.code === 'success') {
            this.tableData = res.data
          }
        })
      },
      handleCancel() {
        this.$refs.Form.resetFields()
        this.dialogVisible = false
        this.getTableData()
      },
      handleConfirm() {
        this.$refs.Form.validate(v => {
          if (v) {
            const params = Object.assign({
              commodityId: this.commodityId
            }, this.form)
            this.axios.post('/api/activity-price', params).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('添加活动价成功')
                this.handleCancel()
                this.getTableData()
              }
            })
          }
        })
      },
      handleEdit(row) {
        this.editDialogVisible = true
        this.editForm.activityPrice = row.activity_price
        this.editForm.id = row.id
        this.editForm.activityName = row.activity_name
        this.editForm.startTime = row.start_time
        this.editForm.endTime = row.end_time
        this.editForm.remark = row.remark
      },
      handleEditCancel() {
        this.$refs.EditForm.resetFields()
        this.editDialogVisible = false
      },
      handleEditConfirm() {
        this.$refs.EditForm.validate(v => {
          if (v) {
            this.axios.put('/api/activity-price', this.editForm).then(res => {
              res = res.data
              if (res.code === 'success') {
                this.$message.success('活动价修改成功')
                this.handleEditCancel()
                this.getTableData()
              }
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm(`是否删除该活动价「${row.activity_price}」`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/api/activity-price/${row.id}`).then(res => {
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
      this.commodityId = this.$route.params.commodityId
      this.commodityName = this.$route.params.commodityName

      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
    .activity-price {
        width: 100%;
        height: 100%;
        padding: 0 16px;
        box-sizing: border-box;

        .operation-wrap {
            padding: 16px 0;

            .commodity-name {
                font-size: 12px;
                padding: 0 16px;
                color: rgba(0, 0, 0, .8)
            }
        }

        .table-wrap {
            height: calc(100% - 64px - 16px);
        }
    }
</style>