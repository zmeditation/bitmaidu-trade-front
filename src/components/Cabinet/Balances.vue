<template>
    <div>
        <h4>Wallet Balances</h4>
        <table>
            <thead>
            <tr>
                <th>Coin</th>
                <th>Balance</th>
                <th class="no-mobile">Orders</th>
                <th>Available</th>
            </tr>
            </thead>
            <tbody>
            <template inline-template>
                <tr v-for="wallet in wallets"
                    :key="wallet.currency"
                >
                    <td>{{ wallet.alias }}</td>
                    <td>{{ wallet.balance.toFixed(wallet.precision) }}</td>
                    <td class="no-mobile">{{ wallet.orders.toFixed(wallet.precision) }}</td>
                    <td>{{ wallet.available.toFixed(wallet.precision) }}</td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Balances",
        computed: {
            ...mapGetters(['currencies', 'account', 'orders', 'markets']),
            wallets() {
                let wallet = {}

                for(let i in this.currencies) {
                    let currency = this.currencies[i]
                    wallet[currency.currency] = {
                        currency: currency.currency,
                        alias: currency.alias,
                        precision: this.account.wallets[currency.currency] !== undefined ? this.account.wallets[currency.currency].precision : currency.precision,
                        balance: this.account.wallets[currency.currency] !== undefined ? this.account.wallets[currency.currency].balance : 0,
                        orders: 0,
                        available: this.account.wallets[currency.currency] !== undefined ? this.account.wallets[currency.currency].balance : 0
                    }
                }

                for(let i in this.orders) {
                    let order = this.orders[i],
                        cur = order.side ? this.markets[order.symbol].base_currency : this.markets[order.symbol].foreign_currency,
                        qty = (order.side ? order.price : 1) * (order.quantity - order.quantity_filled)

                        wallet[cur].orders += qty
                        wallet[cur].available -= qty
                }

                return wallet
            }
        }
    }
</script>

<style scoped>

</style>