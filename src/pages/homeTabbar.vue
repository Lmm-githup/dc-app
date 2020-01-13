<template>
  <div class="main-index" v-show="hidshow">
    <tabbar @on-index-change="handleTab">
      <!-- <tabbar-item v-if="messageTotal > 0" :badge="messageTotal" :selected="currentIndex == 0">
        <i slot="icon" class="fa fa-commenting-o" aria-hidden="true"></i>
        <span slot="label">提醒</span>
      </tabbar-item>
      <tabbar-item v-if="messageTotal == 0" :selected="currentIndex == 0">
        <i slot="icon" class="fa fa-commenting-o" aria-hidden="true"></i>
        <span slot="label">提醒</span>
      </tabbar-item> -->
      <tabbar-item :selected="currentIndex == 0">
        <!-- <i slot="icon" class="fa fa-address-card-o" aria-hidden="true"></i> -->
        <i slot="icon" class="icon iconfont">&#xe636;</i>
        <span slot="label">我的会员</span>
      </tabbar-item>
      <tabbar-item ref='a2' :selected="currentIndex == 1" class="main">
        <!-- <i slot="icon" class="fa fa-th-large mainicon" aria-hidden="true"></i> -->
        <i slot="icon" class="icon iconfont mainicon">{{indexs == 1?"&#xe61d;":"&#xe60e;"}}</i>
        <span slot="label">工作台</span>
        <!--style="postion:relative" style="position:absolute;transform: translate(-50%,-50%);;font-size:1rem;"-->
      </tabbar-item>
      <!-- <tabbar-item :selected="currentIndex == 3">
        <i slot="icon" class="fa fa-bar-chart" aria-hidden="true"></i>
        <span slot="label">统计</span>
      </tabbar-item> -->
      <!-- <tabbar-item :selected="currentIndex == 4">
        <i slot="icon" class="fa fa-user-o" aria-hidden="true"></i>
        <span slot="label">我的</span>
      </tabbar-item> -->
      <tabbar-item :selected="currentIndex == 2">
        <!-- <i slot="icon" class="fa fa-search" aria-hidden="true"></i> -->
        <i slot="icon" class="icon iconfont">&#xe62f;</i>
        <span slot="label">查询会员</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Icon } from "vux";
import { mapState, mapMutations, mapActions } from "vuex";
// import { messageTotal } from "@/api/home";
import {
  MESSAGE_TOTAL,
  CURRENT_INDEX,
  USER_INFO,
  MESSAGE_FLAG
} from "@/utils/storage";
export default {
  name: "homeTabbar",
  components: {
    Tabbar,
    TabbarItem,
    Icon
  },
  data() {
    return {
      currentIndex: 1,
      // messageTotal: "0",
      userInfo: {},
      indexs:1,
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      hidshow:true  //显示或者隐藏footer
    };
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = ()=>{
        return(()=>{
            this.showHeight = document.body.clientHeight;
        })()
    }
  },
  watch: {
    showHeight:function() {
        if(this.docmHeight > this.showHeight){
            this.hidshow=false
        }else{
            this.hidshow=true
        }
    }
  },
  created() {
    this.userInfo = this.$utils.getLocalData(USER_INFO, true);
    // this.queryMessageTotal();
    this.currentIndex = this.$utils.getLocalData(CURRENT_INDEX) || 1;
  },
  methods: {
    // ...mapActions(["QUERY_MSG"]),
    handleTab(i) {
      this.indexs = i;
      this.$refs['a2'].$el.children[0].style.backgroundColor= i == 1?'#FFB94E':'#fff';
      // this.UPDETE_TABBAR_INDEX(i)
      this.$utils.setLocalData(CURRENT_INDEX, i);
      switch (i) {
        // case 0:
        //   this.$router.push({ path: "/Message" });
        //   break;
        case 0:
          this.$router.push({ path: "/Mymember" });
          break;
        case 1:
          this.$router.push({ path: "/HomePage" });
          break;
        // case 3:
        //   this.$router.push({ path: "/Statistics" });
        //   break;
        // case 4:
        //   this.$router.push({ path: "/User" });
        //   break;
        case 2:
          this.$router.push({ path: "/Search" });
          break;
        default:
          break;
      }
    },
    // queryMessageTotal() {
    //   let flags = this.$utils.getLocalData(MESSAGE_FLAG)
    //   console.log(flags)
    //   if (!flags || flags == 'undefined') {
    //     flags = [1, 1, 1, 1, 1, 1, 1, 1];
    //     this.$utils.setLocalData(MESSAGE_FLAG, flags);
    //   } else {
    //     flags = this.$utils.getLocalData(MESSAGE_FLAG, true)
    //   }
    //   messageTotal({
    //     flags: flags
    //   }).then(res => {
    //     if (+res.code === 200) {
    //       this.$utils.setLocalData(MESSAGE_TOTAL, res.data.num);
    //       this.messageTotal = this.$utils.getLocalData(MESSAGE_TOTAL);
    //     } else {
    //       this.$vux.toast.show({
    //         text: res.msg,
    //         time: 2000,
    //         type: "text"
    //       });
    //     }
    //   });
    // }
  }
};
</script>

<style scoped lang="less">
@import "../assets/common/default.less";
.main-index {
  /deep/.weui-loading_toast{
    display: none!important;
  }
  color: @theme-color;
  font-size: 14px;
  /deep/ .weui-tabbar__item{
    height: 6vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 1vh;
    padding-top: 1vh;
  }
  /deep/ .main{
   .weui-tabbar__icon{
    margin-top: -0.87rem;
    width: 1.5rem;
    height: 1.5rem;
    background: #fff;
    border-radius: 50%;
    i{
      line-height:1.5rem
    }
   }
  } 
}
</style>
