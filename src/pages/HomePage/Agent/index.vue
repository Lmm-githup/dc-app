<template>
  <div style="height:100%;">
    <view-box body-padding-top="40px" class="callboard-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      代煎中药
      <router-link :to="{name: 'addAgent'}" slot="right" style="color: #000;">
          <div class="add-icon">+</div>
      </router-link>
    </x-header>
    <tab custom-bar-width="75px" active-color='#FFB94E'>
      <tab-item selected @on-item-click="toggleTab">待提交</tab-item>
      <tab-item @on-item-click="toggleTab">已提交</tab-item>
      <tab-item @on-item-click="toggleTab">已接受</tab-item>
      <tab-item @on-item-click="toggleTab">已拒绝</tab-item>
      <tab-item @on-item-click="toggleTab">已完成</tab-item>
    </tab>
    <!-- <group > -->
    <div class="box">
      <div class="title">
        <div class="rank-title">提交时间</div>
        <div class="rank-title">门店名称</div>
        <div class="rank-title">顾问姓名</div>
        <div class="rank-title">状态</div>
      </div>
      <a class="content" v-for="(item, index) in listData" :key="index" @click="goDetail(item)">
        <div class="rank-item">{{item.applyDate | dateFormat('YYYY-MM-DD')}}</div>
        <div class="rank-item">{{item.applyStoreName}}</div>
        <div class="rank-item">{{item.memberName}}</div>
        <div class="rank-item" style="color:orange;">{{item.applyStatus == 1 ? '新建' : (item.applyStatus == 2 ? '已提交' : (item.applyStatus == 3 ? '已接受' : (item.applyStatus == 4 ? '已拒绝' : (item.applyStatus == 5 ? '已完成' : '新建'))))}}</div>
      </a>
    </div>
    <!-- </group> -->
    
    <infinite-loading :identifier="infiniteId"  @infinite="infiniteHandler">
      <no-data v-if="!listData.length" slot="no-results"></no-data>
<load-more v-else slot="no-results" :show-loading="false" tip="没有更多了" ></load-more>
<load-more  slot="no-more" :show-loading="false" tip="没有更多了" ></load-more>
    </infinite-loading>
  </view-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { XHeader, Tab, TabItem, LoadMore,Group } from "vux";
import { Cell, CellGroup } from 'vant';
import rigthArrow from '@/assets/images/console/u487.png';
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
Vue.use(Cell)
  .use(CellGroup)

import { boilMedicineApplyList } from "@/api/home";

export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    LoadMore,
    NoData,
    Group,
    InfiniteLoading
  },
  data() {
    return {
      rigthArrow,
      currentIndex: 0,
      statusList: [1,2,3,4,5],
      listData: [],
      currentPage: 1,
      infiniteId: +new Date(),
      applyStatus: 1
    }
  },
  methods: {
    infiniteHandler($state) {
      boilMedicineApplyList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        applyStatus: this.applyStatus
      }).then(res => {
        if (res.code === 200) {
					let { list, paginator } = res.data
          this.listData = this.listData.concat(list || [])
          if (this.currentPage <= paginator.totalPages) {
            $state.loaded()
            if (paginator.totalCounts <= 10) {
              $state.complete()
            }
          } else {
            $state.complete();
          }
          this.currentPage++;
				}
      })
    },
    toggleTab(index) {
      this.currentIndex = index
      this.currentPage = 1
      this.pageSize = 10
      this.applyStatus = this.statusList[index]
      this.infiniteId = +new Date()
      this.listData = []
    },
    goDetail(item) {
      //this.$router.push({ name: 'agentDetail', query: { id: item.id } })
      this.$router.push({ path: `/agentDetail/${item.id}` })
    }
  }
}
</script>

<style lang="less" scoped>
.callboard-container {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  position: relative;
  .list {
    .list-item {
      margin-top: 10px;
      background-color: #fff;
      align-items: center;
      .title {
        font-weight: 400;
        font-size: 15px;
        color: #1b252e;
      }
      .info {
        margin-top: 10px;
        color: #333;
        font-size: 14px;
      }
      .date {
        font-size: 12px;
        color: #868686;
      }
    }
  }
  .box {
    margin-top: 15px;
    padding: 10px 0;
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
      flex:1;
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
    .isY{
      color:#19a3fa;
    }
  }
}
.scrollable .vux-tab-item{
  flex: 0 0 20%;
}
.add-icon{
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    text-align: center;
    line-height: 18px;
    border-radius: 50%;
    color: #999;
}
</style>
