<template>
    <div class="two-cols">
        <div class="onecol">
            <h4>Make a Deposit</h4>
            <div class="form-row">
                <select v-model="currency">
                    <template>
                        <option v-for="cur in currencies"
                                :key="cur.currency"
                                :value="cur.currency">{{ cur.alias }}
                        </option>
                    </template>
                </select>
            </div>
            <div class="form-row form-actions" style="justify-content: flex-start !important;">
                <button type="button" class="btn btn-primary" v-on:click="makeDeposit">Get Address</button>
            </div>
            <div v-bind:class="{hide: addr === ''}" class="form-row">
                <label>Address</label>
                <input type="text" placeholder="Bitcoin Wallet Address" v-bind:value="addr" disabled="disabled">
                <span class="text-muted">Please note that generated {{ currencies[currency] ? currencies[currency].alias : '' }} address is valid only for 1 hour. If you need more time to make a deposit, please request a new deposit when you will be ready to make a transfer.</span>
            </div>
            <div class="form-row"  v-bind:class="{hide: addr === ''}">
                <img v-bind:src="addr ? 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl='+addr : ''" />
            </div>
        </div>
        <div class="onecol extra-text">
            <i class="material-icons large">help_outline</i>
            <span class="text">Deposits are processed automatically after receiving a confirmation from the payment system you choose. In order to receive additional information about deposit process feel free to contact our support team via e-mail <a class="support-email" v-bind:href="'mailto:'+supportEmail">{{supportEmail}}</a>  </span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {SUPPORT_EMAIL} from '@/common/config'
    import {DEPOSIT_REQUEST} from "@/store/actions.type";

    export default {
        name: "Deposit",
        data() {
            return {
                supportEmail: SUPPORT_EMAIL,
                currency: 'BTC',
                psp: 'nax',
                addr: ''
            }
        },
        computed: {
            ...mapGetters(['depositAddress', 'currencies', 'account'])
        },
        methods: {
            makeDeposit() {
                switch (this.psp) {
                    case 'nax':
                        this.$store.dispatch(DEPOSIT_REQUEST, {
                            psp: this.psp,
                            currency: this.currency
                        })
                        break
                }
            }
        },
        watch: {
            depositAddress(val) {
                this.addr = val
            },
            currency(val, old) {
                if (val !== old) {
                    this.addr = ''
                }
            }
        }
    }
</script>

<style scoped>
    img {
        width: 200px;
        height: 200px;
    }
</style>
