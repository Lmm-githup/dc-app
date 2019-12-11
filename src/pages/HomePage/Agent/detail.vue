<template>
  <div class="find-drug-container">
    <div>
      <x-header :left-options="{showBack: true,backText: ''}">
        代煎中药
      </x-header>
      <van-cell-group style="margin-top: 10px;">
        <van-cell title="提交时间" :value="formData.applyDate | dateFormat" />
        <van-cell title="门店名称" :value="formData.applyStoreName"/>
        <van-cell title="机构号" :value="formData.applyStoreCrmId" />
        <van-cell title="顾客姓名" :value="formData.memberName"/>
        <van-cell title="顾客电话" :value="formData.memberPhone" />
        <van-cell title="是否自取" :value="formData.selfTaking == 1 ? '是' : '否'"/>
        <van-cell title="取/送药时间" :value="formData.giveTime" />
        <van-cell title="送药地址" v-if="formData.giveAddress" :value="formData.giveAddress"/>
        <van-cell title="描述" v-if="formData.describe" :value="formData.describe"/>
        <van-cell title="拒绝原因" v-if="formData.explain" :value="formData.explain"/>
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;">
        <div class="title"><span>照片</span></div>
        <div class="drug-img-container">
          <div class="drug-img" @click="preview(0)">
            <div><img :src="formData.prescriptionImg"></div>
            <div class="img-title">处方原单</div>
          </div>
          <div class="drug-img" @click="preview(1)">
            <div><img :src="formData.smallTicketImg"></div>
            <div class="img-title">收银小票</div>
          </div>
          <div class="drug-img" @click="preview(index+2)" v-for="(item, index) in formData.imgList" :key="index">
            <div><img :src="item"></div>
            <div class="img-title">照片</div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <van-dialog
      v-model="show"
      title="拒绝原因"
      show-cancel-button
      @confirm="confirmReject"
    >
      <van-field v-model="reason" type="textarea" placeholder="请填写拒绝原因" rows="5"/>
    </van-dialog>
    <van-cell-group style="margin-top: 10px;padding:10px;text-align: center;">
      <van-button type="info" class="button-save" v-if="formData.applyStatus == 2 && formData.roleId == 2" size="small" @click="access">接受</van-button>
      <van-button type="info" class="button-save" v-if="formData.applyStatus == 2 && formData.roleId == 2" size="small" @click="reject">拒绝</van-button>
      <van-button type="info" class="button-save" v-if="formData.applyStatus == 3 && formData.roleId == 2" size="small" @click="finish">完成</van-button>
      <van-button type="info" class="button-save" v-if="formData.applyStatus == 1 && formData.roleId == 1" size="small" @click="commit">提交</van-button>
      <van-button type="info" class="button-save" v-if="formData.applyStatus == 2 && formData.roleId == 1" size="small" @click="withdraw">撤回</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import Vue from 'vue'
import { XHeader } from "vux"
import { Field, Cell, CellGroup, Uploader, Button,Dialog,ImagePreview,Swipe } from 'vant'
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Button)
  .use(Dialog)
  .use(ImagePreview)
  .use(Swipe)
import { Validator } from '@/utils/Validator'
import { boilMedicineApplyDetail,boilMedicineApplyEdit } from '@/api/home'
import { uploadImgByBase64 } from '@/api/common'
export default {
  name: "agentDetail",
  components: {
    XHeader
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.getInfo();
  },
  data() {
    return {
      formData: {
        imgList: []
      },
      submitForm: {
        rowNo: '',
        applyStatus: '',
        explain: '',
      },
      show: false,
      reason: ""
    }
  },
  methods: {
    preview(index){
      let imgs = [];
      imgs.push(this.formData.prescriptionImg);
      imgs.push(this.formData.smallTicketImg);
      if(this.formData.other01Img){
         imgs.push(this.formData.other01Img);
      }
      if(this.formData.other02Img){
         imgs.push(this.formData.other02Img)
      }
      ImagePreview({
        images: imgs,
        startPosition: index,
        onClose() {
        }
      });
    },
    async getInfo() {
      boilMedicineApplyDetail({
        id: this.id
      }).then(res => {
        if (res.code === 200) {
           this.formData = res.data;
           this.formData.imgList = [];
           if(this.formData.other01Img){
             this.formData.imgList.push(this.formData.other01Img);
           }
           if(this.formData.other02Img){
             this.formData.imgList.push(this.formData.other02Img)
           }
           this.submitForm.rowNo = this.formData.rowNo;
        } else {
          this.$vux.toast.show({
            text: res.msg,
            time: 2000,
            type: "text"
          })
        }
      })
    },
    //提交
    commit(){
      Dialog.confirm({
        title: '提示',
        message: '确定要提交吗？'
      }).then(() => {
        this.submitForm.applyStatus = 2;
        this.opertion();
      }).catch(() => {
      });
    },
    //接受
    access() {
      Dialog.confirm({
        title: '提示',
        message: '确定要接受吗？'
      }).then(() => {
        this.submitForm.applyStatus = 3;
        this.opertion();
      }).catch(() => {
      });
    },
    //拒绝
    reject(){
      this.show = true;
    },
    //撤回
    withdraw(){
      Dialog.confirm({
        title: '提示',
        message: '确定要撤回吗？'
      }).then(() => {
        this.submitForm.applyStatus = 1;
        this.opertion();
      }).catch(() => {
      });
    },
    //完成
    finish(){
      Dialog.confirm({
        title: '提示',
        message: '确定要完成吗？'
      }).then(() => {
        this.submitForm.applyStatus = 5;
        this.opertion();
      }).catch(() => {
      });
    },
    confirmReject(){
      if(!this.reason){
        this.$vux.toast.show({
            text: '请填写拒绝原因',
            time: 2000,
            type: "text"
          })
          return;
      }
      this.submitForm.applyStatus = 4;
      this.submitForm.explain = this.reason;
      this.opertion();
    },
    opertion () {
      boilMedicineApplyEdit(this.submitForm).then(res => {
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
.upload-box {
  font-size: 12px;
  color: #999;
  width: 75px;
  height: 75px;
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom:5px;
  text-align: center;
  border: 1px dashed #ccc;
  display: flex;
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
  flex-wrap: wrap;
  height: 120px;
}
.drug-img {
  text-align:center;
  justify-content: center;
  align-items: center;
  float:left;
  width: 25%;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .img-title{
    font-size:12px;
    text-align: center;
  }
}
.button-save{
  background:#312640 !important;
  width:25%;
  margin-right:3%;
  margin-left: 3%;
}
</style>
