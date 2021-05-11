<template>
    <div class="d-flex align-center justify-center" style="cursor: pointer; height:50px; line-height: 50px;">
        <div class="textColor--text pl-3 pr-3" @click="handleUrl(item)" v-for="(item, index) in list" :key="index">{{item.label}}</div>
    </div>
</template>
<script>
export default {
    name: 'footer',
    data: () => ({
        hover: false,
        list: [
            { url: 'https://ht.powerswap.org', label: 'Powerswap' },
            { url: 'mailto:info@powerswap.org', label: '客服：info@powerswap.org' },
            { url: '', label: '微信号：niuxiongzheng' }
        ]
    }),
    methods: {
        handleUrl (item) {
            window.open(item.url);
        }
    }
}
</script>