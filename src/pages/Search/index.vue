<template>
   <div class="Search">
      <div class="header">查询</div>
      <div class="search">
        <group>
          <x-input v-model="mobile" type="tel" placeholder="查询会员手机号">
            <a slot="right" @click="goDetails" class="fa fa-search search-icon"></a>
          </x-input>
        </group>
      </div>
      <div class="searchBtn" @click="goDetails">查询</div>
   </div>
</template>

<script>
import {Group, XInput} from "vux";
import {detailByMobile} from "@/api/home";
export default {
  name: "Search",
  components: {
    Group,
    XInput
  },
  data() {
    return {
      mobile:""
    };
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {},
  methods: {
   goDetails() {
      let reg = /^[1]([3-9])[0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$vux.toast.show({
          text: "请输入正确的手机号",
          time: 2000,
          type: "text"
        });
        return;
      } else {
        detailByMobile({
          mobile: this.mobile
        }).then(res => {
          if (+res.code === 200) {
            if (res.data) {
              this.$router.push({
                // name: "memberDetail",
                name: "memberManage",
                // params: {
                query: {
                  custNo: res.data.custNo
                }
              });
            } else {
              this.$vux.toast.show({
                text: "未找到该会员",
                time: 2000,
                type: "text"
              });
            }
            // this.userInfo = res.data;
          } else {
            this.$vux.toast.show({
              text: res.msg,
              time: 2000,
              type: "text"
            });
          }
        });
      }
    },
  }
};
</script>
<style lang="less" scoped>
  .Search{width:100%;height:100%;background:#312640;
    .header{width:100%;line-height:1.5rem;text-align:center;color:#fff;font-size:.5rem;}
    .searchBtn{width:90%;margin: 1rem auto;text-align:center;color:#fff;line-height:1.1rem;background:#FFB94E;border-radius: 5px;}
    .search {
      width:90%;
      margin: 0 auto;
      margin-top:3rem;
    /deep/ .weui-cells {
      margin: 0;
      background-color: transparent;
      // position: relative;
      line-height: .8rem;
      &::before,
      &::after {
        display: none;
      }
      .weui-cell {
        padding: 5px 10px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 5px;
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
  }
</style>