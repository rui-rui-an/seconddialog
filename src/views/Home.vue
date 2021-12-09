<template>
  <div class="home">
    <!--  -->
    <el-button @click="openDialog">点我打开基本封装的弹出框</el-button>
    <ConfirmPop
      :show="confirmShow"
      confirmContent="还有尚未报送的问题台账，请确认是否继续报送?"
      :loading="loading"
      :dateTime.sync="dateTime"
      :showDate="true"
      @updateVisible="updateVisible"
      @cancelSend="cancelSend"
      @confirmSend="confirmSend"
    ></ConfirmPop>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data () {
    return {
      confirmShow: false,
      loading: false,
      dateTime:''
    }
  },
  name: 'Home',
  components: {},
  methods: {
    openDialog () {
      this.confirmShow = true
    },
    cancelSend () {
      console.log('取消')
      this.confirmShow = false
    },
    confirmSend () {
      console.log('queren')
      this.loading = true
      setTimeout(()=>{
        this.loading = false
        this.confirmShow = false
      },1000)
      
    },
    updateVisible (val) {
      this.confirmShow = val
    }
  }
}
</script>
