<template>
    <div>
        <h4>Withdrawals history</h4>
        <table>
            <thead>
            <tr>
                <th class="no-mobile">ID</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Coin</th>
                <th>Status</th>
                <th class="no-mobile">Info</th>
            </tr>
            </thead>
            <tbody>
            <template inline-template>
                <tr v-for="withdrawal in withdrawals"
                    v-bind:key="withdrawal.id"
                >
                    <td class="no-mobile">{{withdrawal.id}}</td>
                    <td>{{withdrawal.timeCreatedString}}</td>
                    <td>{{withdrawal.amount.toFixed(account.precision)}}</td>
                    <td>{{withdrawal.currency}}</td>
                    <td v-bind:class="withdrawal.status == 1 ? 'green' : (withdrawal.status == 2 ? 'red' : '')">{{ (['Pending', 'Processed', 'Declined', 'Being Processed'])[withdrawal.status]}}</td>
                    <td class="no-mobile">{{withdrawal.info}}</td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: "WithdrawalsTable",
    computed: {
        ...mapGetters(['withdrawals', 'account'])
    }
}
</script>

<style scoped>

</style>
