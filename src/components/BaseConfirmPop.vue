<template>
  <div class="ConfirmPop">
    <el-dialog :visible="visible" top="25vh" @close="colseDialog" custom-class="confirm">
      <template v-slot:title>
        <div class="title">
          <i class="el-icon-warning-outline" /><span>请确认</span>
        </div>
      </template>
      <div class="modal-content-demo">
        <slot>
          <div class="date_box" v-if="showDate">
            <span class="trackReportEndTime">报送截止日期</span>
            <el-date-picker
              type="date"
              width="400px"
              placeholder="请选择"
              v-model="basicForm.trackReportEndTime"
              @change="dataChange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="question">
            {{ confirmContent }}
          </div>
        </slot>
      </div>
      <template v-slot:footer>
        <div class="footer">
          <el-button @click="cancelSend">取消</el-button>
          <el-button type="primary" :loading="loading" @click="confirmSend"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    confirmContent: {
      type: String,
      default: '确认将报送该项目审计问题整改跟踪台账?'
    },
    dateTime: {
      type: String
    },
    showDate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible: {
      get () {
        return this.show
      },
      set (val) {
        // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 visible的值
        this.$emit('updateVisible', val)
      }
    }
  },
  data () {
    return {
      basicForm: {}
    }
  },
  methods: {
    dataChange (date, type) {
      // console.log(date);
      this.$emit('update:dateTime', date)
    },
    cancelSend () {
      // 如果外面传了cancelSend方法，那么说明父组件需要这个方法，那我们就传出去，不需要的话，就直接关闭dialog
      if(this.$listeners.cancelSend){
        this.$emit('cancelSend')
      }else{
        this.visible = false
      }
    },
    confirmSend () {
      this.$emit('confirmSend')
    },
    colseDialog () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.ConfirmPop {
}
::v-deep .confirm {
  width: 530px;
  height: 330px;
  padding: 80px 60px;
  .el-dialog__header{
    .title{
      text-align: left;
      padding-left: 30px;
      font-size: 16px;
      font-weight: normal;
      i{
        color: #faad14 ;
      }
      span{
        margin-left: 6px;
        color: #606266;
      }
    }
  }
  .el-dialog__body{
    padding: 10px 30px 20px 20px;
    text-align: left;
    padding-left: 50px;
    .date_box{
      margin-bottom: 20px;
      span.trackReportEndTime{
        margin-right: 8px;
      }
    }
  }
}
</style>
