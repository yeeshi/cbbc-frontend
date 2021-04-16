import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
// 字体图标
import '@mdi/font/css/materialdesignicons.css'
// 中文
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/zh-Hans'
Vue.use(Vuetify)
export default new Vuetify({
    lang: {
        current: 'zhHans',
        locales: { en, zhHans },
    },
    theme: {
        themes: {
            light: {
                background: '#FFFFF0',
                btnColor: '#FFFFCC',
                btnColor1: '#FFFFCC',
                btnHoverColor: '#f7f4f2',
                btnTextColor: '#d16c00',
                textColor: '#5b3926',
                layerBtn: "#f0e9e7",
                btnRed: '#ff0000',
                btnGreen: '#008000',
                btnP: '#FFFFCC',
                btnW: '#F44336',
                bullColor: "#FF6871",
                bearColor: "#0483FF"
            },
        },
    },
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
})