<template>
    <div class="orderbook app-item flex-col">
        <h5>
            <span>{{ tokens.OrderBook }}</span>
        </h5>
        <table>
            <thead>
            <tr>
                <th>{{ tokens.Price }} <span class="grey pad">{{markets[symbolActive] ? markets[symbolActive].base_currency : ''}}</span></th>
                <th>{{ tokens.Amount }} <span class="grey pad">{{markets[symbolActive] ? markets[symbolActive].foreign_currency : ''}}</span></th>
                <th>{{ tokens.Total }} <span class="grey pad">{{markets[symbolActive] ? markets[symbolActive].base_currency : ''}}</span></th>
            </tr>
            </thead>
        </table>
        <div class="book-container">
            <div class="asks">
                <table>
                    <tbody>
                    <template inline-template>
                        <tr v-for="book in orderBook.asks.slice(0,15).reverse()"
                            v-bind:key="'asks-'+book[0]"
                            v-bind:style="{
                        background: 'linear-gradient(90deg, var(--background-dark) '+(100-(bookMax ? book[1]/bookMax : 0)*100)+'%, rgba(189,112,100,0.2) '+((bookMax ? book[1]/bookMax : 0)*100)+'%)'
                    }"
                        class="new"
                        :class="'delay-'+(book[2] || 0)">
                            <td>{{book[0].toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0)}}</td>
                            <td>{{book[1]}}</td>
                            <td>{{ (book[0]*book[1]).toFixed(4)}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <div class="last-price">
                <span>{{ (orderBook.bids[0] && orderBook.asks[0] ? orderBook.bids[0][0] + (orderBook.asks[0][0] - orderBook.bids[0][0])/2 : 0).toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0)}}</span>
            </div>
            <div class="bids">
                <table>
                    <tbody>
                    <template inline-template>
                        <tr v-for="book in orderBook.bids.slice(0,15)"
                            v-bind:key="'bids-'+book[0]"
                            v-bind:style="{
                        background: 'linear-gradient(90deg, var(--background-dark) '+(100-(bookMax ? book[1]/bookMax : 0)*100)+'%, rgba(64,151,137,0.2) '+((bookMax ? book[1]/bookMax : 0)*100)+'%)'
                    }"
                        class="new"
                        :class="'delay-'+(book[2] || 0)">
                            <td>{{book[0].toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0)}}</td>
                            <td>{{book[1]}}</td>
                            <td>{{ (book[0]*book[1]).toFixed(markets[symbolActive] ? markets[symbolActive].precision : 0)}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Orderbook",
        computed: {
            ...mapGetters(['tokens', 'markets', 'symbolActive', 'orderBook']),
            bookMax() {
                let max = null

                for(let n in this.orderBook.bids) {
                    if (max === null || this.orderBook.bids[n][1] > max) {
                        max = this.orderBook.bids[n][1]
                    }
                }

                for(let n in this.orderBook.asks) {
                    if (max === null || this.orderBook.asks[n][1] > max) {
                        max = this.orderBook.asks[n][1]
                    }
                }

                if (max === null) {
                    max = 0
                }

                return max
            }
        }
    }
</script>

<style scoped>
    .orderbook {
        position: relative;
        overflow: hidden;
        min-height: 400px;
    }

    table {
        margin: 0
    }

    h5 {
        margin-bottom: 20px;
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

    .depthchart {
        height: 100%;
        position: absolute;
        left: 15px;
        top: 50px;
        bottom: 15px;
        right: 15px;
        overflow: hidden;
    }

    .scroll {
        flex: 1 1 400px
    }

    .book-container {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1 1 auto
    }

    .book-container .asks, .book-container .bids {
        flex: 1 0 50%;
        display: flex;
        overflow: hidden;
        max-height: 230px;
        min-height: 230px;
    }

    .book-container .asks {
        align-items: flex-end
    }

    .book-container .last-price {
        display: flex;
        flex: 1 0 30px;
        align-items: center;
        justify-content: center;
        font-size: 1.4em;
        margin: 10px 0
    }

    tr.new td {
        animation: blink 1s ease;
    }

    tr.delay-1 td {
        animation-delay: 50ms
    }

    tr.delay-2 td {
        animation-delay: 100ms
    }

    tr.delay-3 td {
        animation-delay: 150ms
    }

    tr.delay-4 td {
        animation-delay: 200ms
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
