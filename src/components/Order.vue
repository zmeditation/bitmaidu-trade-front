<template>
    <div class="order app-item">
        <h5>
            <span>{{ tokens.NewOrder }}</span>
            <div class="tabs">
            <span
                v-bind:class="{active: tabActive === 'limit'}"
                v-on:click="tabActive = 'limit'"
            >{{ tokens.Limit }}</span>
            <span
                v-bind:class="{active: tabActive === 'market'}"
                v-on:click="tabActive = 'market'"
            >{{ tokens.Market }}</span>
            <span
                v-bind:class="{active: tabActive === 'stop'}"
                v-on:click="tabActive = 'stop'"
            >{{ tokens.Stop }}</span>
            </div>
        </h5>
        <div class="form-row">
            <label>{{ tokens.Direction }}</label>
            <div class="direction-buttons">
                <div :class="{inactive: direction !== 'buy'}" v-on:click="direction = 'buy'">{{ tokens.BUY }}</div>
                <div :class="{inactive: direction !== 'sell'}" v-on:click="direction = 'sell'">{{ tokens.SELL }}</div>
            </div>
        </div>
        <div class="form-row" v-bind:class="{hide: tabActive !== 'limit'}">
            <label>{{ tokens.Price }}</label>
            <input type="text" v-model="price"/>
            <span class="cur">{{ markets[symbolActive] ? markets[symbolActive].base_currency : ''}}</span>
        </div>
        <div class="form-row" v-bind:class="{hide: tabActive !== 'stop'}">
            <label>{{ tokens.StopPrice }}</label>
            <input type="text" v-model="stopPrice"/>
            <span class="cur">{{ markets[symbolActive] ? markets[symbolActive].base_currency : ''}}</span>
        </div>
        <div class="form-row">
            <label>{{ tokens.Amount }}</label>
            <input type="text" v-model="quantity"/>
            <span class="cur pointer" v-on:click="changeQuantityCur">{{ markets[symbolActive] ? markets[symbolActive][quantityCur+'_currency'] : '' }}</span>
        </div>
        <div class="form-row">
            <label>&nbsp;</label>
            <div class="amount-buttons">
                <div v-on:click="quantity = (0.1 * (direction === 'buy' ? wallet.base.available / price : wallet.foreign.available) + Number.EPSILON).toFixed(8 - markets[symbolActive].precision)">10%</div>
                <div v-on:click="quantity = (0.25 * (direction === 'buy' ? wallet.base.available / price : wallet.foreign.available) + Number.EPSILON).toFixed(8 - markets[symbolActive].precision)">25%</div>
                <div v-on:click="quantity = (0.5 * (direction === 'buy' ? wallet.base.available / price : wallet.foreign.available) + Number.EPSILON).toFixed(8 - markets[symbolActive].precision)">50%</div>
                <div v-on:click="quantity = (0.75 * (direction === 'buy' ? wallet.base.available / price : wallet.foreign.available) + Number.EPSILON).toFixed(8 - markets[symbolActive].precision)">75%</div>
                <div v-on:click="quantity = (1 * (direction === 'buy' ? wallet.base.available / price : wallet.foreign.available) + Number.EPSILON).toFixed(8 - markets[symbolActive].precision)">100%</div>
            </div>
        </div>
        <div class="form-row buttons">
            <span class="btn btn-brand" v-on:click="orderRequest(0)">{{ tokens.PlaceOrder }}</span>
        </div>
        <div class="form-row space-between">
            <h4>{{ tokens.TradeInformation }}</h4>
        </div>
        <div class="two-cols form-row">
            <div class="onecol">
                <span class="info"><span class="grey">{{ tokens.Amount }} {{markets[symbolActive] ? markets[symbolActive].foreign_currency : ''}}:</span><span>{{ parseFloat(quantityForeign).toFixed(8 - markets[symbolActive].precision) }}</span></span>
                <span class="info"><span class="grey">{{ tokens.Available }} {{markets[symbolActive] ? markets[symbolActive].foreign_currency : ''}}:</span><span>{{ wallet.foreign.available.toFixed(8 - markets[symbolActive].precision) }}</span></span>
            </div>
            <div class="onecol">
                <span class="info"><span class="grey">{{ tokens.Amount }} {{markets[symbolActive] ? markets[symbolActive].base_currency : ''}}:</span><span>{{ (quantityForeign * (tabActive === 'stop' ? stopPrice : (tabActive === 'limit' ? price : (markets[symbolActive].quote ? markets[symbolActive].quote.bid : 0)))).toFixed(markets[symbolActive].precision) }}</span></span>
                <span class="info"><span class="grey">{{ tokens.Available }} {{markets[symbolActive] ? markets[symbolActive].base_currency : ''}}:</span><span>{{ wallet.base.available.toFixed(8 - markets[symbolActive].precision) }}</span></span>

            </div>
        </div>
        <div class="modal-wrapper"
             v-bind:class="modalOrderConfirmActive ? '' : 'hide'"
             v-on:click.stop="hideModal">
            <div class="modal" v-on:click.stop>
                <div class="modal-header">
                    <h5>{{ tokens.ConfirmOrder }} <i class="material-icons close" v-on:click.stop="hideModal">close</i> </h5>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        <span class="confirmation-text">{{ confirmationText }}</span>
                    </div>
                    <div class="form-row checkbox-row">
                        <input type="checkbox" v-model="dontAsk">
                        <label>{{tokens.DontAsk }}</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary"
                            v-on:click="hideModal"
                    >{{ tokens.Cancel }}</button>
                    <button class="btn btn-primary"
                            v-on:click="confirm"
                    >{{ tokens.Confirm }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {CONFIRM_ORDER, MODAL_CALCULATOR, MODAL_LOGIN, MODAL_ORDER_CONFIRM} from "@/store/mutations.type";
    import {ORDER_REQUEST} from "@/store/actions.type";

    export default {
        name: "Order",
        data() {
            return {
                tabActive: 'limit',
                direction: 'buy',
                quantity: 0,
                price: 0,
                stopPrice: 0,
                quantityCur: 'foreign',
                orderToConfirm: {
                    side: 0,
                    symbol: '',
                    type: 'LIMIT',
                    quantity: 0,
                    price: 0,
                    priceStop: 0
                },
                dontAsk: false
            }
        },
        methods: {
            orderRequest() {
                if (!this.loggedIn) {
                    this.$store.commit(MODAL_LOGIN, true)
                    return
                }

                let data = {
                    side: this.direction === 'buy' ? 1 : 0,
                    symbol: this.symbolActive,
                    type: this.tabActive.toUpperCase(),
                    quantity: this.quantity
                }

                if (this.tabActive === 'limit') {
                    data.price = this.price

                    data.quantity = this.quantityCur === 'foreign' ? data.quantity : data.quantity / data.price
                }

                if (this.tabActive === 'stop') {
                    data.price_stop = this.stopPrice

                    data.quantity = this.quantityCur === 'foreign' ? data.quantity : data.quantity / data.price_stop
                }

                if (this.tabActive === 'market') {
                    data.quantity = this.quantityCur === 'foreign' ? data.quantity : data.quantity / this.markets[this.symbolActive].quote.bid * 0.999
                }

                if (this.confirmOrder) {
                    for(let n in data) {
                        this.orderToConfirm[n] = data[n]
                    }

                    this.$store.commit(MODAL_ORDER_CONFIRM, true)
                } else {
                    this.$store.dispatch(ORDER_REQUEST, data)
                }
            },
            showCalculator() {
                this.$store.commit(MODAL_CALCULATOR, true)
            },
            changeQuantityCur() {
                this.quantityCur = this.quantityCur === 'base' ? 'foreign' : 'base'
            },
            hideModal() {
                this.$store.commit(MODAL_ORDER_CONFIRM, false)
            },
            confirm() {
                this.$store.commit(MODAL_ORDER_CONFIRM, false)
                this.$store.dispatch(ORDER_REQUEST, this.orderToConfirm)

                if (this.dontAsk) {
                    this.$store.commit(CONFIRM_ORDER, false)
                }
            }
        },
        computed: {
            ...mapGetters(['tokens', 'markets', 'symbolActive', 'account', 'loggedIn', 'modalOrderConfirmActive', 'confirmOrder']),
            wallet() {
                let wallet = {
                    foreign: {
                        balance: 0,
                        available: 0
                    },
                    base: {
                        balance: 0,
                        available: 0
                    }
                },
                    baseCur = this.markets[this.symbolActive].base_currency,
                    foreignCur = this.markets[this.symbolActive].foreign_currency

                if (this.account.wallets[foreignCur] !== undefined) {
                    wallet.foreign.balance = this.account.wallets[foreignCur].balance
                    wallet.foreign.available = this.account.wallets[foreignCur].balance
                }

                if (this.account.wallets[baseCur] !== undefined) {
                    wallet.base.balance = this.account.wallets[baseCur].balance
                    wallet.base.available = this.account.wallets[baseCur].balance
                }

                for(let n in this.orders) {
                    let order = this.orders[n],
                        cur = order.side ? this.markets[order.symbol].base_currency : this.markets[order.symbol].foreign_currency

                    if (cur === baseCur) {
                        wallet.base.available -= order.price * (order.quantity - order.quantity_filled)
                    }

                    if (cur === foreignCur) {
                        wallet.foreign.available -= (order.quantity - order.quantity_filled)
                    }
                }

                return wallet
            },
            quantityForeign() {
                if (this.quantityCur === 'foreign') {
                    return this.quantity
                }

                if (this.tabActive === 'market') {
                    return this.quantity / this.markets[this.symbolActive].quote.bid
                }

                if (this.tabActive === 'stop') {
                    return this.quantity / this.stopPrice
                }

                return this.price ? this.quantity / this.price : 0
            },
            confirmationText() {
                if (!this.modalOrderConfirmActive) {
                    return ''
                }
                let text = this.tokens['OrderConfirmationText'+this.orderToConfirm.type]

                text = text.split('%symbol%').join(this.markets[this.orderToConfirm.symbol].alias).split('%side%').join(this.tokens[this.orderToConfirm.side ? 'BUY' : 'SELL']).split('%quantity%').join(this.orderToConfirm.quantity)

                if (this.orderToConfirm.type === 'LIMIT') {
                    text = text.split('%price%').join(this.orderToConfirm.price)
                }

                if (this.orderToConfirm.type === 'STOP') {
                    text = text.split('%price%').join(this.orderToConfirm.priceStop)
                }

                return text
            }
        }
    }
</script>

<style scoped>
    .form-row {
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    h5 {
        margin-bottom: 15px
    }

    label {
        margin-right: 15px;
        flex: 0 0 70px;
        text-align: right;
    }

    .cur {
        background-color: var(--background);
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border: 1px solid var(--background-dark);
        border-radius: 0.25rem;
    }

    .buttons .btn {
        padding: 0.5em;
        flex: 1 1 auto;
        margin: 20px 0;
        font-size: 1.2em;
        transition: box-shadow 0.3s ease-in-out;
    }

    .buttons .btn:hover {
        -webkit-box-shadow: inset 0px 0px 20px 0px rgba(0,0,0,0.5);
        -moz-box-shadow: inset 0px 0px 20px 0px rgba(0,0,0,0.5);
        box-shadow: inset 0px 0px 20px 0px rgba(0,0,0,0.5);
    }

    .buttons .btn-buy {
        background-color: var(--green);
        margin-left: 20px;
    }

    .buttons .btn-sell {
        background-color: var(--red);
    }

    .buttons .btn-brand {
        background-color: var(--brand);
    }

    .info {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
    }

    .grey {
        margin: 0 10px 5px 0;
    }

    .slider {
        width: 100% !important;
        margin: 0 20px
    }

    .buttons {
        display: flex;
        align-items: center;
    }

    .amount-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1 1 auto
    }

    .amount-buttons div {
        flex: 1 1 auto;
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        border-radius: 3px;
        border: 1px solid var(--background);
        cursor: pointer;
        background-color: var(--background);
        transition: 0.3s background-color ease-in-out;
    }

    .amount-buttons div:last-child {
        margin-right: 0;
    }

    .amount-buttons div:hover {
        background-color: transparent;
    }

    .confirmation-text {
        font-size: 1.2em;
        line-height: 1.5;
    }

    .direction-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1 1 auto;
    }

    .direction-buttons div {
        flex: 1 1 50%;
        border-radius: 3px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .direction-buttons div.inactive {
        background-color: var(--secondary-button) !important;
    }

    .direction-buttons div:first-child {
        margin-right: 10px;
        background-color: var(--green);
    }

    .direction-buttons div:last-child {
        background-color: var(--red);
    }
</style>
