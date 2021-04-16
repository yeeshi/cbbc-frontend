<template>
    <div class="pl-3 pr-3" style="padding-top: 70px;">
      <v-container style="min-height:calc(100vh - 120px);" class="mt-0 mb-0">
        <p class="text-subtitle-1 font-weight-bold text-center">你不是清算工，立即成为清算工</p>
        <p class="text-subtitle-1 font-weight-bold text-center">质押10万TBBC成为清算工，分享清算折扣费</p>
        <v-hover v-slot="{ hover }">
          <v-container class="pl-0 pr-0 pt-0 pb-0 mb-5 text-center" 
            :style="isMobile? 'width: 70px;box-shadow: 0 3px 6px rgba(0,0,0,.2); height: 30px; line-height: 30px; background: #FFFFCC; color: #d16c00; border:1px solid #FFFFCC; border-radius: 5px; ': 
            hover?'width: 100px; height: 40px;box-shadow: 0 3px 6px rgba(0,0,0,.2); line-height: 40px; background: #e9e9b9; color: #d16c00; border:1px solid #e9e9b9; border-radius: 10px; cursor: pointer;':
            'box-shadow: 0 3px 6px rgba(0,0,0,.2); width: 100px; height: 40px; line-height: 40px; color: #d16c00; background: #FFFFCC; border:1px solid #FFFFCC; border-radius: 10px; cursor: pointer;'"><strong>参与</strong></v-container>
        </v-hover>
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
              <img :class="isMobile? 'mt-2 mb-0':'mt-2 mb-2'" style="width: 60px; height: 60px;" :src="item.type" alt="fox" />
          </template>
          <template v-slot:item.status="{ item }">
              <div :style="item.status === 1? 'color: green':'color: red'">{{item.status === 1? '即将爆仓':'已经爆仓'}}</div>
          </template>
          <template v-slot:item.cz="{ item }">
            <v-hover v-slot="{ hover }" v-if="item.status == 2">
              <v-container @click="handleShowDialog(item.id)" class="pl-0 pr-0 pt-0 pb-0 mb-2 text-center" 
                :style="isMobile? 'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 70px; height: 30px; line-height: 30px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 5px; ':
                hover?'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; background: #FF6871; color: #fff; border:1px solid #FF6871; border-radius: 10px; cursor: pointer;':
                'box-shadow: 0 3px 6px rgba(0,0,0,.2);width: 100px; height: 40px; line-height: 40px; color: #fff; background: #FF6871; border:1px solid #FF6871; border-radius: 10px; cursor: pointer;'">清算</v-container>
            </v-hover>
          </template>
        </v-data-table>
      </v-container>
      <v-dialog
        v-model="isShowDialog"
        overlay-color="rgba(91, 57, 38, 0.667)"
        :width="isMobile? '': '520px'"
      >
        <v-card style="background: #FFFFF0;">
          <v-container class="text-center font-weight-bold textColor--text text-h6">清算确认</v-container>
          <v-container class="pl-5 pr-5 pb-5">
             <v-container class="mb-5" style="border: 1px solid rgb(226, 214, 207); box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; border-radius: 15px;">
              <p class="mb-0 text-body-2">清算比例</p>
              <div class="d-flex align-center justify-space-between pt-9" style="height: 44px;">
                <v-subheader class="pl-0 pr-0">1</v-subheader>
                <v-slider
                  max="100"
                  min="1"
                  :thumb-size="18"
                  thumb-label="always"
                ></v-slider>
                <v-subheader class="pl-0 pr-0">100</v-subheader>
              </div>
            </v-container>
            <v-container class="mb-5" style="border: 1px solid rgb(226, 214, 207); box-shadow: rgb(247, 244, 242) 1px 1px 0px inset; background: #FFFFF0; border-radius: 15px;">
                <div class="d-flex align-center justify-space-between" style="height: 44px;">
                  <p class="mb-0 text-body-2">清算份额</p>
                  <p class="mb-0 text-caption">10张</p>
                </div>
              </v-container>
              <v-btn block @click="handleConfirm" class="rounded-lg" :outlined="isMobile" color="#FF6871" ><span :class="isMobile? 'white--text': 'white--text'">确定</span></v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <v-footer></v-footer>
    </div>
</template>
<script>
import vFooter from '@/components/Footer.vue'
export default {
  name: 'Tab4',
  components: {
    vFooter
  },
  data () {
    return{
      isShowDialog: false,
      isMobile: false,
      input1: '',
      headers: [
        { text: '类型', align: 'start', sortable: false, value: 'type', },
        { text: '品种', align: 'start', sortable: false, value: 'breed', },
        { text: '份额', align: 'start', sortable: false, value: 'portion', },
        { text: '清算价', align: 'center', sortable: false, value: 'clearingPrice', },
        { text: '实时价', align: 'center', sortable: false, value: 'nowPrice', },
        { text: '状态', align: 'start', sortable: false, value: 'status', },
        { text: '操作', align: 'center', sortable: false, value: 'cz' },
      ],
      desserts: [
        { id: 1, type: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3065179808,949830502&fm=11&gp=0.jpg', breed: 'ETHX1', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 2, type: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3738324299,1361227017&fm=26&gp=0.jpg', breed: 'ETHX2', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 2 },
        { id: 3, type: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1062990735,2710469276&fm=11&gp=0.jpg', breed: 'ETHX3', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 2 },
        { id: 4, type: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=65353652,591609085&fm=11&gp=0.jpg', breed: 'ETHX4', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 5, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 6, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 2 },
        { id: 7, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 8, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 2 },
        { id: 9, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 10, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 2 },
        { id: 11, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 12, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 13, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 14, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 15, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
        { id: 16, type: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1355693655,3323503011&fm=11&gp=0.jpg', breed: 'ETHX5', portion: 10, clearingPrice: '100/200', nowPrice: 100, status: 1 },
      ]
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 750
      console.log(window.innerWidth)
    },
    /// 点击 清算
    handleShowDialog(id) {
      console.log(id)
      this.isShowDialog = true
    },
    /// 清算确认
    handleConfirm() {
      this.isShowDialog = false
      this.input1 = ''
    }
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>