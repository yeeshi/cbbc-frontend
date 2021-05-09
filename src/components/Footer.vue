<template>
    <div class="d-flex align-center justify-center" style="cursor: pointer; height:50px; line-height: 50px;">
        <div class="textColor--text pl-3 pr-3" @click="handleUrl" v-for="(item, index) in list" :key="index">{{item.label}}</div>
    </div>
</template>
<script>
export default {
    name: 'footer',
    data: () => ({
        list: [
            // { url: '', label: 'Discord' },
            // { url: '', label: 'Github' },
            // { url: '', label: 'Twitter' },
            // { url: '', label: 'Medium' }
        ]
    }),
    methods: {
        handleUrl () {

        }
    }
}
</script>