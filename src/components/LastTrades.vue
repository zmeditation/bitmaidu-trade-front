<template>
    <div class="lasttrades app-item flex-col">
        <h5>
            <span>{{ tokens.LastTrades }}</span>
            <div class="tabs">
            <span
                v-bind:class="{active: tabActive === 'all'}"
                v-on:click="tabActive = 'all'"
            >{{ tokens.All }}</span>
            <span
                v-bind:class="{active: tabActive === 'my'}"
                v-on:click="tabActive = 'my'"
            >{{ tokens.My }}</span>
            </div>
        </h5>
        <table>
            <thead>
            <tr>
                <th>{{ tokens.Time }}</th>
                <th>{{ tokens.Price }}</th>
                <th>{{ tokens.Amount }}</th>
            </tr>
            </thead>
        </table>
        <div class="scroll">
            <table class="body" v-bind:class="{hide: tabActive === 'my'}">
                <tbody>
                <template inline-template>
                    <tr v-for="trade in lastTrades"
                        v-bind:key="trade.id"
                        v-bind:class="trade.side ? 'buy' : 'sell'"
                        class="new"
                    >
                        <td>{{ new Date(trade.time).toLocaleString().split(' ')[1] }}</td>
                        <td>{{ trade.price.toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0) }}</td>
                        <td>{{ trade.quantity }}</td>
                    </tr>
                </template>
                </tbody>
            </table>
            <table class="body" v-bind:class="{hide: tabActive === 'all'}">
                <tbody>
                <template inline-template>
                    <tr v-for="trade in trades"
                        v-bind:key="trade.id"
                        v-bind:class="trade.side ? 'buy' : 'sell'"
                        class="new"
                    >
                        <td>{{ new Date(trade.time).toLocaleString().split(' ')[1] }}</td>
                        <td>{{ trade.price.toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0) }}</td>
                        <td>{{ trade.quantity }}</td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {timeToString} from "@/common/helpers";

    export default {
        name: "LastTrades",
        data() {
            return {
                tabActive: 'all'
            }
        },
        computed: {
            ...mapGetters(['tokens', 'markets', 'lastTrades', 'trades', 'symbolActive'])
        },
        methods: {
            timeToString: timeToString
        }
    }
</script>

<style scoped>
    .td {
        border-bottom: 2px solid var(--background-dark);
    }

    .buy {
        background: rgb(28,28,28);
        background: linear-gradient(90deg, rgba(64,151,137,0) 0%, rgba(64,151,137,0.1) 77%, rgba(64,151,137,0.2) 100%);
    }

    .sell {
        background: rgb(28,28,28);
        background: linear-gradient(90deg, rgba(189,112,100,0) 0%, rgba(189,112,100,0.1) 77%, rgba(189,112,100,0.2) 100%);
    }

    table.body {
        margin: 0;
    }

    tr {
        background-attachment: fixed;
        display: flex;
        justify-content: space-between;
    }

    th, td {
        display: flex;
        font-size: 0.8em;
        flex: 1 1 33.3%;
        justify-content: center;
    }

    .scroll {
        flex: 1 1 400px
    }

    tr.new td {
        animation: blink 1s ease;
    }

    @keyframes blink {
        0% {
            background-color: #4e4e0e;
        }
        100% {
            background-color: transparent;
        }
    }
</style>
