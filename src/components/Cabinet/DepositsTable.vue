<template>
    <div>
        <h4>Deposits history</h4>
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
                    <tr v-for="deposit in deposits"
                        v-bind:key="deposit.id"
                        >
                        <td class="no-mobile">{{deposit.id}}</td>
                        <td>{{deposit.timeCreatedString}}</td>
                        <td>{{deposit.amount.toFixed(account.precision)}}</td>
                        <td>{{deposit.currency}}</td>
                        <td v-bind:class="deposit.status == 1 ? 'green' : (deposit.status == 2 ? 'red' : '')">{{ (['Pending', 'Processed', 'Declined', 'Being Processed'])[deposit.status]}}</td>
                        <td class="no-mobile">{{deposit.info}}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "DepositsTable",
        computed: {
            ...mapGetters(['deposits', 'account'])
        }
    }
</script>

<style scoped>

</style>
