<template>
    <div class="pl-3 pr-3" style="padding-top: 70px;">
      <v-container style="min-height:calc(100vh - 120px);" class="pt-0 pb-0">
        <v-container class="pl-0 pr-0">
          <p class="text-subtitle-1 font-weight-bold text-center">提供流动性，挖矿平台币</p>
          <v-container class="d-flex align-center justify-center pb-0" v-if="false">
            <p class="font-weight-bold text-center" :style="!isMobile?'font-size: 24px':'font-size: 18px'">BTC收益</p>
            <p class="font-weight-bold text-center ml-10 mr-10" :style="!isMobile?'font-size: 24px':'font-size: 18px'">370.63</p>
            <v-hover v-slot="{ hover }">
              <v-container @click="handleGetAccout" class="pl-0 pr-0 pt-0 pb-0 ml-0 mr-0 mb-5 text-center" 
                :style="isMobile? 'width: 70px;box-shadow: 0 3px 6px rgba(0,0,0,.2); height: 30px; line-height: 30px; background: #FFFFCC; color: #d16c00; border:1px solid #FFFFCC; border-radius: 5px; ': 
                hover?'width: 100px; height: 40px;box-shadow: 0 3px 6px rgba(0,0,0,.2); line-height: 40px; background: #e9e9b9; color: #d16c00; border:1px solid #e9e9b9; border-radius: 10px; cursor: pointer;':
                'box-shadow: 0 3px 6px rgba(0,0,0,.2); width: 100px; height: 40px; line-height: 40px; color: #d16c00; background: #FFFFCC; border:1px solid #FFFFCC; border-radius: 10px; cursor: pointer;'"><strong>刷新收益</strong></v-container>
            </v-hover>
          </v-container>
          <!-- <v-divider></v-divider> -->
        </v-container>
        <v-container class="d-flex align-center justify-center flex-wrap" v-for="(item, index) in list" :key="index">
          <v-container class="d-flex align-center flex-column mb-5" 
            :style="isMobile?'background: #fcfcdb; width: 100%; box-shadow: 0 3px 6px rgba(0,0,0,.08); border: 1px solid #fff4e4; border-radius: 10px;':
            'background: #fcfcdb; box-shadow: 0 3px 6px rgba(0,0,0,.08); width: 30%; margin: 0 1.666%; border: 1px solid #fff4e4; border-radius: 10px;'">
              <img style="width: 80px; height: 80px;" src="../assets/avatar.jpg" alt="img">
              <p class="text-h5 font-weight-bold mt-8 mb-0">0<!--{{item.money}}--></p>
              <p class="text-subtitle-2 font-weight-bold">CBBC收益</p>
              <div class="d-flex align-center justify-center">
                <v-hover v-slot="{ hover }">
                  <v-container 
                    @click="handleGetAccout" 
                    class="pl-0 pr-0 pt-0 pb-0 ml-0 mr-0 mb-5 text-center mr-5" 
                    :style="
                      isMobile? 'width: 85px; height: 35px; line-height: 35px; font-size: 12px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 5px; ': 
                      hover?'width: 100px; height: 40px; line-height: 40px; font-size: 14px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 10px; cursor: pointer;':
                      'width: 100px; height: 40px; line-height: 40px; font-size: 14px; color: #fff; background: #0483FF; border:1px solid #0483FF; border-radius: 10px; cursor: pointer;'">
                      刷新收益</v-container>
                </v-hover>
              </div>
          </v-container>

          <v-container class="d-flex align-center flex-column mb-5" 
            :style="isMobile?'background: #fcfcdb; width: 100%; box-shadow: 0 3px 6px rgba(0,0,0,.08); border: 1px solid #fff4e4; border-radius: 10px;':
            'background: #fcfcdb; box-shadow: 0 3px 6px rgba(0,0,0,.08); width: 30%; margin: 0 1.666%; border: 1px solid #fff4e4; border-radius: 10px;'">
              <img style="width: 80px; height: 80px;" src="../assets/avatar.jpg" alt="img">
              <p class="text-h5 font-weight-bold mt-8 mb-0">{{to4DecimalString(totalLiquidity)}}<span style="font-size:0.9rem"> 流动性份额</span></p>
              <p class="text-subtitle-2 font-weight-bold">您拥有总流动性份额的{{liquidityPercentage}}%</p>
              <div class="d-flex align-center justify-center">
                <v-hover v-slot="{ hover }">
                  <v-container 
                    @click="handleAdd" 
                    class="pl-0 pr-0 pt-0 pb-0 ml-0 mr-0 mb-5 text-center mr-5" 
                    :style="
                      isMobile? 'width: 85px; height: 35px; line-height: 35px; font-size: 12px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 5px; ': 
                      hover?'width: 100px; height: 40px; line-height: 40px; font-size: 14px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 10px; cursor: pointer;':
                      'width: 100px; height: 40px; line-height: 40px; font-size: 14px; color: #fff; background: #0483FF; border:1px solid #0483FF; border-radius: 10px; cursor: pointer;'">
                      添加流动性</v-container>
                </v-hover>
                <v-hover v-slot="{ hover }">
                  <v-container 
                    @click="handleClear" 
                    class="pl-0 pr-0 pt-0 pb-0 ml-0 mr-0 mb-5 text-center" 
                    :style="
                      isMobile? 'width: 85px; height: 35px; line-height: 35px; font-size: 12px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 5px; ': 
                      hover?'width: 100px; height: 40px; line-height: 40px; font-size: 14px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 10px; cursor: pointer;':
                      'width: 100px; height: 40px; line-height: 40px; font-size: 14px; color: #fff; background: #FF6871; border:1px solid #FF6871; border-radius: 10px; cursor: pointer;'">
                      移除流动性</v-container>
                </v-hover>
              </div>
          </v-container>
        </v-container>

      </v-container>
      <v-dialog
        v-model="isAddSHow"
        overlay-color="rgba(91, 57, 38, 0.667)"
        :width="isMobile? '': '520px'"
      >
        <v-card style="background: #FFFFF0;">
          <v-container class="text-center font-weight-bold textColor--text text-h6">添加流动性</v-container>
          <v-container class="pl-3 pr-3 pb-5">
             <v-container class="mb-5" style="border: 1px solid rgb(226, 214, 207); box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; border-radius: 15px;">
              <div class="d-flex align-center justify-space-between">
              <v-select
                  :items="coinType"
                  v-model="coin"
                  dense
                ></v-select>
              <p class="mb-0 text-caption">余额: {{to4DecimalString(settleBalance)}}</p>
              </div>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                <v-text-field
                  class="pt-0"
                  v-model="inputAdd"
                ></v-text-field>
                <v-subheader class="pl-0 pr-0" style="padding-bottom: 23px;">
                  <v-btn color="#0483FF" @click="handleAddMax"><span class="white--text">最大</span></v-btn>
                </v-subheader>
              </div>
              
            </v-container>
            <v-container class="mb-5 pr-0 pt-0 pb-0">
              <!-- <div class="d-flex align-center"><p class="mb-0 text-body-2">流动性份额：</p><p class="mb-0 text-body-2">你将提供份流动性</p></div> -->
            </v-container>
            <v-btn block :loading="isVerifingLoading" v-show="!isVerified" @click="handleAddVerify" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'bearColor--text': 'white--text'">批准</span></v-btn>
            <v-btn block :loading="isVerifiedLoading" :disabled="!isVerified" @click="handleAddConfirm" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'bearColor--text': 'white--text'">确定</span></v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isClearShow"
        overlay-color="rgba(91, 57, 38, 0.667)"
        :width="isMobile? '': '520px'"
      >
        <v-card style="background: #FFFFF0;">
          <v-container class="text-center font-weight-bold textColor--text text-h6">移除流动性</v-container>
          <v-container class="pl-3 pr-3 pb-5">
             <v-container class="mb-5" style="border: 1px solid rgb(226, 214, 207); box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; border-radius: 15px;">
              <div class="d-flex align-center justify-space-between">
              <v-select
                  :items="liquityType"
                  v-model="liquityChoose"
                  dense
                ></v-select>
              <p class="mb-0 text-caption">持有份额: {{to4DecimalString(liquidityNumber)}}</p>
              </div>
              <v-divider></v-divider>
              <p class="mb-0 text-body-2">移除比例</p>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 46px;">
                <v-subheader class="pl-0 pr-0">0</v-subheader>
                <v-slider
                  max="100"
                  min="0"
                  v-model="slider1"
                  :thumb-size="18"
                  thumb-label="always"
                ></v-slider>
                <v-subheader class="pl-0 pr-0">100</v-subheader>
              </div>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                <v-text-field
                  class="pt-0"
                  v-model="inputRemove"
                ></v-text-field>
                <v-subheader class="pl-0 pr-0" style="padding-bottom: 23px;">
                  <v-btn color="#FF6871" @click="handleClearMax"><span class="white--text">最大</span></v-btn>
                </v-subheader>
              </div>
            </v-container>
            <v-btn block :loading="isremoveVerifingLoading" v-show="!isclearVerified" @click="handleClearVerify" class="rounded-lg" :outlined="isMobile" color="#FF6871" ><span :class="isMobile? 'bullColor--text': 'white--text'">批准</span></v-btn>
            <v-btn block :loading="isclearVerifiedLoading" :disabled="!isclearVerified" @click="handleRemoveConfirm" class="rounded-lg" :outlined="isMobile" color="#FF6871" ><span :class="isMobile? 'bullColor--text': 'white--text'">确定</span></v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
            v-model="isShowConfirmDialog"
            overlay-color="rgba(91, 57, 38, 0.667)"
            :width="isMobile? '': '520px'"
          >
            <v-card style="background: rgb(240, 233, 231);">
              <v-container class="text-center font-weight-bold textColor--text text-h6">交易成功</v-container>
              <v-container class="pl-5 pr-5 pb-5">
                  <v-btn width="100%" class="rounded-lg mb-3" large color="btnColor"   @click="handleViewOnEarthscan"  >在HecoInfo上查看</v-btn>
                  <v-btn width="100%" class="rounded-lg mb-3" large color="btnColor"   @click="handSuccessConfirm"  >确定</v-btn>
              </v-container>
            </v-card>
          </v-dialog>
      <v-footer></v-footer>
    </div>
</template>
<script>
import vFooter from '@/components/Footer.vue'
import helpers from '../helpers'


export default {
  name: 'Tab3',
  components: {
    vFooter
  },
  data () {
    return{
      isShowDialog: false,
      isMobile: false,
      totalLiquidity:0,
      list: [
        { imgUrl: '', money: '0.00',  },
      ],
      coinType:[],
      isAddSHow: false,
      isClearShow: false,
      inputAdd: '',
      inputRemove: '',
      coin:'',
      addVerifingLoading:false,
      addVerifiedLoading:false,
      addVerified:false,
      clearVerifingLoading:false,
      clearVerifiedLoading:false,
      clearVerified:false,
      signature:{},
      deadline:0,
      settleBalance:0,
      liquity:[],
      liquidityPercentage:0,
      liquityType:[],
      liquityChoose:'',
      liquidityNumber:0,
      AddAllow:0,
      slider1:0,
      isShowConfirmDialog:false,
    }
  },
  computed: {
    isVerified: function(){
      return this.addVerified;
    },
    isVerifingLoading: function(){
      return this.addVerifingLoading;
    },
    isVerifiedLoading: function(){
      return this.addVerifiedLoading;
    },
    isclearVerified: function(){
      return this.clearVerified;
    },
    isremoveVerifingLoading: function(){
      return this.clearVerifingLoading;
    },
    isclearVerifiedLoading: function(){
      return this.clearVerifiedLoading;
    }
  },
  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    this.handleRefreshData();
    this.handleGetAccout();
  },
  watch: {
    '$store.state.defaultAccount': function () {
      (async()=>{
        let settleToken = await helpers.settleTokenList;
        for(let i=0;i<settleToken.length;i++)
          this.coinType.push(settleToken[i].name);
        
        let tokenLiquity = await helpers.getLiquilityBalance(this.$store.state.defaultAccount);
        // let ETHLiquity = await helpers.getETHLiquilityBalance(this.$store.state.defaultAccount);

        this.totalLiquidity = helpers.to4DecimalString(tokenLiquity); // + ETHLiquity);
        this.coin = settleToken[0].name;    
      })();
    },
    coin(val){
      (async()=>{
        if (val == 'ETH'){
          // await helpers.getETHBalance(this.$store.state.defaultAccount,(balance)=>{
          //       this.settleBalance = helpers.to4DecimalString(balance);
          //   });
          //   this.addVerified = true;
        }else{
          let settleToken = await helpers.settleTokenList;
          this.addVerified = false;
          var addr = "";
          for(let i=0;i<settleToken.length;i++){
            if(settleToken[i].name == this.coin){
              addr = settleToken[i].address;
            }
          }
          this.settleBalance = await helpers.getBalance(addr,this.$store.state.defaultAccount);
          this.AddAllow = await helpers.allowance(addr,this.$store.state.defaultAccount);
        }
      })();
    },
    liquityChoose(val){
      for(var i =0;i<this.liquityType.length;i++){
        if (this.liquityType[i] == val){
          this.liquidityNumber = this.liquity[i];
        }
      }
    },
    inputAdd(val){
      if (this.settle != 'ETH'){
        if (Number(val)>Number(this.AddAllow)){
          this.addVerified = false;
        }else{
          this.addVerified = true;
        }
      }
    },
    slider1(val){
      this.inputRemove = Math.floor((val/100)*this.liquidityNumber*10000)/10000;
    }
  
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 750
    },
    /// 刷新收益
    handleGetAccout() {
      (async()=>{
        // var number = await helpers.getTotalLiabilities();
        // number = helpers.to4DecimalString(number);
        // number = Number(number);
        // this.list[0].money = number;
      })();
    },
    handleRefreshData(){
      (async()=>{
        let settleToken = await helpers.settleTokenList;
        let tokenLiquity = await helpers.getLiquilityBalance(this.$store.state.defaultAccount);
        let totalLiquidity = await helpers.getTotalSupply();
        this.liquidityPercentage = (tokenLiquity/totalLiquidity * 100).toFixed(2);
        // let ETHLiquity = await helpers.getETHLiquilityBalance(this.$store.state.defaultAccount);

        for(let i=0;i<settleToken.length;i++){
          this.coinType.push(settleToken[i].name);
          this.liquityType.push(settleToken[i].name);
          this.liquity.push(tokenLiquity);
        }

        // this.coinType.push('ETH'); 
        // this.liquityType.push('ETH');
        // this.liquity.push(ETHLiquity);
        this.liquidityNumber = tokenLiquity;
        this.liquityChoose = settleToken[0].name;
        
        this.totalLiquidity = Number(tokenLiquity); // + Number(ETHLiquity);
        this.coin = settleToken[0].name;
        this.settleBalance = await helpers.getBalance(settleToken[0].address,this.$store.state.defaultAccount);
      })();
    },/// 添加流动
    handleAdd() {
      this.isAddSHow = true
    },
    handleAddMax() {
      this.inputAdd = this.settleBalance
    },
    handleClearMax() {
      (async () => {    
      console.log(await helpers.getLiquilityBalance(this.$store.state.defaultAccount));
      })();
      this.inputRemove = this.liquidityNumber;
    },
    /// 清除流动
    handleClear() {
      this.isClearShow = true
    },
    ///验证添加流动
    handleAddVerify(){
      (async()=>{
        this.addVerifingLoading = true;
        let settleToken = await helpers.settleTokenList;
        var addr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.coin){
            addr = settleToken[i].address;
          }
        }
        
        var err,hash = helpers.approveToken(addr,this.settleBalance,this.$store.state.defaultAccount,
          (error, transactionHash)=>{
            if (error != null){
              console.log(error);
              this.addVerifingLoading = false;
            }
            
          },(confNumber, receipt)=>{
            this.addVerified = true;
            this.addVerifingLoading = false;
          });
      })();
    },
    ///验证移除流动
    handleClearVerify(){
      (async()=>{
        this.clearVerifingLoading = true;
        if (this.liquityChoose == 'ETH'){
          // helpers.getLiquiditySignatureETH(this.inputRemove,this.$store.state.defaultAccount,
          // (error, permitData, deadline)=>{
          //   if(error != null) {
          //     console.log(error);
          //     this.clearVerifingLoading = false;
          //   }
          //   else {
          //     this.signature = permitData;
          //     this.deadline = deadline;
          //     this.clearVerified = true;
          //     this.clearVerifingLoading = false;
          //   }
          // })
        }else{
          helpers.getLiquiditySignature(this.inputRemove,this.$store.state.defaultAccount,
          (error, permitData, deadline)=>{
            if(error != null) {
              console.log(error);
              this.clearVerifingLoading = false;
            }
            else {
              this.signature = permitData;
              this.deadline = deadline;
              this.clearVerified = true;
              this.clearVerifingLoading = false;
            }
          })
        }
        
      })();
    },
    handleViewOnEarthscan(){
      var id = this.$store.state.defaultAccount;
      // var chain = this.chainMap.get(this.$store.state.defaultChainId);
      var url = "https://hecoinfo.com/address/" + id;
      window.open(url);
    },
    handSuccessConfirm(){
      this.isShowConfirmDialog=false;
    },
    handleAddConfirm(){
      (async()=>{
        this.addVerifiedLoading = true;
        if(this.coin=='ETH'){
          helpers.addLiquidityETH(this.inputAdd,this.$store.state.defaultAccount,this.handleTXCallBack,this.handleAddTXConfirmCallBack);
        }else{
          let settleToken = await helpers.settleTokenList;
          var settleAddr = "";
          for(let i=0;i<settleToken.length;i++){
            if(settleToken[i].name == this.coin){
              settleAddr = settleToken[i].address;
            }
          }
          helpers.addLiquidity(settleAddr,this.inputAdd,this.$store.state.defaultAccount,this.handleTXCallBack,this.handleAddTXConfirmCallBack);
        }
        
      })(); 
    },
    handleRemoveConfirm(){
      (async()=>{
        this.clearVerifiedLoading = true;
        if (this.liquityChoose == 'ETH'){
          helpers.removeLiquidityETHWithPermit(this.inputRemove,this.$store.state.defaultAccount,this.signature,this.deadline,this.handleTXCallBack,this.handleClearTXConfirmCallBack);
        }else{
          let settleToken = await helpers.settleTokenList;
          var settleAddr = "";
          for(let i=0;i<settleToken.length;i++){
            if(settleToken[i].name == this.liquityChoose){
              settleAddr = settleToken[i].address;
            }
          }
          helpers.removeLiquidityWithPermit(settleAddr,this.inputRemove,this.$store.state.defaultAccount,this.signature,this.deadline,this.handleTXCallBack,this.handleClearTXConfirmCallBack);
        }  
      })(); 
    },
    handleAddTXConfirmCallBack(confNumber, receipt){
      this.addVerifiedLoading = false;
      this.addVerified = false;
      if (confNumber == 0){
        this.isAddSHow = false;
        this.isShowConfirmDialog=true;
        this.handleRefreshData();
      }
    },
    handleTXCallBack(error, transactionHash){
      if (error!= null){
        console.log(error);
        this.addVerifiedLoading = false;
      }
      
    },
    handleClearTXConfirmCallBack(confNumber, receipt){
        this.clearVerifiedLoading = false;
        this.clearVerified = false;
        
        if (confNumber == 0){
          this.isClearShow = false;
          this.isShowConfirmDialog=true;
          this.handleRefreshData();
        }
    },
    to4DecimalString(number) {
      return String(Math.floor(parseFloat(number)*10000)/10000);
    }
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>