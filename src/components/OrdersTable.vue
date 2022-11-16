<template>
    <table v-bind:class="{hide: !loggedIn}">
        <thead>
        <tr>
            <th>{{ tokens.Market }}</th>
            <th>{{filter === 'stops' ? 'Stop ' : ''}}{{ tokens.Price }}</th>
            <th>{{ tokens.Quantity }}</th>
            <th :class="{hide: filter === 'stops'}">{{ tokens.Filled }}</th>
            <th>{{ tokens.MarketPrice }}</th>
            <th>{{ tokens.Action }}</th>
        </tr>
        </thead>
        <tbody>
        <template inline-template>
            <tr v-for="order in orders"
                v-bind:key="order.id"
                v-on:click="changeSymbol(order.symbol)"
                v-bind:class="{hide: (filter === 'orders' && order.type !== 'LIMIT') || (filter === 'stops' && order.type !== 'STOP')}"
            >
                <td>
                <span class="frow">
                    <i class="material-icons" v-bind:class="order.side ? 'green' : 'red'">{{ order.side ? 'expand_less' : 'expand_more' }}</i>
                    <span>{{ order.symbol }}</span>
                </span>
                </td>
                <td>{{ (filter === 'orders' ? order.price : order.price_stop).toFixed(markets[order.symbol].precision) }}</td>
                <td>{{ order.quantity.toFixed(account.precision)+' '+markets[order.symbol].foreign_currency }}</td>
                <td :class="{hide: filter === 'stops'}">{{ order.quantity_filled.toFixed(account.precision)+' '+markets[order.symbol].foreign_currency }}</td>
                <td v-bind:class="markets[order.symbol].quote.changeDir > 0 ? 'green' : (markets[order.symbol].quote.changeDir < 0 ? 'red' : '')">{{ markets[order.symbol].quote && markets[order.symbol].quote.bid ? markets[order.symbol].quote.bid.toFixed(markets[order.symbol].precision) : '0' }}</td>
                <td>
                    <span class="btn btn-primary" v-on:click.stop="orderCancel(order.id)">Cancel</span>
                </td>
            </tr>
        </template>
        </tbody>
    </table>
</template>

<script>
import {mapGetters} from 'vuex';
import {ORDER_CANCEL} from "@/store/actions.type";
import {SYMBOL_ACTIVE} from "@/store/mutations.type";
    export default {
        name: "OrdersTable",
        props: ['filter'],
        computed: {
            ...mapGetters(['tokens', 'loggedIn', 'orders', 'markets', 'account'])
        },
        methods: {
            orderCancel(id) {
                this.$store.dispatch(ORDER_CANCEL, {
                    id
                })
            },
            changeSymbol(symbol) {
                this.$store.commit(SYMBOL_ACTIVE, symbol)
            }
        }
    }
</script>

<style scoped>
    th {
        background-color: rgba(255,255,255,0.05);
        border-right: 1px solid var(--background-dark);
    }

    .btn {
        padding: 0.15em 0.6em;
    }

    tr {
        cursor: pointer;
        transition: background-color 0.5s ease-in-out;
    }

    tr:hover {
        background-color: rgba(255,255,255,0.02);
    }

    .frow {
        display: flex;
        align-items: center;
    }
</style>
