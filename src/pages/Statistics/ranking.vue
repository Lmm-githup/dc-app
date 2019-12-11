<template>
  <div style="height:100%;">
    <view-box body-padding-top="40px" class="ranking-index">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}">{{typeName}}
      <!-- <div slot="right" @click="exportToEmail" style="color:#19a3fa;font-size:12px;">
        导出至邮箱
      </div> -->

    </x-header>
    <!-- <group > -->
    <div class="box">
      <div class="title">
        <div class="rank-title w-15">排名</div>
        <div class="rank-title">姓名</div>
        <div v-if="queryType == 'company'" class="rank-title">所属区域</div>
        <div v-if="queryType == 'area' || queryType == 'company'" class="rank-title">所属门店</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-title"
        >归属会员总人数</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-title"
        >拉新总人数</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-title"
        >归属会员到店人数</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-title"
        >归属会员总销售额</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-title"
        >归属会员毛利额</div>
        <div v-if="queryType== 'agent' || queryType == 'price'" class="rank-title">所属区域</div>
        <div v-if="queryType== 'agent' || queryType == 'price'" class="rank-title">所属门店</div>
        <div v-if="queryType== 'agent'" class="rank-title">纳新数</div>
        <div v-if="queryType== 'price'" class="rank-title">客单数</div>
      </div>
      <div class="content" v-for="(item, index) in rankList" :key="index">
        <div class="rank-item w-15">
          <img class="iconfont-img" v-if="index === 0" :src="FirstImg" alt="">
          <img class="iconfont-img" v-if="index === 1" :src="SecondImg" alt="">
          <img class="iconfont-img" v-if="index === 2" :src="ThreeImg" alt="">
          <span v-if="index !== 0 && index !== 1 && index !== 2">{{item.rank}}</span>
        </div>
        <div class="rank-item">{{item.guideName}}</div>
        <div
          v-if="queryType== 'company'"
          class="rank-item"
        >{{item.regionName}}</div>
        <div v-if="queryType== 'company' || queryType == 'area'" class="rank-item">{{item.shopName}}</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-item"
        >{{item.memNum}}</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-item"
        >{{item.newNum}}</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-item"
        >{{item.conMemNum}}</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-item"
        >{{item.salesVal}}</div>
        <div
          v-if="queryType== 'store' || queryType == 'area' || queryType == 'company'"
          class="rank-item"
        >{{item.salesProfit}}</div>
        <div
          v-if="queryType== 'agent' || queryType == 'price'"
          class="rank-item"
        >{{item.regionName}}</div>
        <div v-if="queryType== 'agent' || queryType == 'price'" class="rank-item">{{item.shopName}}</div>
        <div v-if="queryType== 'agent'" class="rank-title">{{item.newNum}}</div>
        <div v-if="queryType== 'price'" class="rank-title">{{item.priceNum}}</div>
      </div>
    </div>
    <!-- </group> -->
  </view-box>
  </div>
</template>

<script>
import { XHeader, Group } from "vux";
import { getRanking, sendEmail } from "@/api/statistics";
import FirstImg from '@/assets/images/first.png';
import SecondImg from '@/assets/images/second.png';
import ThreeImg from '@/assets/images/three.png';
export default {
  name: "editPassword",
  components: {
    XHeader,
    Group
  },
  data() {
    return {
      FirstImg,
      SecondImg,
      ThreeImg,
      typeName: "",
      queryType: "",
      rankList: [],
      typeMap: {
        '门店排名': '1',
        '区域排名': '2',
        '公司排名': '3',
        '最佳纳新': '4',
        '会员排名': '5',
        '最佳客单': '6'
      }
    };
  },
  methods: {
    async init() {
      console.log(this.queryType);
      const res = await getRanking({ queryType: this.queryType });
      console.log(res);
      if (res.code === 200) {
        this.rankList = res.data.list;
      }
    },
    exportToEmail () {
      sendEmail({
        exportType: this.typeMap[this.typeName]
      }).then(res => {
          if (res.code == 200) {
            this.$vux.toast.show({
            text: '发送成功!',
            time: 2000,
            type: "text"
          });
          } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      })
    }
  },
  mounted() {
    this.typeName = this.$route.query.typeName;
    this.queryType = this.$route.query.queryType;
    this.init();
  }
};
</script>

<style scoped lang="less">
.ranking-index {
  .box {
    //margin-top: 15px;
   //padding: 10px 0;
    line-height:.8rem;
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    .title,
    .content {
      width: 100%;
      display: flex;
    }
    .rank-title,
    .rank-item {
      border-bottom: 1px solid #dfdfdf;
      width: 30%;
      white-space: normal;
      flex-shrink: 0;
      text-align: center;
      margin: 0 auto;
      .iconfont-img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
    }
    .rank-title {
      padding: 15px 5px;
      font-size: 12px;
      font-weight: 700;
      color: #000;
    }
    .rank-item {
      color: #333;
      padding: 10px 5px;
      font-size: 12px;
    }
    .w-15 {
      width: 15% !important;
    }
  }
}

</style>
