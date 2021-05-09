<template>
  <div :style="isMobile? 'width: 100%; position: fixed; z-index; top: 0; left: 0; background: #FFFFF0; border-bottom: 1px solid rgba(0,0,0,.055)':
    'width: 100%; position: fixed; top: 0; left: 0; background: #FFFFF0;'">
    <div :style="isMobile? 'position: relative;width: 100%; height: 66px; margin: 0 auto; padding: 0 15px':'width: 1200px; height: 66px; margin: 0 auto; padding: 0 15px'" 
        class="d-flex mx-auto align-center justify-space-between">
        <div class="d-inline-flex align-item">
            <v-img
            alt="Logo"
            class="shrink mr-2"
            contain
            src="../assets/logo.png"
            transition="scale-transition"
            width="40"
            />
            <v-spacer></v-spacer>
            <div class="d-flex align-center" v-if="!isMobile">
                <v-hover
                    v-for="(item, index) in list" :key="index"
                    v-slot="{ hover }"
                >
                    <div class="pl-5 pr-5" @click="handleRouter(index)" :style="currentIndex === index?'color: #d16c00;font-size: 18px; font-weight: 800;; cursor: pointer':hover?'color: #805e49;font-size: 18px; font-weight: 800; cursor: pointer':'color: rgb(170, 149, 133);font-size: 18px; font-weight: 800;; cursor: pointer'">{{item.label}}</div>
                </v-hover>
            </div>
            <div v-else @click="handleMenu" style="display:flex; align-item: center;"><img style="width: 40px;" src="../assets/menu.png" /></div>
        </div>
        
        
        <v-btn v-if="!isLogin" @click="handleShowLayer" class="mr-1 rounded-lg" :outlined="isMobile" color="btnColor" ><span class="btnTextColor--text">解锁钱包</span></v-btn>
        <v-btn v-else @click="handleShowLayer" class="rounded-lg" :outlined="isMobile" color="btnColor" ><span class="btnTextColor--text">我的钱包</span></v-btn>
    </div>
    <v-dialog 
        v-model="isShowMobileMenu"
        overlay-color="rgba(91, 57, 38, 0.667)"
        >
        <div style="display: flex; align-item: center; flex-direction: column; background: #fff; width: 100%; height: auto;" >
            <div
                @click="handleRouter(index)"
                v-for="(item, index) in list" :key="index"
                class="text-body-1 text-sm-body-2 font-weight-bold"
                style="width: 100%; height: 45px; line-height: 45px; text-align: center;">{{item.label}}</div>
        </div>
    </v-dialog>

    <v-dialog 
        v-model="overlay"
        :width="!isMobile?'512px': ''"
        persistent
        overlay-color="rgba(91, 57, 38, 0.667)">
        <v-card 
            v-if="!isLogin"
            elevation="2"
            color="#FFFFF0"
            :width="!isMobile?'512px': '100%'"
            class="pl-5 pr-5 pt-5 pb-5"
        >  
            <p class="textColor--text font-weight-bold text-center text-h6">请选择钱包类型</p>
            <div class="d-flex align-item pt-8 pb-8" style="width: 100%;">
                <div class="mr-2 d-inline-flex align-center flex-column pt-3 pb-3 pl-3 pr-3" style="border: 1px solid rgb(226, 214, 207); border-radius: 12px; box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; width: 50%;">
                    <div style="display: inline-flex; align-item: center; justify-content:center; width: 80px; height: 80px; border-radius: 50%; text-align: center; box-shadow: rgb(226, 214, 207) 4px 4px 8px inset, rgb(247, 244, 242) -6px -6px 12px inset;">
                        <img src="../assets/metamask-fox.svg" alt="fox">
                    </div>
                    <p class="textColor--text text-subtitle-1 font-weight-bold pt-8 pb-8">Metamask</p>
                    <v-btn @click="handleUnlock" :disabled="!walletInstalled" class="rounded-lg" large color="btnColor" ><span class="btnTextColor--text">{{walletInstalled? "连接":"请先安装插件"}}</span></v-btn>
                </div>
                <div class="ml-2 d-inline-flex align-center flex-column pt-3 pb-3 pl-3 pr-3" style="border: 1px solid rgb(226, 214, 207); border-radius: 12px; box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; width: 50%;">
                    <div style="display: inline-flex; align-item: center; justify-content:center; width: 80px; height: 80px; border-radius: 50%; text-align: center; box-shadow: rgb(226, 214, 207) 4px 4px 8px inset, rgb(247, 244, 242) -6px -6px 12px inset;">
                        <img style="width: 35px;" src="../assets/wallet-connect.svg" alt="connect">
                    </div>
                    <p class="textColor--text text-subtitle-1 font-weight-bold pt-8 pb-8">WalletConnect</p>
                    <v-btn @click="handleUnlock" class="rounded-lg" large color="btnColor" ><span class="btnTextColor--text">连接</span></v-btn>
                </div>
            </div>
            <v-btn width="100%" class="rounded-lg" large color="btnColor" @click="handleCancel"><span class="textColor--text">取消</span></v-btn>
        </v-card>
        <v-card
            elevation="2"
            color="#FFFFCC"
            :width="!isMobile?'512px': '100%'"
            class="pl-5 pr-5 pt-5 pb-5 text-center"
            v-else>
                <p class="textColor--text font-weight-bold text-center text-h6">我的账户</p>
                <div style="display: inline-flex; align-item: center; justify-content:center; width: 80px; height: 80px; border-radius: 50%; text-align: center; box-shadow: rgb(226, 214, 207) 4px 4px 8px inset, rgb(247, 244, 242) -6px -6px 12px inset;">
                    <img src="../assets/metamask-fox.svg" alt="fox">
                </div>
                <p class="textColor--text pt-3 mb-0">{{this.$store.state.defaultAccount}}</p>
                <p class="textColor--text pt-3 mb-0">{{this.eth}} ETH</p>
                <div class="text-caption textColor--text mb-8"></div>
                <v-btn width="100%" class="rounded-lg mb-3" large color="btnColor" @click="handleViewOnEarthscan"><span class="textColor--text">HecoInfo</span></v-btn>
                <v-btn width="100%" class="rounded-lg mb-8" large color="btnColor" @click="handleSignOut"><span class="textColor--text">登出</span></v-btn>
                <v-btn width="100%" class="rounded-lg" large color="btnColor" @click="handleCancel"><span class="btnTextColor--text">取消</span></v-btn>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import helper from "../helpers"

export default {
  name: 'Header',
  data() {
      const chainMap = new Map([
                ['0x1','Mainnet'],
                ['0x3','Ropsten'],
                ['0x4','Rinkeby'],
                ['0x5','Goerli'],
                ['0x2a','Kovan']
            ]); 
      return {
        list: [
            { router: './', label: '交易' },
            { router: './share', label: '持仓' },
            { router: './mine', label: '挖矿' },
            // { router: './clear', label: '清算工' }
        ],
        currentIndex: 0,
        isMobile: true,
        isLogin: false,
        isShowMobileMenu: false,
        overlay: false, /// 显示遮罩
        chainMap,
        eth:0,
        walletInstalled:true,
      }
  },
  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    this.walletInstalled = helper.IsWalletInstalled();
    if (this.walletInstalled){
        helper.getAccount((account)=>{
            if(account.length>0){
                this.handleUnlock();
            }
        });
    }  
  },
  watch: {
      '$store.state.defaultAccount': function (val) {
          (async()=>{   
            await helper.getETHBalance(val,(balance)=>{
                this.eth = String(balance).replace(/^(.*\..{4}).*$/,"$1");
            });
          })();
      } 
  },
  methods: {
      onResize () {
        this.isMobile = window.innerWidth < 750
      },
      /// 显示menu
      handleMenu() {
          this.isShowMobileMenu = true
      },
      /// 点击logo
      handleLogoClick() {

      },
      /// 退出登录
      handleSignOut() {
        this.isLogin = false
        this.overlay = false
        this.$store.state.defaultAccount = "";
        this.$store.state.login = false;
      },
      /// 点击取消
      handleCancel() {
          this.overlay = false
      },
      /// 点击跳转
      handleRouter(index) {
          this.currentIndex = index
          this.$router.push(this.list[index].router)
          if(this.isMobile) {
            this.isShowMobileMenu = false 
          }
      },
      /// 解锁钱包
      handleUnlock() {
        helper.connectWallet((account)=>{
            if(account!="") {
                this.isLogin = true;
                this.$store.state.defaultAccount = account[0];
                this.$store.state.login = true;
               
            }
        },(id)=>{
            if(id!="") {
                this.$store.state.defaultChainId = id;    
            }
        });
        this.overlay = false;
      },
      /// 钱包
      handleShowLayer() {
        this.overlay = true
      },
      handleViewOnEarthscan(){
        var id = this.$store.state.defaultAccount;
        // var chain = this.chainMap.get(this.$store.state.defaultChainId);
        var url = "https://hecoinfo.com/address/" + id;
        window.open(url);
       
      }
    },
    // beforeDestroy () {
    //     if (typeof window === 'undefined') return
    //     window.removeEventListener('resize', this.onResize, { passive: true })
    // }
}
</script>
