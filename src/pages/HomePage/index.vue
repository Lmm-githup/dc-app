<template>
  <div class="container">
    <!-- <div style="position: absolute;left: 0;top:0"></div> -->
    <!-- 顶部 -->
    <div class="header">
      <a class="user-info" @click="goUserInfo">
        <img
          :src="userInfo.userHeadimg ? userInfo.userHeadimg : `/src/assets/images/no-img.jpg`"
          alt
          class="logo"
        >
        <div>
          {{userInfo.userCode}} ▪ {{userInfo.userName}}
          <span class="tag"><img src="/src/assets/images/me/u1201.png"> {{userInfo.positionName}}</span>
        </div>
      </a>
      <div class="tab-taber"> 
          <!-- 消息 -->
          <!-- <i slot="icon" class="fa fa-commenting-o fa-2x" aria-hidden="true" @click="messageTab"></i> -->
          <img src="/src/assets/images/me/message.png" class="messagebtn" @click="messageTab">
          <div :class="messageTotal=='0'?'hides messagered':'shows messagered'">{{messageTotal}}</div>
          <!-- <i slot="icon" class="fa fa-cog fa-2x me" aria-hidden="true" @click="userTab"></i> -->
          <img src="/src/assets/images/me/userset.png" class="me" @click="userTab">
      </div>
       <!--  -->
    <div :class="pulldownBtn?'shows top-nav-bar':'hides top-nav-bar'">
      <tab :line-width="2" custom-bar-width="60px">
        <tab-item selected @on-item-click="toggleTab"><span>今日</span></tab-item>
        <tab-item @on-item-click="toggleTab"><span>本月</span></tab-item>
      </tab>
      <!-- 线条 -->
      <img id="u2103_img" src="/src/assets/images/me/u2103.png">
      <img id="u2105_img" src="/src/assets/images/me/u2105.png">
      <div class="crown"><img src="/src/assets/images/me/u2126.png"></div>
      <div class="intro-box">
        <div class="left">
          <div class="number">
            <span>{{actionInfo.memNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
          <div style="font-weight:blod;color:rgb(139, 142, 149)"><i class="fa fa-user-o" aria-hidden="true"></i> 归属会员总人数</div>
        </div>
        <div class="right">
          <div class="number">
            <span>{{actionInfo.newNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
          <div style="font-weight:blod;color:rgb(139, 142, 149)"><i class="fa fa-user-plus" aria-hidden="true"></i> 拉新总人数</div>
        </div>
        <div class="left mt-10">
          <div class="number">
            <span>{{actionInfo.conMemNum || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
          <div style="font-weight:blod;color:rgb(139, 142, 149)"><i class="fa fa-gift" aria-hidden="true"></i> 归属会员到店人数</div>
        </div>
        <div class="right mt-10">
          <div class="number">
            <span>{{actionInfo.bonus || 0}}</span>
            <!--<span>></span>
            <span></span>-->
          </div>
          <div style="font-weight:blod;color:rgb(139, 142, 149)"><i class="fa fa-usd" aria-hidden="true"></i> 鼓励金</div>
        </div>
      </div>
    </div>
    <!-- --- -->
      <div class="pulldown" @click="pulldownbtns">
        <p style="padding-top:.5rem">销售数据</p>
        <p>{{pulldownBtn?"∧":"∨"}}</p>
      </div>
      <!-- 搜索栏 -->
      <!-- <div class="search" v-show="!menuFlag">
        <group>
          <x-input v-model="mobile" type="tel" placeholder="查询会员手机号">
            <a slot="right" @click="goDetails" class="fa fa-search search-icon"></a>
          </x-input>
        </group>
      </div> -->
      <div style="width:100%;height: 1.4rem"></div>
    </div>
    <!-- 通知消息 -->
    <div style="width:100%;height: .3rem"></div>
    <div class="message" v-if="messageData.length">
      <img :src="ImgMessage" class="message-logo" alt>
      <div class="message-box">
        <swiper
          auto
          height="30px"
          direction="vertical"
          :interval="2000"
          class="text-scroll"
          :show-dots="false"
        >
          <swiper-item v-for="(item, index) in messageData" :key="index">
            <a class="message-box-item" @click="goMessage(item)">
              <span class="message-name">{{item.startDate | dateFormat('MM月DD日')}}{{item.typeName}}:</span>
              &nbsp;
              <span class="message-desc">
                [
                <span class="message-number">{{item.num}}</span>
                ]
                个{{item.relaName}}待维系
              </span>
            </a>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <!-- 菜单栏:style="{'height': messageData.length ? '41vh': '48vh'}" -->
    <div class="nav-content">
      <a class="nav-item" v-for="(item, index) in list" :key="index" @click="goRoute(item.moduleUrl)">
        <div class="nav-item-img">
          <img v-if="item.moduleUrl == 'more'" :src="moreImg" alt="">
          <img v-else-if="item.moduleUrl == 'ticketExchange'" :src="couponImg" alt="">
          <img v-else :src="`/src/assets/images/me/work/${item.moduleIco}.png`" alt>
        </div>
        <div class="nav-item-name">{{item.moduleName}}</div>
      </a>
      <a class="nav-item" @click="StaTisticss">
        <div class="nav-item-img">
          <img src="/src/assets/images/me/work/count.png" alt="">
        </div>
        <div class="nav-item-name">统计</div>
      </a>
    </div>
    <div style="width:100%;height:3rem;"></div>
  </div>
</template>

<script>
// 用户头像

import ImgMessage from "@/assets/images/console/u441.png"; // 通知消息 图片
import {Tabbar,TabbarItem, Tab, TabItem, Group, Cell, XInput, Swiper, SwiperItem } from "vux";
import { getUserInfo } from "@/api/user";
import {
  homeRelation,
  actionStatistics,
  staffTotal,
  getUserAuth,
  detailByMobile,
  messageTotal//获取消息
} from "@/api/home";
import moreImg from '@/assets/images/console/u499.png'
import couponImg from '@/assets/images/me/work/u489.png'
import { BTN_EQUITY,
        MESSAGE_TOTAL,
        CURRENT_INDEX,
        USER_INFO,
        MESSAGE_FLAG } from "@/utils/storage";
export default {
  name: "Home",
  components: {
    Tabbar,
    TabbarItem,
    Tab,
    TabItem,
    Group,
    Cell,
    XInput,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      messageTotal: "0",//消息的数量
      pulldownBtn:false,//销售数据的显示和隐藏
      couponImg,
      moreImg,
      userInfo: {},
      ImgMessage, // 消息图片
      menuFlag: false, // 是否显示更多菜单
      list: [],
      navList: [],
      btnList: [],
      /*navList: [
        { name: '关系维系', routerName: 'relationship', img: Img8 },
        { name: '会员管理', routerName: 'memberManage', img: Img10 },
        { name: '邀请入会', routerName: 'inviteQRcode', img: Img5 },
        { name: '我的关注', routerName: 'myAttention', img: Img4 },
        { name: '注册会员', routerName: '', img: Img5 },
        { name: '药品查询', routerName: 'drugQuery', img: Img12 },
        { name: '慢病会员', routerName: '', img: Img9 },
        { name: '我的名片', routerName: 'myCard', img: Img3 },
        { name: '导购意见箱', routerName: 'shoppersOpinion', img: Img14 },
        { name: '通告管理', routerName: 'callboard', img: Img11 },
        { name: '活动管理', routerName: 'activity', img: Img2 },
        { name: '券管理', routerName: 'ticket', img: Img6 },
        { name: 'O2O管理', routerName: 'o2o', img: Img1 },
        { name: '培训中心', routerName: 'trainCenter', img: Img15 },
        { name: '论坛', routerName: '', img: Img13 }
      ],*/
      mobile: "",
      messageData: [],
      actionInfo: {},
      currentIndex: 0,
      isMore: false
    };
  },
  props: {},
  computed: {},
  watch: {
    menuFlag(newVal) {
      let idx = newVal ? this.navListTemplate.length : 4;
      this.getList(idx);
    }
  },
  created() {
    this.getAuth();
    this.getData();
    this.getMessage();
    this.getAction();
    this.queryMessageTotal();//获取消息
  },
  mounted() {},
  methods: {
    goUserInfo () {
      this.$router.push({
        path: '/editUserInfo'
      })
    },
    // 消息页面
    messageTab (){
     this.$router.push({ path: "/Message" });
    },
    // 我的页面
    userTab (){
     this.$router.push({ path: "/User" });
    },
    //统计页面
    StaTisticss(){
      this.$router.push({ path: "/Statistics" });
    },
    // 点击销售数据
    pulldownbtns(){
      this.pulldownBtn = !this.pulldownBtn;
    },
    goMessage(item) {
      let { type } = item,
        routerName = "";
      if (type === 0) routerName = "keepTask";
      if (type === 1) routerName = "inviteTask";
      if (type === 2) routerName = "customTask";
      if (!routerName) return;
      this.$router.push({
        path: routerName,
        query: {
          type: type
        }
      });
    },
    // goDetails() {
    //   let reg = /^[1]([3-9])[0-9]{9}$/;
    //   if (!reg.test(this.mobile)) {
    //     this.$vux.toast.show({
    //       text: "请输入正确的手机号",
    //       time: 2000,
    //       type: "text"
    //     });
    //     return;
    //   } else {
    //     detailByMobile({
    //       mobile: this.mobile
    //     }).then(res => {
    //       if (+res.code === 200) {
    //         if (res.data) {
    //           this.$router.push({
    //             // name: "memberDetail",
    //             name: "memberManage",
    //             // params: {
    //             query: {
    //               custNo: res.data.custNo
    //             }
    //           });
    //         } else {
    //           this.$vux.toast.show({
    //             text: "未找到该会员",
    //             time: 2000,
    //             type: "text"
    //           });
    //         }
    //         // this.userInfo = res.data;
    //       } else {
    //         this.$vux.toast.show({
    //           text: res.msg,
    //           time: 2000,
    //           type: "text"
    //         });
    //       }
    //     });
    //   }
    // },
    getData() {
      getUserInfo().then(res => {
        if (+res.code === 200) {
          this.userInfo = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    getMessage() {
      homeRelation({
        userCrmId: this.userInfo.crmId
      }).then(res => {
        if (+res.code === 200) {
          this.messageData = res.data;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    //
    getAction() {
      //  D/W/M
      let type = ["day", "month"];
      actionStatistics({
        queryType: type[this.currentIndex]
      }).then(res => {
        if (res.code === 200) {
          this.actionInfo = res.data;
        }
      });
    },
    //
    getAuth() {
      getUserAuth({}).then(res => {
        if (res.code === 200) {
          let list = [];
          res.data.forEach(el => {
            el.moduleType == "view" ? list.push(el) : this.btnList.push(el);
          });
          this.navList = list;
          if (list.length > 12) {
            for (let i = 0; i < 11; i++) {
              this.list.push(list[i]);
            }
            this.list.push({
              moduleName: "更多",
              moduleIco: "u499",
              moduleUrl: "more"
            });
          } else {
            this.list = list;
          }
        }
        this.$utils.setLocalData(BTN_EQUITY, this.btnList);
      });
    },
    toggleTab(index) {
      this.currentIndex = index;
      this.getAction();
    },
    showMoreMenu(flag) {
      this.menuFlag = flag;
    },
    goRoute(name) {
      if (name == "more") {
        this.list = this.navList;
        return;
      }
      this.$router.push({ name });
    },
    // 获取菜单列表
    // getList (idx = 4) {
    //   this.navList = this.navListTemplate.filter((item, index) => index < idx)
    // }
    // 获取消息
     queryMessageTotal() {
      let flags = this.$utils.getLocalData(MESSAGE_FLAG)
      // console.log(flags)
      if (!flags || flags == 'undefined') {
        flags = [1, 1, 1, 1, 1, 1, 1, 1];
        this.$utils.setLocalData(MESSAGE_FLAG, flags);
      } else {
        flags = this.$utils.getLocalData(MESSAGE_FLAG, true)
      }
      messageTotal({
        flags: flags
      }).then(res => {
        if (+res.code === 200) {
          this.$utils.setLocalData(MESSAGE_TOTAL, res.data.num);
          this.messageTotal = this.$utils.getLocalData(MESSAGE_TOTAL);
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.vux-tab-selected{
  span{background:#FFA41A !important;font-weight: bold;box-shadow: #443557 0 0 0.10667rem}
}
#u2103_img{position:absolute;top:70%;width:100%;}
#u2105_img{position:absolute;top:20%;left:48.5%;height:100%;}
.shows{display: block}
.hides{display:none}
.container {
  background-color: #f2f2f2;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // 顶部
  .header {
    // height: 150px;
    //min-height: 23vh;
    box-sizing: border-box;
    padding: 10px 0;
    color: #fff;
    background: #312640;
    position:relative;
    .user-info {
      display: flex;
      align-items: center;
      font-size: 15px;
          width: 6rem;
          margin:.5rem;
    }
    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .tag {
      display: inline-block;
      font-size: 14px;
      /*border: 1px solid #fff;*/
      padding: 0 5px;
      border-radius: 8px;
      img{width:.4rem;vertical-align: middle;}
    }
    .tab-taber{
      //width:2.5rem;
      height:1rem;
      position: absolute;
      right: 5%;
      top:1rem;
      display: flex;
      align-items: flex-start;
      img{width:.8rem;vertical-align: middle;}
      .me{padding-left:.7rem;}
      .messagered{background: red; position: absolute;left: 25%;top: 2%;border-radius: 50%;/* width: .4rem; *//* height: .4rem; */text-align: center;line-height: .4rem;font-size: .1rem;}
    }
    .pulldown{width: 2rem;height: 2rem;border-radius: 50%;color: #FFA41A;background: #312640; box-shadow: #443557 0px 0px 4px;text-align:center;position:absolute;left:39%}
  }
  // 搜索栏
  .search {
    margin: 5px 0;
    /deep/ .weui-cells {
      margin: 0;
      background-color: transparent;
      // position: relative;
      // line-height: 20px;
      &::before,
      &::after {
        display: none;
      }
      .weui-cell {
        padding: 5px 10px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 30px;
      }
      .weui-input {
        font-size: 13px;
        color: #333;
        display: flex;
        align-items: center;
        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }
  .top-nav-bar {
    width: 100%;
    height: 26vh;
    box-sizing: border-box;
    margin: 1rem auto;
    position: relative;
    //padding: 0 10px;
    //border-radius: 4px;
    //margin-top: -10vh;
    color: #fff;
    //background: #fff;
    // background: linear-gradient(top, #03b2ff, #1790fe);
    /deep/ .vux-tab {
      background-color: transparent;
      .vux-tab-item {
        color: #fff;
        &.vux-tab-item {
          background-size: 0;
        }
        span{display: inline-block;width:3.5rem;height:100%;background:#443557;border-radius: .6rem;font-size:.5rem}
      }
      .vux-tab-bar-inner {
        background-color: #19a3fa;
        display: none;
      }
    }
    .crown{position:absolute;left:44.2%;top:64%;width:1rem;height:1rem;background:#312640;border-radius: 50%;text-align:center;
      i{line-height:1rem;color:#FFA41A}
    }
    .intro-box {
      display: flex;
      flex-wrap: wrap;
      //margin: 0 5%;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      .left,
      .right {
        width: 49%;
        font-weight: 700;
        text-align: center;
        line-height:1rem;
        .number {
          font-size: 18px;
          font-weight: bold;
        }
      }
      .left{}
      .mt-10 {
        margin-top:.3rem;
      }
    }
  }
  // 消息栏
  .message {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 13px;
    margin-top: 1vh;
    height: 6vh;
    padding: 5px 15px;
    color: #999;
    background-color: #fff;
    .message-logo {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
    .message-box {
      flex: 1;
      max-height: 50px;
      overflow: auto;
      .message-box-item {
        display: flex;
        height: 100%;
        align-items: center;
        .message-name {
          color: #333;
          font-size: 14px;
          font-weight: bold;
          // flex:45%;
        }
        .message-number {
          color: #ff5a5a;
        }
        .message-desc {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 55%;
          color: #333;
        }
      }
    }
  }
  // 菜单栏
  .nav-content {
    margin: 1vh 0;
    padding: 5px;
    border-radius: 4px;
    //height: 41vh;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    overflow: scroll;
    // margin-bottom: 60px;
    // margin-bottom: 9vh;
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 24.7%;
      margin: .2rem 0;
      .nav-item-img {
        //width: 22px;
        //height: 22px;
        width:45px;height:45px;
        text-align: center;
        img {
          width: 100%;
        }
      }
      .nav-item-name {
        font-size: 14px;
        margin-top: 5px;
      }
      // .banner {
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // width: 52px;
      // height: 52px;
      // background: url('../../assets/images/console/u418.png') no-repeat;
      // background-size: 52px 52px;
      // img {
      //   width: 50%;
      //   height: 50%;
      // }
      // }
    }
    .button {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: #ccc;
      > span {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .fa {
        margin-left: 5px;
      }
    }
  }
}
</style>