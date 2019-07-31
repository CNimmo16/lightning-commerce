<template>
    <div class="left-column">
        <div class="contact">
            <h2>Contact information<span>Or log into your account</span></h2>
            <input name="email" v-model="email" :class="{ error: errors.collect('email').length > 0 }" v-validate="'required|email'" type="text" placeholder="Email">
            <div class="error-box">{{ errors.first("email") }}</div>
        </div>
        
        <form @submit.prevent="submit()" class="addressForm">
            <AddressInputs key="shipping" :title="'Shipping details'" :addressInit="address" @changed="onAddressChange($event)" :foundErrors="foundErrors" />
            <div class="choices">
                <p @click="$router.back()">< Continue shopping</p>
                <button class="button button--oldskool">Proceed to payment</button>
            </div>
        </form>
    </div>
</template>

<script>
    import AddressInputs from "@/components/checkout/AddressInputs.vue"

    export default {
        name: "CustomerInfo",
        props: ["addressInit", "emailInit"],
        data() {
            return {
                address: null,
                email: null,
                foundErrors: {}
            }
        },
        components: {
            AddressInputs
        },
        mounted() {
            if(this.addressInit) {
                this.address = this.addressInit
            } else {
                this.address = {
                    firstName: null,
                    lastName: null,
                    address: null,
                    company: null,
                    flatNumber: null,
                    city: null,
                    country: null,
                    postcode: null
                }
            }
            if(this.emailInit) {
                this.email = this.emailInit
            }
        },
        methods: {
            submit() {
                this.$validator.validate().then(valid => {
                    if (valid & Object.keys(this.foundErrors).length === 0) {
                        this.$emit("next-step", {
                            shippingAddress: this.address,
                            email: this.email
                        })
                    }
                });
            },
            onAddressChange(fields) {
                this.foundErrors = {}
                Object.keys(fields).forEach((key) => {
                    const field = fields[key]
                    if(!field || field.length === 0) {
                        let toSet = null
                        switch(key) {
                            case "firstName": 
                                toSet = "Please enter your first name"
                                break;
                            case "lastName":
                                toSet = "Please enter your last name"
                                break;
                            case "address":
                                toSet = "Please provide an address"
                                break;
                            case "city": 
                                toSet = "Please enter your city"
                                break;
                            case "country": 
                                toSet = "Select your country"
                                break;
                            case "postcode": 
                                toSet = "Please enter your postcode"
                                break;
                        }
                        if(toSet) {
                            this.foundErrors[key] = toSet
                        }
                    }
                })
            }
        },
    }
</script>