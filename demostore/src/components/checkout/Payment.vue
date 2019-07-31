<template>
    <div class="left-column">
        <div class="review">
            <div>
                <span>Email</span>
                <span>{{ email }}</span>
                <span @click="$emit('previous-step')">Change</span>
            </div>
            <div>
                <span>Ship to</span>
                <span>{{ formattedAddress }}</span>
                <span @click="$emit('previous-step')">Change</span>
            </div>
            <div>
                <span>Ship by</span>
                <span>{{ method.name }} - {{ method.days[1] }}-{{ method.days[2] }} business days</span>
                <span @click="$emit('previous-step')">Change</span>
            </div>
        </div>
        <h2 class="payment">Payment</h2>
        <p>All payments are 3D secure encrypted - your payment details are kept secure and safe.</p>
        <p style="background: #fff9d1; padding: 15px; font-weight: 400; line-height: 1.5;">Welcome to the demo checkout page. Don't worry, no need to enter real card details! Try this Stripe test card number: <strong>4000 0027 6000 3184</strong>. Use any expiry date in the future with a random cvc and zip code ;) </p>
        
        <form action="/charge" method="post" id="payment-form" @submit.prevent="onSubmit($event)">
            <div class="form-row">
                <label for="card-element">
                    Credit or debit card
                </label>
            <div id="card-element">
                <!-- A Stripe Element will be inserted here. -->
                </div>
                
                <!-- Used to display form errors. -->
                <div id="card-errors" role="alert" v-if="cardErrors">{{ cardErrors }}</div>
            </div>
            
            <AddressInputs key="billing" :title="'Billing details'" :addressInit="billingAddress" @changed="onAddressChange($event)" :foundErrors="foundErrors" />
            
            <div class="error" v-if="error" style="color: #d04949; width: 100%; font-family: 'Roboto'; font-size:1em;">
                {{ error }}
            </div>
            
            <div class="choices">
                <p @click="$router.back()">< Continue shopping</p>
                <button value="submit" class="button button--oldskool" style="display: flex; align-items: center">Pay now &nbsp;<img style="height: 30px" src="@/assets/spinner2.svg" v-if="processing"></button>
            </div>
        
        </form>
        
        
    </div>
</template>

<script>
    import AddressInputs from "@/components/checkout/AddressInputs.vue"

    export default {
        name: "payment",
        props: ["email", "formattedAddress", "method", "shippingAddress"],
        inject: ['notyf'],
        components: {
            AddressInputs
        },
        data() {
            return {
                card: null,
                billingAddress: null,
                foundErrors: {},
                cardErrors: null,
                processing: false,
                error: null
            }
        },
        mounted() {
            var d = new Object();
            d.firstName = this.shippingAddress.firstName
            d.lastName = this.shippingAddress.lastName
            d.address = this.shippingAddress.address
            d.company = this.shippingAddress.company
            d.flatNumber = this.shippingAddress.flatNumber
            d.city = this.shippingAddress.city
            d.country = this.shippingAddress.country
            d.postcode = this.shippingAddress.postcode
            d.phone = this.shippingAddress.phone
            this.billingAddress = d
            this.$loadScript("https://js.stripe.com/v3/")
            .then(() => {
                // Create a Stripe client.
                window.stripe = Stripe('pk_test_9yxW3tIbgMojGmrFlt66m1ut00VurR8txa');

                // Create an instance of Elements.
                var elements = window.stripe.elements();
                
                // Custom styling can be passed to options when creating an Element.
                // (Note that this demo uses a wider set of styles than the guide below.)
                var style = {
                  base: {
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                      color: '#aab7c4'
                    }
                  },
                  invalid: {
                    color: '#d04949',
                    iconColor: '#d04949'
                  }
                };
                
                // Create an instance of the card Element.
                this.card = elements.create('card', {style: style});
                
                this.card.addEventListener('change', (event) => {
                    if (event.error) {
                        this.cardErrors = event.error.message;
                    } else {
                        this.cardErrors = false;
                    }
                });
                
                // Add an instance of the card Element into the `card-element` <div>.
                this.card.mount('#card-element');
                })
                .catch(() => {
                    this.notyf.error('Error loading payment page. Please try again later.');
                    this.$router.push("/");
                });
        },
        methods: {
            onSubmit(event) {
                if (Object.keys(this.foundErrors).length === 0 && this.cardErrors === false) {
                    this.processing = true;
                    this.$store.commit("addBillingAddress", this.billingAddress)
                    // application attempts to confirm that the order amount is inline with the amount being passed to stripe for payment
                    this.$axios.post("/orders/validate", {
                        order: this.$store.state.activeOrder,
                    })
                    .then((res) => {
                        const details = {
                            name: this.billingAddress.firstName + " " + this.billingAddress.lastName,
                            email: this.email,
                            address: {
                                line1: this.billingAddress.address,
                                postal_code: this.billingAddress.postcode,
                                country: this.billingAddress.country.code,
                                city: this.billingAddress.city
                            }
                        }
                        if(this.billingAddress.phone) { details.phone = this.billingAddress.phone }
                        window.stripe.handleCardPayment(
                            this.$store.state.activeOrder.paymentIntent.client_secret, this.card, {
                                payment_method_data: {
                                    billing_details: details
                                }
                            }
                        ).then((result) => {
                            if (result.error) {
                                // Display error.message in your UI.
                                this.processing = false
                                this.error = "Something went wrong while trying to process this payment. Please ensure your billing details are correct, or try using a different card if problem persists. "
                            } else {
                                // The payment has succeeded. Create order and confirm to customer it has succeeded
                                this.$axios.post("/orders", {
                                    order: this.$store.state.activeOrder,
                                })
                                this.processing = false
                                this.$store.commit("completeOrder")
                                this.$router.push("/order-complete")
                            }
                        });
                    })
                    .catch(() => {
                        // if order validation fails, transaction is either fraudulent or there has been some weird error
                        this.notyf.error('Whoops, there was an error processing your order. Please try again later, or get in touch with us.');
                        this.$router.push("/")
                    })
                } else {
                    if(this.cardErrors === null) {
                        this.cardErrors = "Your card number is incomplete";
                    }
                }
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
        }
    }
</script>

<style lang="scss" scoped>
    .shipping {
        width: 100%;
        margin: 35px 0;
        .v-select{
            width: 100%
        }
    }
    .review {
        border: 1px solid #ddd;
        padding: 0 12px;
        border-radius: 5px;
        margin: 20px 0 50px 0;
        font-family: "Roboto", sans-serif;
        font-size: 0.9em;
        div {
            display: grid;
            grid-template-columns: 80px 1fr 55px;
            grid-column-gap: 10px;
            padding: 12px 0;
            &:nth-of-type(1), &:nth-of-type(2) {
                border-bottom: 1px solid #ddd;
            }
            span {
                color: #555;
                font-weight: 300;
                &:nth-of-type(2) {
                    color: #333;
                    font-weight: 400;
                    line-height: 19px;
                }
                &:nth-of-type(3) {
                    font-size: 0.9em;
                    color: #000;
                    line-height: 20px;
                    cursor: pointer;
                }
            }
        }
    }
    h2.payment {
        margin-bottom: 5px;
    }
    .address a {
        font-size: 0.9em;
        display: block;
        margin: 10px 0;
        text-decoration: underline;
        color: #5148d4;
        cursor: pointer;
    }
    .radios {
        font-family: "Roboto", sans-serif;
        font-size: 0.9em;
        margin: 18px 0;
        label {
            display: block;
            padding: 13px 12px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 14px;
            margin-bottom: 4px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                background-color: #efefef;
            }
            span {
                margin: 0 7px;
            }
            span:nth-of-type(2) {
                margin-left: auto;
            }
        }
    }
    label {
        font-family: "Roboto", sans-serif;
        font-size: 1em;
    }
    .StripeElement {
        padding: 17px 0;
    }
    #card-errors {
        font-family: "Roboto", sans-serif;
        font-size: 0.95em;
        color: #d04949;
        padding: 10px 0;
        /*border: 2px solid #d04949;*/
        border-radius: 5px;
        margin-bottom: 30px;
    }
</style>