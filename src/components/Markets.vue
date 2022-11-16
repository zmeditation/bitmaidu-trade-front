<template>
    <div class="markets flex-col app-item">
        <h5>{{ tokens.Markets }} <i class="material-icons pointer fav-toggle"
            v-on:click="favActive = !favActive"
            v-bind:class="{active: favActive}"
        >star_half</i></h5>
        <div class="tabs">
            <span
                v-bind:class="{active: tabActive === 'all'}"
                v-on:click="tabActive = 'all'"
            >{{ tokens.All }}</span>
            <span
                v-bind:class="{active: tabActive === 'BTC'}"
                v-on:click="tabActive = 'BTC'"
            >BTC</span>
            <span
                v-bind:class="{active: tabActive === 'USDT'}"
                v-on:click="tabActive = 'USDT'"
            >USDT</span>
            <span
                v-bind:class="{active: tabActive === 'ETH'}"
                v-on:click="tabActive = 'ETH'"
            >ETH</span>
            <span style="margin-left: auto" class="active">
                SPOT
            </span>
            <span v-on:click="openMargin">
                MARGIN
            </span>
        </div>
        <input type="text" placeholder="Search..." class="search" />
        <table>
            <thead>
            <tr>
                <th>{{ tokens.Instrument }}</th>
                <th>{{ tokens.LastPrice }}</th>
                <th class="no-mobile">{{ tokens.Change }}</th>
                <th>{{ tokens.Volume }}</th>
                <th></th>
            </tr>
            </thead>
        </table>
        <div class="scroll">
            <table>
                <tbody>
                <template inline-template>
                    <tr v-for="market in markets"
                        v-bind:key="market.symbol"
                        v-bind:class="{hide: (tabActive !== 'all' && market.base_currency !== tabActive) || (favActive && symbolsFavorite.indexOf(market.symbol) === -1)}"
                        class="pointer"
                        v-on:click="changeSymbol(market.symbol)"
                    >
                        <td>
                            <span>{{market.alias.split('/')[0]}}</span>
                            <span class="pad">/</span>
                            <span class="grey">{{market.alias.split('/')[1]}}</span>
                        </td>
                        <td v-bind:class="market.quote.changeDir > 0 ? 'green' : (market.quote.changeDir < 0 ? 'red' : '')" class="no-mobile">
                            {{ (market.quote && market.quote.bid ? market.quote.bid : 0).toFixed(market.precision)}}
                        </td>
                        <td v-bind:class="market.quote && market.quote.changePct > 0 ? 'green' : (market.quote && market.quote.changePct < 0 ? 'red' : '')">
                            {{ (market.quote && market.quote.changePct > 0 ? '+' : '')+(market.quote && market.quote.changePct ? market.quote.changePct : 0).toFixed(2)+'%'}}
                        </td>
                        <td>
                            <span>{{ (market.quote && market.quote.volume24h ? market.quote.volume24h : 0).toFixed(3)}}</span>
                            <span class="grey pad">{{market.foreign_currency}}</span>
                        </td>
                        <td class="fav">
                            <i class="material-icons pointer"
                               v-on:click.stop="addFav(market.symbol)"
                               v-bind:class="{active: favActive}"
                            >{{ symbolsFavorite.indexOf(market.symbol) === -1 ? 'star_outline' : 'star'}}</i>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {SYMBOL_ACTIVE, SYMBOL_FAVORITE} from "@/store/mutations.type";
    import {MARGIN_URL} from "@/common/config";

    export default {
        name: "Markets",
        data() {
            return {
                tabActive: 'all',
                favActive: false
            }
        },
        methods: {
            changeSymbol(symbol) {
                this.$store.commit(SYMBOL_ACTIVE, symbol)
            },
            addFav(symbol) {
                this.$store.commit(SYMBOL_FAVORITE, {
                    action: this.symbolsFavorite.indexOf(symbol) === -1 ? 'add' : 'remove',
                    symbol
                })
            },
            openMargin() {
                window.location = MARGIN_URL
            }
        },
        computed: {
            ...mapGetters(['tokens', 'markets', 'symbolsFavorite'])
        }
    }
</script>

<style scoped>
    .markets {
        background-color: var(--background-dark);
    }

    .search {
        position: relative;
        margin: 10px 0;
        font-size: 0.8em;
    }

    .fav {
        text-align: right;
        width: 30px;
    }

    .fav i {
        font-size: 1.2em;
    }

    i.active {
        color: var(--brand)
    }

    tbody tr:hover {
        background-color: rgba(0,0,0,0.3);
    }

    table {
        margin: 0;
    }

    td, th {
        width: 23%;
    }

    td:last-child, th:last-child {
        width: 8%;
    }

    .scroll {
        flex: 1 1 300px;
    }
</style>
