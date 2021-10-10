## 教你用v-model二次封装dialog

在项目中，弹框也是一个高度可复用的组件，特别是去基于element-ui来二次封装的dialog。原因大概有以下几点把：1.与UI给的样式不对   2.弹框的内容比较多但是该弹框用到的地方又多  3.便于维护，粘贴复制大家都会，但是，轮到产品经理或者UI调整的时候，就会傻眼了，怎么复制粘贴了这么多地方，改起来不得死啊。所以，如果在项目中多次用到又相似的弹框，我们也可以封装成一个全局组件，使得开发更好的进行下去。



接下来就是我们的二次封装的过程。

首先来看效果图，这里封装的是一个比较简单实用的弹框，首先文字这一块是随时变化的，所以是直接props传值过来的，然后中间的报送截止日期用的是一个插槽，默认是不需要这个报送日期的。

![1633878191058](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1633878191058.png)

封装的代码部分：

```js
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
```

我自己认为其中最精华的部分其实是computed这里，因为其实computed其实默认是只有getter属性的，但是其实我们也可以为其增加set属性来对这个值进行去设置，通过发送事件然后在父组件接收，改变传进来的值来控制dialog的关闭和打开。 另外的话，getter属性就绑定了父组件传进来的值，只要父组件的值改变子组件控制dialog的值就会跟着改变。从而实行了父组件通过一个值来控制dialog子组件关闭打开的效果。

其中还有一个小细节就是cancelSend方法的调用，让我们的父组件，如果不需要这个cancelSend方法，那么就不需要传入了，省的每次都在调用这个组件时需要写cancelSend方法（大部分情况下是不需要的）。

在代码中，我们可以知道这个传进来的show就是去控制里面element的dialog的显示和隐藏的，但是我们应该怎么去做呢，我之前自己写的时候，用的是watch，写的很复杂，大概就是这样子，虽然也能完成封装的这个效果，但是跟这个computed比起来，哈哈哈我的代码实在是太low了。所以，在复习的时候，我又重新封装了一次。

```js
watch: {
    show (newVal) {
      if (newVal) {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    visible (newVal) {
      if (!newVal) {
        if (this.show) {
          // this.show = false
          this.$emit('update:show', false)
        }
      }
    }
  },
```

下面的话，就是在页面中调用的代码，其实还是很简单的，主要就是返回了cancelSend取消的操作和confirmSend确认的操作。 但是的话，大家会不会觉得要传的东西实在太多了，我看了一下，确实是的。怎么可以传这么多，明明还可以用v-model再去把这个精简一下，因为我们可以看到@updateVisible="updateVisible"这个函数根本就没做什么事。

```js
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


```

所以，该精简的还是得去精简一下啊。行吧，先介绍一个v-model。首先的话，v-model是：value和@input事件的语法糖。什么意思呢？就是你父组件在调用子组件的时候，如果你是这样子的，如下js。:value="confirmShow" @input="updateVisible" ,并且updateVisible只做了一件事（就是把接收的值赋给传下去:value的值）

```
<ConfirmPop
      :value="confirmShow"
      @input="updateVisible"
      confirmContent="还有尚未报送的问题台账，请确认是否继续报送?"
      :loading="loading"
      :dateTime.sync="dateTime"
      :showDate="true"
      @cancelSend="cancelSend"
      @confirmSend="confirmSend"
    ></ConfirmPop>
updateVisible(val){
    this.confirmShow = val
}
```

那么，你就可以精简成这样子，：value和@input都不需要了，改成v-model,另外把那个触发的事件也可以删掉

```
<ConfirmPop
      v-model="confirmShow"
      confirmContent="还有尚未报送的问题台账，请确认是否继续报送?"
      :loading="loading"
      :dateTime.sync="dateTime"
      :showDate="true"
      @cancelSend="cancelSend"
      @confirmSend="confirmSend"
    ></ConfirmPop>
```

综上，所以我们封装的代码不就也可以用v-model的方式来写嘛！！！！！！但是还是要稍微改一下地方的，因为我们一开始在子组件中接收的时候是用:show接收的，现在不行了，得使用：value,另外就是，computed中 触发的事件是叫updateVisible，这个不行了，得使用input事件。这两个是硬性要求的。当然，也可以使用model的配置来改事件名和属性名，但这里就不细说了。

上面上最终修改后的代码：

```js
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
    // 这里接收的这里改成了value
    value: {
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
        return this.value
      },
      set (val) {
        // 当visible改变的时候，触发父组件的 input方法，在该方法中更改传入子组件的值
        // 这里触发的事件改成了input
        this.$emit('input', val)
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

```

在页面中使用，大概就是简单多了：

```js
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

```

最后的话，把代码我也贴上，如果有需要封装的朋友可以去看一看，认为有不太好的地方也欢迎大家指出来哈哈哈，我一定会虚心接受学习的。

其中BaseConfirmPop是没用v-model的。

VmodelConfirmPop是使用了v-model之后的。

github地址：https://github.com/rui-rui-an/seconddialog
