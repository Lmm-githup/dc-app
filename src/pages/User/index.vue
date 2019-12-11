<template>
  <view-box  body-padding-top="40px">
    <x-header :left-options="{showBack: true,backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">我的</x-header>
    <a class="head-info" @click="goEdit">
      <div class="head-img-box">
        <img :src="userInfo.userHeadimg ? userInfo.userHeadimg : noImg" alt>
        <div class="info">
          <span class="name">
             {{userInfo.userCode}} ▪ {{userInfo.userName}}
          </span>
          <!-- 店长和门店信息 -->
          <div>
            <span class="location" v-if="userInfo.orgName"><img src="/src/assets/images/me/u1205.png"> {{userInfo.orgName}}</span>
            <span class="position" v-if="userInfo.positionName"><img src="/src/assets/images/me/u1201.png"> {{userInfo.positionName}}</span>
         </div>
        </div>
      </div>
      <div class="userBtn">主页 ></div>
    </a>
    <div class="contact-info">
      <cell title="电话" :value="userInfo.mobile" :border-intent="false"></cell>
      <cell title="电子邮件" :value="userInfo.email" :border-intent="false"></cell>
    </div>
    <div class="contact-info bottom-info">
      <cell :border-intent="false" @click.native="goEditPassword">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <img src="/src/assets/images/me/u13424.png"/>
          </div>
          <span style="color:#1D459B;">修改密码</span>
        </div>
      </cell>
      <!-- v-if="isSet" -->
      <cell v-if="isSet" :border-intent="false" @click.native="goSetUser">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <img src="/src/assets/images/me/u13424.png"/>
          </div>
          <span>设置</span>
        </div>
      </cell>
      <cell :border-intent="false" @click.native="goMember">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <img src="/src/assets/images/me/u13431.png"/>
          </div>
          <span>会员权益</span>
        </div>
      </cell>
      <cell v-if="isShopQC" :border-intent="false" @click.native="showQrcode = true">
        <div slot="title" class="cell-info">
          <div class="icon-box">
            <img src="/src/assets/images/me/u13438.png"/>
          </div>
          <span>门店二维码</span>
        </div>
      </cell>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showQrcode" class="dialog-demo" hide-on-blur>
        <div class="img-box">
          <div style="text-align:center;padding: 5px;font-size: 18px;font-weight: 700;">{{storeName}}</div>
          <img :src="qrCode" style="max-width:100%">
        </div>
        <a style="color: #666;" v-if="phoneType == 'ios'" @click="iosQrcode">
          <i class="fa fa-download" style="font-size:30px;" aria-hidden="true"></i>
        </a>
        <a style="color: #666;" v-else :href="qrCode" :download="qrCode">
          <i class="fa fa-download" style="font-size:30px;" aria-hidden="true"></i>
        </a>
      </x-dialog>
    </div>
    <div>
      <x-button type="primary" @click.native="loginOut">
          <img src="/src/assets/images/me/u13445.png"/> <span>安全退出</span>
      </x-button>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="logOutShow"
        title="操作提示"
        @on-cancel="logOutShow = false"
        @on-confirm="onConfirmLogOut"
      >
        <p style="text-align:center;">{{ '退出后下次需重新登录' }}</p>
      </confirm>
    </div>
  </view-box>
</template>

<script>
import {
  XHeader,
  Cell,
  XButton,
  TransferDomDirective as TransferDom,
  Confirm,
  XDialog
} from "vux";
import { getUserInfo, logout, myQrcode } from "@/api/user";
import { BTN_EQUITY, ACCOUNT_INFO, USER_INFO } from "@/utils/storage";
import { removeToken } from "@/utils/auth";
import noImg from "@/assets/images/no-img.jpg";
import Utils from "@/utils/utils";
const utils = new Utils();
export default {
  name: "User",
  components: {
    XHeader,
    Cell,
    XButton,
    TransferDom,
    Confirm,
    XDialog
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      noImg,
      userInfo: {},
      logOutShow: false,
      isSet: false,
      isShopQC: false,
      qrCode: "",
      showQrcode: false,
      storeName: '',
      phoneType: ''
    };
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    this.phoneType = utils.deviceType();
    this.storeName = this.$utils.getLocalData(USER_INFO, true).orgName
    let equityList = [];
    equityList = this.$utils.getLocalData(BTN_EQUITY, true) || [];
    equityList.forEach(v => {
      if (v.moduleKey == "USER_SETTING") {
        this.isSet = true;
      }
      if (v.moduleKey == "STORE_QC") {
        this.isShopQC = true;
      }
    });
    this.getData();
    myQrcode().then(res => {
      if (res.code === 200) {
        this.qrCode = res.data.imgUrl;
      } else {
        this.$vux.toast.show({
          text: res.msg,
          time: 2000,
          type: "text"
        });
      }
    });
  },
  mounted() {},
  methods: {
    iosQrcode () {
      let params = {
        qrcode: this.qrCode
      }
      window.iosShare.downloadQrcodeURL(JSON.stringify(params))
    },
    onConfirmLogOut() {
      logout().then(res => {
        if (+res.code === 200) {
          // 账号信息不清除
          let accountInfo = this.$utils.getLocalData(ACCOUNT_INFO);
          this.$utils.removeLocalData();
          removeToken();
          this.$utils.setLocalData(ACCOUNT_INFO, accountInfo);

          this.$router.replace({
            path: "login"
          });
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          });
        }
      });
    },
    loginOut() {
      this.logOutShow = true;
    },
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
    goMember() {
      this.$router.push({
        path: "/memberEquity"
      });
    },
    goEdit() {
      this.$router.push({
        path: "/editUserInfo"
      });
    },
    goEditPassword() {
      this.$router.push({
        path: "/editPassword",
        query: {
          mobile: this.userInfo.mobile
        }
      });
    },
    goSetUser() {
      this.$router.push({
        path: "/setUser"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/close";

.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>

<style lang="less" scoped>
/deep/ .vux-header{background:#312640 !important;}
/deep/ .vux-header-title{color:#fff !important;}
/deep/ .weui-cell__ft{color:#545454}
.head-info {
  background-color: #312640;
  display: block;
  padding: 20px;
  .userBtn{position: absolute;right:.5rem;top:2rem;color: #fff}
  .head-img-box {
    display: flex;
    align-items: center;
    > img {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      margin-right: 20px;
    }
    .info {
      display: flex;
      align-items:flex-start;
      flex-direction: column;
      margin-right: 20px;
      //color: #1d459b;
      .name {
        color:#fff;
        font-size:.4rem;
      }
      .location {
        margin-right: 10px;
        font-size: .35rem;
        color: #fff;
        //padding: 1px 8px;
        border-radius: 10px;
        margin-right:5px;
        img{width:.4rem;vertical-align: middle;}
      }
      .position {
       //margin-left: 10px;
        font-size: .35rem;
        color: #fff;
        //padding: 1px 8px;
        border-radius: 10px;
        //font-weight: 400;
        img{width:.4rem;vertical-align: middle;}
      }
    }
  }
}

.contact-info {
  background: #fff;
  margin-bottom: 20px;
  .cell-info {
    display: flex;
    align-items: center;
    .icon-box {
      width: 40px;
    }
    .icon {
      font-size: 20px;
      margin-right: 20px;
      margin-top: 3px;
    }
  }
}
.bottom-info{
  .weui-cell {padding:0 0 !important;
   img{vertical-align: middle;}
  }
}
.weui-btn{background:#fff;border-radius:0;color:#1d1c1c;text-align:left;font-size:.38rem;line-height:1.6rem;
  img{width: .6rem;vertical-align: middle;}
}
.weui-btn:after{border-radius:0;border:none;}
</style>