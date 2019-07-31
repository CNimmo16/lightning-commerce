<template>
    <div id="app">
        <Header @toggle-nav="showMobileNav = !showMobileNav" />
        <Navbar :show="showMobileNav" v-if="isCheckout === false" />
        <router-view />
    </div>
</template>

<script src="https://js.stripe.com/v3/"></script>

<script>
    import Header from '@/components/global/Header.vue'
    import Navbar from '@/components/global/Navbar.vue'
    
    
    export default {
        name: "app",
        components: {
            Header,
            Navbar,
        },
        data() {
            return {
                showMobileNav: false,
                isCheckout: false
            }
        },
        watch: {
            '$route' (to) {
                if(to.name === "checkout") {
                    this.isCheckout = true;
                } else {
                    this.isCheckout = false;
                }
            }
        },
    }
</script>