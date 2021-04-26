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
              <p class="text-h5 font-weight-bold mt-8 mb-0">{{item.money}}</p>
              <p class="text-subtitle-2 font-weight-bold">BTC收益</p>
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
              <p class="text-h5 font-weight-bold mt-8 mb-0">{{String(totalLiquidity).replace(/^(.*\..{4}).*$/,"$1")}}</p>
              <p class="text-subtitle-2 font-weight-bold">流动性份额</p>
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
              <p class="mb-0 text-caption">最大: 100</p>
              </div>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                <v-text-field
                  class="pt-0"
                  v-model="inputAdd"
                ></v-text-field>
              </div>
            </v-container>
            <v-container class="mb-5 pr-0 pt-0 pb-0">
              <div class="d-flex align-center"><p class="mb-0 text-body-2">流动性份额：</p><p class="mb-0 text-body-2">你将提供{{inputAdd}}份流动性</p></div>
            </v-container>
            <v-btn block :loading="isVerifingLoading" :disabled="isVerified" @click="handleVerify" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'white--text': 'white--text'">批准</span></v-btn>
            <v-btn block :loading="isVerifiedLoading" :disabled="!isVerified" @click="handleAddConfirm" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'white--text': 'white--text'">确定</span></v-btn>
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
              <div class="d-flex align-center justify-space-between"><p class="mb-0 text-body-2">移除份额</p><p class="mb-0 text-caption">最大: {{totalLiquidity}}</p></div>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                <v-text-field
                  class="pt-0"
                  v-model="inputRemove"
                ></v-text-field>
                <v-subheader class="pl-0 pr-0" style="padding-bottom: 23px;">
                  <v-btn color="#FF6871" @click="handleMax"><span class="white--text">最大</span></v-btn>
                </v-subheader>
              </div>
            </v-container>
            <v-btn block :loading="isLiquidityVerifingLoading" :disabled="isLiquidityVerified" @click="handleLiquidityVerify" class="rounded-lg" :outlined="isMobile" color="#FF6871" ><span :class="isMobile? 'white--text': 'white--text'">批准</span></v-btn>
            <v-btn block :loading="isLiquidityVerifiedLoading" :disabled="!isLiquidityVerified" @click="handleRemoveConfirm" class="rounded-lg" :outlined="isMobile" color="#FF6871" ><span :class="isMobile? 'white--text': 'white--text'">确定</span></v-btn>
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
      VerifingLoading:false,
      VerifiedLoading:false,
      verified:false,
      LiquidityVerifingLoading:false,
      LiquidityVerifiedLoading:false,
      LiquidityVerified:false,
    }
  },
  computed: {
    isVerified: function(){
      return this.verified;
    },
    isVerifingLoading: function(){
      return this.VerifingLoading;
    },
    isVerifiedLoading: function(){
      return this.VerifiedLoading;
    },
    isLiquidityVerified: function(){
      return this.LiquidityVerified;
    },
    isLiquidityVerifingLoading: function(){
      return this.LiquidityVerifingLoading;
    },
    isLiquidityVerifiedLoading: function(){
      return this.LiquidityVerifiedLoading;
    }
  },
  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    (async()=>{
        let settleToken = await helpers.settleTokenList;
        for(let i=0;i<settleToken.length;i++)
          this.coinType.push(settleToken[i].name);
        
        this.totalLiquidity = await helpers.getLiquilityBalance(this.$store.state.defaultAccount);
        this.coin = settleToken[0].name;
        
      })();
      this.handleGetAccout();
  },
  watch: {
    '$store.state.defaultAccount': function () {
      (async()=>{
        let settleToken = await helpers.settleTokenList;
        for(let i=0;i<settleToken.length;i++)
          this.coinType.push(settleToken[i].name);
        
        this.totalLiquidity = await helpers.getLiquilityBalance(this.$store.state.defaultAccount);
        this.coin = settleToken[0].name;    
      })();
    }
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 750
    },
    /// 刷新收益
    handleGetAccout() {
      (async()=>{
        var number = await helpers.getTotalLiabilities();
        number = String(number).replace(/^(.*\..{4}).*$/,"$1");
        number = Number(number);
        this.list[0].money = number;
      })();
    },
    /// 添加流动
    handleAdd() {
      this.isAddSHow = true
    },
    handleMax() {
      this.inputRemove = this.totalLiquidity
    },
    /// 清除流动
    handleClear() {
      this.isClearShow = true
    },
    /// 弹窗确认
    handleAddConfirm() {
      this.isAddSHow = false
      this.isClearShow = false
      
      liquidityChange(this.inputAddETH?this.inputAddETH:this.intputAddUSD)
      
      this.inputRemove = ''
      this.inputAddETH = ''
      this.inputAddUSD = ''
    },
    handleClearConfirm() {
      this.isAddSHow = false
      this.isClearShow = false
      
      liquidityChange(this.inputRemove)
      
      this.inputRemove = ''
      this.inputAddETH = ''
      this.inputAddUSD = ''
    },
    ///验证添加流动
    handleVerify(){
      (async()=>{
        this.VerifingLoading = true;
        let settleToken = await helpers.settleTokenList;
        var addr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.coin){
            addr = settleToken[i].address;
          }
        }
        
        var err,hash = helpers.approveToken(addr,this.inputAdd,this.$store.state.defaultAccount,
          (error, transactionHash)=>{
            if (error == null){
              this.verified = true;
            }
            console.log(error);
            this.VerifingLoading = false;
          });
      })();
    },
    ///验证移除流动
    handleLiquidityVerify(){
      (async()=>{
        this.LiquidityVerifingLoading = true;
        var err,hash = helpers.approveLiquidityToken(this.inputRemove,this.$store.state.defaultAccount,
          (error, transactionHash)=>{
            if (error == null){
              this.LiquidityVerified = true;
            }
            this.LiquidityVerifingLoading = false;
          });
      })();
    },
    handleAddConfirm(){
      (async()=>{
        this.VerifiedLoading = true;
        let settleToken = await helpers.settleTokenList;
        var settleAddr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.coin){
            settleAddr = settleToken[i].address;
          }
        }
        helpers.addLiquidity(settleAddr,this.inputAdd,this.$store.state.defaultAccount,(error, transactionHash)=>{
          this.VerifiedLoading = false;
          this.verified = false;
        });
      })(); 
    },
    handleRemoveConfirm(){
      (async()=>{
        this.VerifiedLoading = true;
        let settleToken = await helpers.settleTokenList;
        helpers.removeLiquidity(this.inputRemove,this.$store.state.defaultAccount,(error, transactionHash)=>{
          this.VerifiedLoading = false;
          this.verified = false;
        });
      })(); 
    }
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>