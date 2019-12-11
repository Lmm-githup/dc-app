<template>
  <div style="height:100%;">
    <view-box body-padding-top="40px" class="callboard-container">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="{showBack: true,backText: ''}" class="header">
      {{titleArr[currentIndex]}}
    </x-header>
    <tab custom-bar-width="75px" active-color="#FFB94E">
      <tab-item selected @on-item-click="toggleTab">处分通告</tab-item>
      <tab-item @on-item-click="toggleTab">年会通告</tab-item>
      <tab-item @on-item-click="toggleTab">表彰通告</tab-item>
    </tab>
    <div class="list">
      <van-cell is-link class="list-item" @click="goRoute(item)" v-for="(item, index) in listData" :key="index">
        <template slot="title">
          <h3 class="title">{{item.title}}</h3>
        </template>
        <template slot="label">
          <p class="date">{{item.gmtCreate}}</p>
        </template>
      </van-cell>
    </div>
    
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
import { XHeader, Tab, TabItem, LoadMore } from "vux";
import { Cell, CellGroup } from 'vant';
import rigthArrow from '@/assets/images/console/u487.png';
import NoData from '@/components/common/NoData'
import InfiniteLoading from "vue-infinite-loading";
Vue.use(Cell)
  .use(CellGroup)

import { callboardList } from "@/api/home";

export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    LoadMore,
    NoData,
    InfiniteLoading
  },
  data() {
    return {
      rigthArrow,
      titleArr: ['处分通告', '年会通告', '表彰通告'],
      currentIndex: 0,
      listData: [],
      currentPage: 1,
      infiniteId: +new Date()
    }
  },
  methods: {
    infiniteHandler($state) {
      let type = ['Notice of punishment', 'Annual meeting', 'Commendation notice']
      // 通告类型 Notice of punishment（处分通告）、Annual meeting（年会通告）、Commendation notice（表彰通告）
      callboardList({ 
        category: type[this.currentIndex],
        contentType: 'announce',
        currentPage: this.currentPage,
        pageSize: this.pageSize
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
      this.infiniteId = +new Date()
      this.listData = []
    },
    goRoute(item) {
      this.$router.push({ name: 'callboardDetail', query: { rowNo: item.rowNo } })
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
    margin-top:10px;
    .list-item {
      //margin-top: 10px;
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
}
</style>
