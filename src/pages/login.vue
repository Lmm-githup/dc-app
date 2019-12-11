<template>
  <div>
    <div class="header">
      <img src="../assets/images/logoreds.png" alt>
      <!-- <div class="name">康佰家大药房导购协同</div> -->
    </div>
    <div class="form-info">
      <x-input placeholder="用户名" v-model="loginName" class="user">
        <i
          class="fa fa-user-o"
          style="color:#666;margin-right:10px;font-size:0.6rem;"
          slot="label"
          aria-hidden="true"
        ></i>
      </x-input>
      <x-input
        placeholder="密码"
        class="user"
        v-model="loginPwd"
        type="password"
        style="margin-top:20px;"
      >
        <i
          class="fa fa-unlock-alt"
          style="color:#666;margin-right:10px;font-size:0.6rem;"
          slot="label"
          aria-hidden="true"
        ></i>
      </x-input>

      <div class="recordPW">
        <van-checkbox
          style="display: flex;justify-content: flex-end;color:#1989fa;margin-top:10px;"
          v-model="checked"
        >记住密码</van-checkbox>
      </div>
      <a class="login-btn" @click="handleLogin">登 录</a>
      <div class="message">
        忘记密码
        <span style="color:#F59715;">请联系管理员</span>进行重置
      </div>
      <div class="version">当前版本 V {{version}}</div>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="show"
        title="版本更新提示"
        :content="versionMsg"
        @on-cancel="show = false"
        @on-confirm="onConfirm"
        confirm-text="立即更新"
        cancel-text="下次再说"
      ></confirm>
    </div>
  </div>
</template>
<script>
import { Checkbox } from "vant";
import {
  XInput,
  md5,
  Toast,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { setToken } from "@/utils/auth";
import { CURRENT_INDEX, ACCOUNT_INFO } from "@/utils/storage";
import { getVersion } from "@/api/common";
Vue.use(Checkbox);
import Utils from "@/utils/utils";
const utils = new Utils();

export default {
  name: "login",
  components: {
    XInput,
    Confirm
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      loginName: "",
      loginPwd: "",
      checked: false,
      show: false,
      versionMsg: "",
      versionURL: "",
      version:""
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    let accountInfo = this.$utils.getLocalData(ACCOUNT_INFO, true);
    console.log(accountInfo);
    if (accountInfo && accountInfo != "null" && accountInfo != null) {
      this.loginName = accountInfo.loginName;
      this.loginPwd = accountInfo.loginPwd;
      this.checked = true;
      console.log(this.loginName);
    }
    
    this.$nextTick(()=>{
      let deviceType = utils.deviceType();
      if (deviceType == "ios") {
        this.getVersion(1);
      } else if (deviceType == "android") {
        this.getVersion(2);
      }
    })
  },
  methods: {
    ...mapActions(["LOGIN"]),
    handleLogin() {
      let deviceType = utils.deviceType();
      let udid;
      // store/modules/user
      if (deviceType == "ios" && window.iosShare && window.iosShare.getUdid) {
        udid = window.iosShare.getUdid();
        // alert(udid);
      } else if (
        deviceType == "android" &&
        window.androidShare &&
        window.androidShare.getUdid
      ) {
        udid = window.androidShare.getUdid();
        // alert(udid);
      }
      // alert('参数mobileType：', deviceType)
      this.LOGIN({
        loginName: this.loginName,
        loginPwd: md5(this.loginPwd),
        udId: udid || "",
        mobileType: deviceType || ''
      }).then(res => {
        console.log(res);
        if (+res.code === 200) {
          // this.$utils.setLocalData(CURRENT_INDEX, 2);//保存本地导航栏的下标
          this.$utils.setLocalData(CURRENT_INDEX, 1);//保存本地导航栏的下标
          // 勾选了记住密码
          if (this.checked) {
            this.$utils.setLocalData(ACCOUNT_INFO, {
              loginName: this.loginName,
              loginPwd: this.loginPwd
            });
          } else {
            this.$utils.setLocalData(ACCOUNT_INFO, null);
          }
          if (deviceType == "ios" && window.iosShare) {
        window.iosShare.sendAccount(JSON.stringify({account:this.loginName}));
            // alert(udid);
          } else if (deviceType == "android" && window.androidShare) {
             window.androidShare.sendAccount(this.loginName);
          }

          this.$router.push({
            path: "/Index"
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
    getVersion(type) {
      getVersion({
        typeId: type
      }).then(res => {
        if (+res.code === 200) {
          this.version = res.data.version
          let deviceType = utils.deviceType();
          let v;
          if (deviceType == "ios") {
            v = window.iosShare.getVersion();
            if (v != res.data.version) {
              this.show = true;
              this.versionMsg = res.data.remark;
              this.versionURL = res.data.address ? res.data.address : '';
              
            }
          } else if (deviceType == "android") {
            v = window.androidShare.getVersion();
            if (v != res.data.version) {
              this.show = true;
              this.versionMsg = res.data.remark;
              this.versionURL = res.data.address ? res.data.address : '';
            }
          }
          
        }
      });
    },
    onConfirm() {
      let url = {
        url: this.versionURL
      };
        let deviceType = utils.deviceType();
      if (deviceType == "ios") {
        window.iosShare.updateVersion(JSON.stringify(url));
      } else if (deviceType == "android") {
        window.androidShare.updateVersion(this.versionURL);
      }
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  > img {
    width: 81%;
    margin-top: 13vh;
  }
  > div {
    color: #3e4198;
    font-weight: bold;
    font-size: 26px;
  }
}
.form-info {
  margin-top: 50px;
  .user {
    border: 1px solid rgba(29, 69, 155, 1);
    width: 80%;
    margin: 0 auto;
    padding: 7px 10px;
    font-size: 15px;
    border-radius: 10px;
    background-color: #fff;
  }
  .login-btn {
    margin: 0 auto;
    margin-top: 40px;
    width: 80%;
    background: #FFA41A;
    text-align: center;
    font-size: 16px;
    padding: 7px 12px;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    display: block;
  }

  .message {
    text-align: center;
    font-size: 12px;
    margin-top: 8px;
  }
}
.recordPW {
  width: 80%;
  margin: 0 auto;
  margin-top: 5px;
}
.version{
      position: absolute;
    bottom: 5vh;
    left: 0;
    right: 0;
    text-align: center;
    color: #666;
    font-size: 12px;
}
</style>