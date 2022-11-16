<template>
    <div>
        <table v-bind:class="{hide: !loggedIn}">
            <thead>
            <tr>
                <th>{{ tokens.Market }}</th>
                <th>{{ tokens.Type }}</th>
                <th>{{ tokens.Price }}</th>
                <th>{{ tokens.Quantity }}</th>
                <th>{{ tokens.Filled }}</th>
                <th>{{ tokens.TimeExecuted }}</th>
                <th>{{ tokens.Status }}</th>
            </tr>
            </thead>
            <tbody>
            <template inline-template>
                <tr v-for="order in history.slice(page*10, page*10+10)"
                    v-bind:key="order.id"
                >
                    <td>
                <span class="frow">
                    <i class="material-icons" v-bind:class="order.side ? 'green' : 'red'">{{ order.side ? 'expand_less' : 'expand_more' }}</i>
                    <span>{{ order.symbol }}</span>
                </span>
                    </td>
                    <td>{{ order.type }}</td>
                    <td>{{ (order.type === 'STOP' ? order.price_stop : order.price).toFixed(markets[order.symbol].precision) }}</td>
                    <td>{{ order.quantity.toFixed(account.precision)+' '+markets[order.symbol].foreign_currency }}</td>
                    <td>{{ order.quantity_filled.toFixed(account.precision)+' '+markets[order.symbol].foreign_currency }}</td>
                    <td>{{ order.time_closed ? new Date(order.time_closed).toLocaleString() : '-' }}</td>
                    <td v-bind:class="order.status === 'CANCELLED' ? 'red' : 'green'">{{ order.status }}</td>
                </tr>
            </template>
            </tbody>
        </table>
        <div class="bottom-nav">
            <span class="btn"
              v-bind:class="page > 0 ? 'btn-primary' : 'btn-disabled'"
              v-on:click="prevPage"
            ><i class="material-icons">keyboard_arrow_left</i> {{ tokens.Prev }}</span>
            <span class="btn"
              v-bind:class="page*10+10 < historyLen ? 'btn-primary' : 'btn-disabled'"
              v-on:click="nextPage"
            >{{ tokens.Next }} <i class="material-icons">keyboard_arrow_right</i></span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {timeToString} from "@/common/helpers";
import {HISTORY_REQUEST} from "@/store/actions.type";

export default {
    name: "HistoryTable",
    data() {
        return {
            page: 0
        }
    },
    methods: {
        toTime: timeToString,
        prevPage() {
            if (this.page > 0) {
                this.page -= 1
            }
        },
        nextPage() {
            if (this.page*10 + 10 < this.historyLen) {
                this.page += 1

                this.$store.dispatch(HISTORY_REQUEST, this.page)
            }
        }
    },
    computed: {
        ...mapGetters(['tokens', 'loggedIn', 'history', 'markets', 'account', 'historyLen'])
    }
}
</script>

<style scoped>
    th {
        background-color: rgba(255,255,255,0.05);
        border-right: 1px solid var(--background-dark);
    }

    tr {
        transition: background-color 0.5s ease-in-out;
    }

    tr:hover {
        background-color: rgba(255,255,255,0.02);
    }

    .bottom-nav {
        display: flex;
        justify-content: flex-end;
    }

    .bottom-nav .btn {
        display: flex;
        align-items: center;
    }

    .btn i {
        font-size: 1em;
    }

    .bottom-nav .btn:first-child {
        padding-right: 15px;
    }

    .bottom-nav .btn:last-child {
        padding-left: 15px;
        margin-left: 15px;
    }

    .frow {
        display: flex;
        align-items: center;
    }
</style>
