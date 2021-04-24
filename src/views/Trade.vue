<template>
    <div class="pl-3 pr-3" style="padding-top: 70px;">
      <!-- <v-header></v-header> -->
      <div class="main pt-8" 
        :style="isMobile?'height:calc(100vh - 70px); overflow: scroll; position: relative; display: flex; align-item: center; flex-direction: column; justify-content: space-between;':
        'height:calc(100vh - 70px); position: relative; display: flex; align-item: center; flex-direction: column; justify-content: space-between;'">
        <div class="content" :style="isMobile?'width: 90%; margin-left: 5%;':'width: 400px; margin: 0 auto;'">
          <div class="tabs d-flex align-center justify-center">
            <v-hover v-for="(item, index) in tabs" :key="index" v-slot="{ hover }">
              <div 
                :class="isMobile? 'text-sm-body-2 font-weight-bold mr-5': index === 0?'text-h6 font-weight-bold mr-5':'text-h6 font-weight-bold'" 
                @click="handleTabChange(index)"
                :style="
                  currentIndex === index
                  ? (currentIndex == 0 ? 
                    'border-bottom: 4px solid #FF6871;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px; color: #FF6871; cursor: pointer'
                    : 'border-bottom: 4px solid #0483FF;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px; color: #0483FF; cursor: pointer')
                  : 'cursor: pointer'
                  "
                >{{item.label}}</div>
            </v-hover>
          </div>
          <div style="background: #f9f9f9; border-radius: 20px;">
            <v-card class="pl-5 pr-5 pt-5 pb-5 mt-5" width="100%" style="background: #fcfcdb;border-radius: 20px;">
            <v-form ref="form">
              <v-container class="mb-5" style="border: 1px solid #f6f6f6; border-radius: 15px;">
                <p class="mb-0 text-subtitle-1 font-weight-bold">标的</p>
                <v-select
                  :items="items"
                  v-model="trade"
                  dense
                ></v-select>
              </v-container>
              <v-container class="mb-5" style="border: 1px solid #f6f6f6; border-radius: 15px;">
                <div class="d-flex align-center justify-space-between"><p class="mb-0 text-subtitle-1 font-weight-bold">初始投资</p><p class="mb-0 text-caption">余额：{{Balance}}</p></div>
                <div class="d-flex align-center justify-space-between" style="height: 44px;">
                  <v-text-field
                    class="pt-0"
                    v-model="input1"
                    style="width: 65%;"
                  >
                  </v-text-field>
                  <v-divider></v-divider>
                  <v-select
                    :items="currencies"
                    v-model="settle"
                    dense
                    style="width: 25%;"
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item }}
                        </span>
                      </template>
                    </v-select>
                </div>
              </v-container>
              <v-container class="mb-5" style="border: 1px solid #f6f6f6; border-radius: 15px;">
                <p class="mb-0 text-subtitle-1 font-weight-bold">杠杆倍数</p>
                <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                  <v-slider
                    :tick-labels="ticksLabels"
                    :max="3"
                    step="1"
                    ticks="always"
                    tick-size="4"
                    v-model="ticks"
                  ></v-slider>
                </div>
              </v-container>
              <v-container class="pt-0 pb-0 d-flex align-center justify-center">
                <v-btn :loading="isVerifingLoading" :disabled="isVerified" @click="handleVerify" style="width: 40%;" class="rounded-lg" :outlined="isMobile" :color="currentIndex === 0? '#FF6871':'#0483FF'" ><span :class="isMobile? (currentIndex === 0? 'bullColor--text':'bearColor--text'): 'white--text'">批准</span></v-btn>
                <v-btn :loading="isVerifiedLoading" :disabled="!isVerified" @click="handleSubmit" style="width: 40%;" class="rounded-lg" :outlined="isMobile" :color="currentIndex === 0? '#FF6871':'#0483FF'" ><span :class="isMobile? (currentIndex === 0? 'bullColor--text':'bearColor--text'): 'white--text'">开仓</span></v-btn>
              </v-container>          
            </v-form>
          </v-card>
          <v-container width="100%" v-if="false">
            <div style="line-height: 1.5rem; color: #767676de;" class="d-flex text-overline justify-space-between"><p class="mb-0">当前价格:</p> <p class="mb-0 black--text">615 UDST</p></div>
            <div style="line-height: 1.5rem; color: #767676de;" class="d-flex text-overline justify-space-between"><p class="mb-0">高清算价:</p> <p class="mb-0 black--text">615 UDST</p></div>
            <div style="line-height: 1.5rem; color: #767676de;" class="d-flex text-overline justify-space-between"><p class="mb-0">低清算价:</p> <p class="mb-0 black--text">615 UDST</p></div>
          </v-container>
          </div>
          
        </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import vHeader from '@/components/Header.vue'
import helper from "../helpers"
export default {
  name: 'Home',
  data: () => ({
    isMobile: true,
    tabs: [{ label: "牛证开仓" }, { label: "熊证开仓" }],
    currentIndex: 0,
    items: [],
    currencies: [],
    ticksLabels: ["10", "20", "50", "100"],
    input1: '',
    verified:false,
    settle:'',
    trade:'',
    ticks:'',
    VerifingLoading:false,
    VerifiedLoading:false,
    Balance:0,
  }),
  watch:{
    settle(val){
      (async()=>{
        let settleToken = await helper.settleTokenList;
        var addr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.settle){
            addr = settleToken[i].address;
          }
        }
        this.Balance = await helper.getBalance(addr,this.$store.state.defaultAccount);
        console.log(this.Balance);
      })();
    }
  },
  components: {
    vHeader
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
    }
  },
   mounted () {
      this.onResize();
      window.addEventListener('resize', this.onResize, { passive: true });
      (async()=>{
        let settleToken = await helper.settleTokenList;
        let tradeToken = await helper.tradeTokenList;
        for(let i=0;i<settleToken.length;i++)
          this.currencies.push(settleToken[i].name);
        for(let i=0;i<tradeToken.length;i++)
          this.items.push(tradeToken[i].name);
        
        this.settle = settleToken[0].name;
        this.trade = tradeToken[0].name;

        this.Balance = await helper.getBalance(settleToken[0].address,this.$store.state.defaultAccount);
      })();
      
  },
  methods: {
    handleTabChange(index) {
      this.currentIndex = index
    },
    onResize () {
      this.isMobile = window.innerWidth < 750
      console.log(window.innerWidth)
    },
    handleVerify(){
      (async()=>{
        
        this.VerifingLoading = true;
        let settleToken = await helper.settleTokenList;
        var addr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.settle){
            addr = settleToken[i].address;
          }
        }
        console.log(this.$store.state.defaultAccount)
        var err,hash = helper.approveToken(addr,this.input1,this.$store.state.defaultAccount,
          (error, transactionHash)=>{
            if (error == null){
              this.verified = true;
              console.log(hash);
            }
            console.log(error);
            this.VerifingLoading = false;
          });
      })();
    },
    handleSubmit(){
      (async()=>{
        
        this.VerifiedLoading = true;
        var trickNumber = this.ticksLabels[this.ticks];
        let settleToken = await helper.settleTokenList;
        var settleAddr = "";
        for(let i=0;i<settleToken.length;i++){
          if(settleToken[i].name == this.settle){
            settleAddr = settleToken[i].address;
          }
        }

        let tradeToken = await helper.tradeTokenList;
        var tradeAddr = "";
        for(let i=0;i<tradeToken.length;i++){
          if(tradeToken[i].name == this.trade){
            tradeAddr = tradeToken[i].address;
          }
        }
        console.log(this.input1);
        helper.buyCbbc(settleAddr,tradeAddr,trickNumber,this.currentIndex,this.input1,this.$store.state.defaultAccount,(error, transactionHash)=>{
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
