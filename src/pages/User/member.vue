<template>
  <div class="member-equity-index">
    <x-header :left-options="{showBack: true,backText: ''}">会员权益</x-header>
    <tab custom-bar-width="60px">
      <tab-item @on-item-click="handler" selected> 会员权益 </tab-item>
      <tab-item @on-item-click="handler"> 会员章程 </tab-item>
    </tab>
    <img v-if="tabIndex == 0" :src="img1" alt="">
    <img v-else :src="img2" alt="">
  </div>
</template>

<script>
import { XHeader, Tab, TabItem } from "vux";
import { commonLov } from "@/api/common";
export default {
  name: "member",
  components: {
    XHeader,
    Tab,
    TabItem
  },
  data() {
    return {
      img1: '',
      img2: '',
      tabIndex: 0
    };
  },
  methods: {
    handler(i) {
      this.tabIndex = i
    },
    async init () {
      const res = await commonLov({
        dataType:'MEMBER_EQUITY'
      })
      console.log(res)
      if(res.code === 200) {
        this.img1 = res.data[0].dataValue
        this.img2 = res.data[1].dataValue
      }
    }
  },
  mounted() {
    this.init()
  }
};
</script>

<style scoped lang="less">
/deep/ .vux-header{background:#312640 !important;}
/deep/ .vux-header-title{color:#fff !important;}
/deep/ .vux-tab .vux-tab-item.vux-tab-selected{color:#FFA41A}
/deep/ .vux-tab-bar-inner{background:#FFA41A}
.member-equity-index{
  img{
    width: 100%;
  }
}
</style>
