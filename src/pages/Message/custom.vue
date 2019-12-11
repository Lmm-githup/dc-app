<template>
  <div class="message-index">
    <x-header :left-options="{showBack: true, backText: ''}">消息提醒自定义</x-header>
    <group title>
      <x-switch
        v-for="(item, index) in flags"
        @on-change="handleChange(item, index)"
        :title="remindMap[index]"
        :value-map="[0, 1]"
        :value="item"
        :key="index"
        :disabled="index == 0 || index == 1 ? true : false"
      ></x-switch>
    </group>
    <footer-button @click="save" class="btn"></footer-button>
  </div>
</template>

<script>
import { XHeader, Cell, Group, TransferDom, XSwitch } from "vux";
import { totalList, getMessageSet, saveMessageSet } from "@/api/message";
import FooterButton from "@/components/common/FooterButton";
import { MESSAGE_FLAG } from "@/utils/storage";
export default {
  name: "message",
  components: {
    XHeader,
    Cell,
    Group,
    XSwitch,
    FooterButton
  },
  data() {
    return {
      remindMap: {
        "0": "用劵提醒",
        "1": "挽留提醒",
        "2": "复购提醒",
        "3": "会员转入提醒",
        "4": "会员转出提醒",
        "5": "通告提醒",
        "6": "入会周年提醒"
      },
      flags: []
    };
  },
  methods: {
    handleChange(item, index) {
      this.flags[index] = item == 1 ? 0 : 1;
    },
    save() {
      // this.$utils.setLocalData(MESSAGE_FLAG, this.flags);
      saveMessageSet({ remindSetup: JSON.stringify(this.flags) }).then(res => {
        if (res.code == 200) {
          this.$vux.toast.show({
            text: "保存成功",
            time: 1500,
            type: "text"
          });
        }
      });
    }
  },
  mounted() {
    // this.flags = this.$utils.getLocalData(MESSAGE_FLAG, true)
    getMessageSet().then(res => {
      if (res.code == 200) {
        this.flags = JSON.parse(res.data);
      }
    });
  }
};
</script>

<style scoped lang="less">
.message-index {
  /deep/ .vux-header{background:#312640 !important}
  /deep/ .vux-header-title{color:#fff !important}
 /deep/ .common-footer-btn{background:#FFA41A !important}
 /deep/ .weui-switch:checked{border-color: rgba(26, 188, 156, 1);background-color: rgba(26, 188, 156, 1);}
}
</style>
