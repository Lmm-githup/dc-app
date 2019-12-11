<template>
  <div class="container">
    <x-header :left-options="{showBack: true,backText: ''}" class="header"></x-header>
     
     
    <div class="qrcode-box">
      <img :src="imgUrl" class="qrcode" alt="">
     <div class="name">{{name}}</div>
    </div>
  </div>
</template>

<script>
import QRcode from '@/assets/images/console/u1932.png';
import { XHeader } from "vux";
import {invitation} from "@/api/home";
import { USER_INFO } from "@/utils/storage";
export default {
  components: {
    XHeader
  },
  data(){
    return {
      QRcode,
      imgUrl: '',
      name: ''
    }
  },
  mounted () {
    invitation().then(res =>{
      if (res.code == 200) {
        this.imgUrl = res.data.imgUrl
      }
    })
    this.name = this.$utils.getLocalData(USER_INFO,true).userName
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:#443557;
  //background: url('../../assets/images/bgi.jpg') no-repeat;
  //background-size: 100% 100%;
  position: relative;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: transparent!important;
    /deep/ .left-arrow {
      &::before {
        border-color: #fff;
      }
    }
  }

  .qrcode {
    width: 225px;
    height: 225px;
    border-radius: 15px;
  }
  .qrcode-box {
    width: 226px;
    height: 241px;
    // background-color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;
    .name{
      color: #fff;
      font-size: 18px;
      margin-top: 5px;
    }
  }
}
</style>
