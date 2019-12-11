<template>
  <div class="message-index">
    <x-header :left-options="{showBack: true,backText: ''}">
      消息提醒({{messageTotal}})
      <div slot="right">
        <router-link :to="{name: 'custom'}">
          <i class="fa fa-plus-circle" style="color:#f8bb64;font-size:18px" aria-hidden="true"></i>
        </router-link>
      </div>
    </x-header>
    <group class="list">
      <cell
        v-for="(item, index) in messageList"
        :key="index"
        :title="item.remindType"
        @click.native="handleClick(item)"
      >
        <img slot="icon" v-if="item.remindTypeCode == 1" src="/src/assets/images/me/conup.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 2" src="/src/assets/images/me/naozhong.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 3" src="/src/assets/images/me/Group-.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 4 || item.remindTypeCode == 5" src="/src/assets/images/me/zhuanchu.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 6" src="/src/assets/images/me/gonggao.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 7" src="/src/assets/images/me/kejieruhuihua.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 8" src="/src/assets/images/me/xiaoxi.png"/>
        <img slot="icon" v-if="item.remindTypeCode == 9" src="/src/assets/images/me/gonggao.png"/>
        <badge v-if="item.memNum" :text="item.memNum"></badge>
      </cell>
    </group>
  </div>
</template>

<script>
import { XHeader, Cell, Group, TransferDom, Badge } from "vux";
import { totalList, getMessageSet, saveMessageSet } from "@/api/message";
import { USER_INFO, MESSAGE_TOTAL, MESSAGE_FLAG } from "@/utils/storage";
import Utils from "@/utils/utils";
const utils = new Utils();      
export default {
  name: "message",
  components: {
    XHeader,
    Cell,
    Group,
    Badge
  },
  data() {
    return {
      guideId: "",
      messageList: [],
      messageTotal: 0,
      flags: null
    };
  },
  methods: {
    handleClick(val) {
      console.log(val);
      let deviceType = utils.deviceType();
      let nums = 0
      let numsTotal = this.$utils.getLocalData(MESSAGE_TOTAL)
      
      if (val.memNum) {
        nums = numsTotal - val.memNum
        this.$utils.setLocalData(MESSAGE_TOTAL, nums);
        if (deviceType == "ios"&& window.iosShare) {
          window.iosShare.readNums(JSON.stringify({ nums: nums }));
        } else if (deviceType == "android" && window.androidShare) {
             window.androidShare.readNums(nums);
          }
      }

      if (val.remindTypeCode == 8) {
        this.$router.push({
          name: "callboard",
          query: { isCheck: true, remindTypeCode: val.remindTypeCode }
        });
      } else if (val.remindTypeCode == 9) {
        this.$router.push({
          name: "chatHistory"
        });
      } else {
        this.$router.push({
          path: "/remindDetails",
          query: { isCheck: true, remindTypeCode: val.remindTypeCode }
        });
      }
    },
    async getTotal() {
      try {
        const res = await totalList(this.flags);
        if (+res.code == 200) {
          console.log(res.data);
          this.messageList = res.data;
        }
      } catch (e) {
        this.$vux.toast.show({
          text: e.msg,
          time: 2000,
          type: "text"
        });
      }
    }
  },
  mounted() {
    getMessageSet().then(res => {
      if (res.code == 200) {
        if (!res.data) {
          this.flags = [1, 1, 1, 1, 1, 1, 1, 1];
          saveMessageSet({ remindSetup: JSON.stringify(this.flags) });
        } else {
          this.flags = JSON.parse(res.data);
        }
        this.getTotal();
      }
    });
  }
};
</script>

<style scoped lang="less">
.message-index {
  height: 100%; 
  background:#fff;
  .vux-header{background:#312640 !important;
   /deep/ .vux-header-title{color:#fff !important;}
  }
  .list {
    img {
      width:.7rem;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  /deep/ .weui-cells:before{border:none;}
  /deep/ .weui-cells:after{border:none}
}
</style>
