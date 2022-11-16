<template>
    <div class="two-cols">
        <div class="onecol">
            <h4>Request a Withdrawal</h4>
            <div class="form-row">
                <label>Amount</label>
                <input type="text" placeholder="Enter amount" v-model="amount">
                <span class="text-muted">Your current balance is {{account.wallets[currency] ? account.wallets[currency].balance.toFixed(account.wallets[currency].precision) : 0}}. <span class="subaction" v-on:click="amount = account.wallets[currency].balance.toFixed(2)">Withdraw all</span></span>
            </div>
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
            <div class="form-row">
                <label>{{currencies[currency] ? currencies[currency].alias : ''}} Address</label>
                <input type="text" placeholder="Wallet Address" v-model="wallet">
            </div>
            <div class="form-row form-actions">
                <button type="button" class="btn btn-primary" v-on:click="requestWithdrawal">Request Withdrawal</button>
            </div>
        </div>
        <div class="onecol extra-text">
            <i class="material-icons large">help_outline</i>
            <span class="text">All withdrawals are processed manually during the working hours of our support desk. Please don't send the repeating requests as it will not speed up the process. In order to receive additional information about withdrawal process feel free to contact our support team via e-mail <a class="support-email" v-bind:href="'mailto:'+supportEmail">{{supportEmail}}</a> </span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {SUPPORT_EMAIL} from '@/common/config'
import {WITHDRAWAL_REQUEST} from "@/store/actions.type"

export default {
    name: "Withdrawal",
    data() {
        return {
            supportEmail: SUPPORT_EMAIL,
            amount: '',
            currency: 'BTC',
            wallet: ''
        }
    },
    methods: {
        requestWithdrawal() {
            this.$store.dispatch(WITHDRAWAL_REQUEST, {
                wallet: this.wallet,
                currency: this.currency,
                amount: this.amount
            })

            this.method = 'btc'
            this.methods.btc.wallet = ''
            this.methods.bank.account = ''
            this.methods.bank.holder = ''
            this.methods.bank.iban = ''
            this.methods.bank.swift = ''
        }
    },
    computed: {
        ...mapGetters(['account', 'markets', 'currencies'])
    }
}
</script>

<style scoped>

</style>
