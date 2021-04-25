<template>
    <div class="pl-3 pr-3" style="padding-top: 70px;">
      <v-container v-if="!$store.state.login" style="min-height:calc(100vh - 120px); position: relative;" class="mt-0 mb-0 pt-0 pb-0">
        <v-btn @click="handleUnLock" class="mr-1 rounded-lg" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);" color="btnColor" ><span class="btnTextColor--text">🔓 请先解锁钱包</span></v-btn>
      </v-container>
      <v-container v-else style="min-height:calc(100vh - 70px);" class="mt-0 mb-0">
        <p class="text-subtitle-1 font-weight-bold text-center">你的持仓</p>
        <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            class="elevation"
            item-key="id"
            style="background: #fcfcdb;"
            :items-per-page="1000"
        >   
          <template v-slot:item.type="{ item }">
              {{item.type}}
          </template>
          <template v-slot:item.cz="{ item }">
            <v-hover v-slot="{ hover }">
              <v-container @click="handleShowDialog(item.id)" class="pl-0 pr-0 pt-0 pb-0 mb-2 text-center" 
              :style="isMobile? 'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 70px; height: 30px; line-height: 30px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 5px; ': 
              hover?'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 5px; cursor: pointer;':
              'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; color: #fff; background: #FF6871; border:1px solid #FF6871; border-radius: 5px; cursor: pointer;'">平仓</v-container>
            </v-hover>
            <v-hover v-slot="{ hover }">
              <v-container @click="handleRebase(item.id)" class="pl-0 pr-0 pt-0 pb-0 mb-2 text-center" 
              :style="isMobile? 'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 70px; height: 30px; line-height: 30px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 5px; ': 
              hover?'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; background: #0483FF; color: #fff; border:1px solid #0483FF; border-radius: 5px; cursor: pointer;':
              'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; color: #fff; background: #0483FF; border:1px solid #0483FF; border-radius: 5px; cursor: pointer;'">rebase</v-container>
            </v-hover>
          </template>
        </v-data-table>
      </v-container>

      <v-dialog
        v-model="isShowDialog"
        overlay-color="rgba(91, 57, 38, 0.667)"
        :width="isMobile? '': '520px'"
      >
        <v-card style="background: rgb(240, 233, 231);">
          <v-container class="text-center font-weight-bold textColor--text text-h6">平仓确认</v-container>
          <v-container class="pl-5 pr-5 pb-5">
            <v-container class="mb-5" style="border: 1px solid rgb(226, 214, 207); box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: rgb(240, 233, 231); border-radius: 15px;">
                <p class="mb-0 text-body-2">平仓份额</p>
                <div class="d-flex align-center justify-space-between" style="height: 44px;">
                  <v-text-field
                    class="pt-0"
                    v-model="input1"
                  ></v-text-field>
                </div>
              </v-container>
              <v-btn block :loading="isVerifingLoading" :disabled="isVerified" @click="handleConfirm" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'white--text': 'white--text'">批准</span></v-btn>
              <v-btn block :loading="isVerifiedLoading" :disabled="!isVerified" @click="handleSell" class="rounded-lg" :outlined="isMobile" color="#0483FF" ><span :class="isMobile? 'white--text': 'white--text'">确定</span></v-btn>
          </v-container>
        </v-card>
      </v-dialog>

      <v-footer></v-footer>
    </div>
</template>
<script>
import vFooter from '@/components/Footer.vue'
import helper from "../helpers"
export default {
  name: 'Tab2',
  components: {
    vFooter
  },
  data () {
    return{
      isShowDialog: false,
      isMobile: false,
      input1: '',
      isUnLock: false, /// 是否解锁了钱包
      headers: [
        { text: '类型', align: 'start', sortable: false, value: 'type', },
        { text: '币种', align: 'start', sortable: false, value: 'breed', },
        { text: '份额', align: 'start', sortable: false, value: 'portion', },
        { text: '权证价格', align: 'start', sortable: false, value: 'profit', },
        { text: '清算价', align: 'start', sortable: false, value: 'clearingPrice', },
        { text: '操作', align: 'center', sortable: false, value: 'cz' },
      ],
      desserts: [
      ],
      max:0,
      VerifingLoading:false,
      VerifiedLoading:false,
      verified:false,
      addresses:[],
      currentAddress:'',
    }
  },
  watch:{
    '$store.state.defaultAccount': function () {
      (async()=>{
        var list = await helper.getPositions(this.$store.state.defaultAccount);
        for(let i=0;i<list.length;i++){
          if (list[i].amount > 0.0001 ){
            var t = '牛证';
            if (list[i].type == 0){
              t='熊证';
            }
            let obj = {id: i, type: t, breed:list[i].name,portion:String(list[i].amount).replace(/^(.*\..{4}).*$/,"$1"),profit: '1.0000', clearingPrice: '1.0200'};
            let addrPair = {id:i,address:list[i].address}
            this.desserts.push(obj);
            this.addresses.push(addrPair);
          }
        }
      })(); 
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
    }
  },
  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    (async()=>{
      var list = await helper.getPositions(this.$store.state.defaultAccount);
      for(let i=0;i<list.length;i++){
        if (list[i].amount > 0.0001 ){
          var t = '牛证';
          if (list[i].type == 0){
            t='熊证';
          }
          let obj = {id: i, type: t, breed:list[i].name,portion:String(list[i].amount).replace(/^(.*\..{4}).*$/,"$1"),profit: '1.0000', clearingPrice: '1.0200'};
          let addrPair = {id:i,address:list[i].address}
          this.desserts.push(obj);
          this.addresses.push(addrPair);
        }
      }
    })();    
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 750
    },
    /// 点击解锁
    handleUnLock() {
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
        
    },
    /// 点击平仓
    handleShowDialog(id) {
      this.isShowDialog = true;
      this.max = this.desserts[id].portion;
      this.addresses.forEach(element=>{
        if (element.id == id){
          this.currentAddress = element.address;
        }
      });
    },
    /// 平仓确认
    handleConfirm() {
      (async()=>{    
        this.VerifingLoading = true;
        var err,hash = helper.approveToken(this.currentAddress,this.input1,this.$store.state.defaultAccount,
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
    /// 平仓
    handleSell(){
      (async()=>{
        this.VerifiedLoading = true;
        helper.sellCbbc(this.currentAddress,this.input1,this.$store.state.defaultAccount,(error, transactionHash)=>{
          this.VerifiedLoading = false;
          this.verified = false;
          this.input1 = '';
          this.isShowDialog = false;
        }); 
      })();
    },
    handleRebase(id){
      var address = '';
      this.addresses.forEach(element=>{
        if (element.id == id){
          address = element.address;
        }
      });
      helper.rebase(address,this.$store.state.defaultAccount);
    }
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>