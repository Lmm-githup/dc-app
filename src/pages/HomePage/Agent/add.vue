<template>
  <div class="find-drug-container">
    <div>
      <x-header :left-options="{showBack: true,backText: ''}">
        新建
      </x-header>
      <van-cell-group style="margin-top: 10px;">
        <van-field v-model="formData.memberName" type="text" required label="顾客姓名" placeholder="请输入顾客姓名" />
        <van-field v-model="formData.memberPhone" type="text" required label="顾客电话" placeholder="请输入顾客电话" />
        <van-cell required title="是自自提"><van-checkbox v-model="formData.selfTaking">自提</van-checkbox></van-cell>
        <van-field v-model="formData.giveTime" type="text" readonly="readonly" @click="show = true" required label="送/取药时间"/>
        <van-field v-model="formData.giveAddress" v-if="!formData.selfTaking" type="text" required label="送药地址" placeholder="请输入送药地址" />
        <van-field v-model="formData.describe" type="textarea" label="描述" placeholder="请填写描述" rows="3"/>
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;">
        <div class="title"><span>照片</span>最多四张，原处方单、收银小票必填</div>
        <div class="image-list">
          <van-uploader style="vertical-align: top;width:23%;padding:1%;" :after-read="onRead1" @oversize="onOverSize" :max-size="maxSize">
            <div class="upload-box">
                <span v-if="!img1" class="van-icon van-icon-photo-o"></span>
                <span v-if="!img1">原处方单</span>
                <img  v-if="img1" :src="img1"/>
            </div>
          </van-uploader>
          <van-uploader style="vertical-align: top;width:23%;padding:1%;" :after-read="onRead2" @oversize="onOverSize" :max-size="maxSize">
            <div class="upload-box">
              <span  v-if="!img2" class="van-icon van-icon-photo-o"></span>
              <span v-if="!img2">收银小票</span>
              <img  v-if="img2" :src="img2"/>
            </div>
          </van-uploader>
          <div class="drug-img" v-for="(item, index) in drugImg" :key="index">
              <a class="van-icon van-icon-close close-icon" @click="removeImg(item, index)"></a>
              <img :src="item">
            </div>
          <van-uploader style="vertical-align: top;width:23%;padding:1%;" :after-read="onRead" @oversize="onOverSize" :max-size="maxSize" v-if="drugImg.length <2">
            <div class="upload-box">
              <span class="van-icon van-icon-photo-o"></span>
              <span>其他</span>
            </div>
          </van-uploader>
      </div>
      </van-cell-group>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      :overlay="true"
    >
      <van-datetime-picker v-model="datetime" type="datetime" :min-date="minDate" @cancel="cancel" @confirm="confirm"/>
    </van-popup>
    <van-cell-group style="margin-top: 10px;padding:10px;text-align: center;">
      <van-button type="info" :loading="loading" class="button-save" size="small" @click="submit(1)">保存</van-button>
      <van-button type="info" :loading="loading" class="button-submit" size="small" @click="submit(2)">提交</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import Vue from 'vue'
import { XHeader,dateFormat } from "vux"
import { Field, Cell, CellGroup, Uploader, Button,DatetimePicker,Checkbox,Popup } from 'vant'
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Button)
  .use(DatetimePicker)
  .use(Checkbox)
  .use(Popup)
import { Validator } from '@/utils/Validator'
import { boilMedicineApplyEdit } from '@/api/home'
import { uploadImgByBase64 } from '@/api/common'
export default {
  components: {
    XHeader,
    dateFormat
  },
  data() {
    return {
      show: false,
      loading: false,
      minDate: new Date(),
      formData: { 
        "rowNo": "",
        "memberName": "", 
        "memberPhone": "", 
        "selfTaking": "1", 
        "giveTime": "", 
        "giveAddress": "", 
        "describe": "", 
        "prescriptionImg": "",
        "smallTicketImg": "",
        "other01Img": "",
        "other02Img": "",
        "applyStatus": 1
      },
      maxSize: 1024 * 1024 * 2,
      drugImgData: [],
      drugImg: [],
      img1: "",
      img2: "",
      datetime: new Date()
    }
  },
  methods: {
    cancel(){
      this.show = false;
    },
    confirm(){
        this.show = false;
        this.formData.giveTime = dateFormat(this.datetime, "YYYY-MM-DD HH:mm:ss")
    },
    onRead(file) {
      console.log(file)
      if (this.drugImg.length >= 2) {
        this.$vux.toast.show({
          text: '超过数量限制',
          time: 2000,
          type: "text"
        })
        return
      }
      this.drugImg.push(file.content)
      let reg = /^data:image\/(jpeg|png|gif);base64,/
      let attachName = file.content.replace(reg, '')
      uploadImgByBase64({
        attachName
      }).then(res => {
        if (res.code === 200) {
          this.drugImgData.push({
            ...res.data
          })
        }
      }).finally(res => {
      })
    },
    onRead1(file) {
      this.img1 = file.content
      let reg = /^data:image\/(jpeg|png|gif);base64,/
      let attachName = file.content.replace(reg, '')
      uploadImgByBase64({
        attachName
      }).then(res => {
        if (res.code === 200) {
          this.formData.prescriptionImg =res.data.fileUrl;
        }
      }).finally(res => {
        
      })
    },
    onRead2(file) {
      this.img2 = file.content
      let reg = /^data:image\/(jpeg|png|gif);base64,/
      let attachName = file.content.replace(reg, '')
      uploadImgByBase64({
        attachName
      }).then(res => {
        if (res.code === 200) {
          this.formData.smallTicketImg = res.data.fileUrl
        }
      }).finally(res => {
        
      })
    },
    onOverSize(file) {
      this.$vux.toast.show({
        text: '图片大小超出限制！',
        time: 2000,
        type: "text"
      })
    },
    removeImg (item, index) {
      if (this.disabled) return
      this.drugImg.splice(index, 1)
      this.drugImgData.splice(index, 1)
    },
    validatorFrom ({memberName, memberPhone, giveAddress, giveTime,prescriptionImg,smallTicketImg}) {
      let validator = new Validator()
      validator.add(memberName, [
        {strategy: 'isNoEmpty',errorMsg:'顾客姓名不能为空'}
      ])
      validator.add(memberPhone, [
        {strategy: 'isNoEmpty',errorMsg:'顾客手机号不能为空'}
      ])
      /*validator.add(giveAddress, [
        {strategy: 'isNoEmpty',errorMsg:'送药地址不能为空'}
      ])*/
      validator.add(giveTime, [
        {strategy: 'isNoEmpty',errorMsg:'送/取药时间不能为空'}
      ])
      validator.add(prescriptionImg, [
        {strategy: 'isNoEmpty',errorMsg:'原处方单不能为空'}
      ])
      validator.add(smallTicketImg, [
        {strategy: 'isNoEmpty',errorMsg:'收银小票不能为空'}
      ])
      return validator.start()
    },
    submit (status) {
      this.loading = true;
      let errorMsg = this.validatorFrom(this.formData)
      if (errorMsg) {
        this.$vux.toast.show({
          text: errorMsg,
          time: 2000,
          type: "text"
        })
        this.loading = false;
        return
      }
      if(!this.formData.selfTaking && !this.formData.giveAddress){
          this.$vux.toast.show({
          text: '送药地址不能为空',
          time: 2000,
          type: "text"
        })
        return
      }
      if(this.drugImgData.length == 1){
        this.formData.other01Img = this.drugImgData[0].fileUrl;
      }
      if(this.drugImgData.length == 2){
        this.formData.other01Img = this.drugImgData[0].fileUrl;
        this.formData.other02Img = this.drugImgData[1].fileUrl;
      }
      this.formData.selfTaking = this.formData.selfTaking ? "1" : "0";
      this.formData.applyStatus = status;
      boilMedicineApplyEdit(this.formData).then(res => {
        this.loading = false;
        if (res.code === 200) {
          this.$vux.toast.show({
            text: '操作成功!',
            time: 2000,
            type: "text"
          })
          this.$router.go(-1)
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.find-drug-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title{
  padding:10px;
  padding-left:15px;
  font-size:12px;
  color:#999;
  span{
    font-size:14px;
    color:#000;
    font-weight:500;
    padding-right:10px;
  }
}
.image-list{
  display:flex;
  padding:8px;
}
.upload-box {
  font-size: 12px;
  color: #999;
  width: 100%;
  height: 75px;
  
  text-align: center;
  border: 1px dashed #ccc;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e4e4e4;
  .van-icon {
    font-size: 32px;
  }
  img{
    width:100%;
    height:100%;
  }
}
.drug-img-container {
  flex:1;
  flex-wrap: wrap;
}
.drug-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23%;
  height: 75px;
  padding: 1%;
  box-sizing: border-box;
  position: relative;
  // margin: 20px 20px 0;
  .close-icon {
    position: absolute;
    right: -3px;
    top: 0;
    font-size: 16px;
    z-index: 9;
    color: #f44;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.button-save{
  width:30%;
  margin-right:5%;
  background:#312640;
  border:#312640;
}
.button-submit{
  width:30%;
  margin-left:5%;
  background:#312640;
  border:#312640;
  
}

</style>
<style>
.van-field__control{
  text-align:right !important;
}
</style>
