<template>
    <div>
        ini review
        {{tempat}}
    </div>
</template>
<script>
export default {
    name: "review",
    data(){
        return {
            tempat: "",
        }
    },

    mounted(){
        this.tempat = this.$route.params.tempat;
    }
}
</script>