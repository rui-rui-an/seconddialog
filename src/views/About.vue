<template>
  <div class="about">
    <!--  -->
    <el-button @click="openDialog">点我打开V-model封装的弹出框</el-button>
    <VmodelConfirmPop
      confirmContent="还有尚未报送的问题台账，请确认是否继续报送?"
      :loading="loading"
      v-model="confirmShow"
      @confirmSend="confirmSend"
    ></VmodelConfirmPop>
  </div>
</template>

<script>
// @ is an alias to /src
// 其实添加.sync属性也可以做到，.sync和v-model都是一样的道理，简化了父组件中写子组件可以在子组件标签上少写一些内容。
// 加入.sync属性，变得原始值也可以在子组件内更改（但是改的方式还是要用$emit，跟v-model的一样）
// 父子组件传值的特性：
// 原始值不可更
// 引用值只要不更改栈的引用，堆可以随意更改。
export default {
  data () {
    return {
      confirmShow: false,
      loading: false,
    }
  },
  name: 'Home',
  components: {},
  methods: {
    openDialog () {
      this.confirmShow = true
    },
    confirmSend () {
      console.log('queren')
      this.loading = true
      setTimeout(()=>{
        this.loading = false
        this.confirmShow = false
      },1000)
      
    }
  }
}
</script>
