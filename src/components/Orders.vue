<template>
    <div class="orders app-item flex-col">
        <h5>
            <span>{{ tokens.Trading }}</span>
            <div class="tabs">
            <span
                v-bind:class="{active: tabActive === 'orders'}"
                v-on:click="tabActive = 'orders'"
            >{{ tokens.Orders }}</span>
            <span
                v-bind:class="{active: tabActive === 'stops'}"
                v-on:click="tabActive = 'stops'"
            >{{ tokens.Stops }}</span>
            <span
                v-bind:class="{active: tabActive === 'history'}"
                v-on:click="tabActive = 'history'"
            >{{ tokens.History }}</span>
            </div>
        </h5>
        <div class="login-banner" v-bind:class="{hide: loggedIn}">
            <div>
                <span>{{ tokens.Please }}</span>
                <span class="btn btn-primary pad" v-on:click="showLogin">{{ tokens.SignIn }}</span>
                <span>{{ tokens.toStartTrading }}</span>
            </div>
        </div>
        <div class="table-container">
            <OrdersTable v-bind:class="{hide: tabActive !== 'orders' && tabActive !== 'stops'}" :filter="tabActive"/>
            <HistoryTable v-bind:class="{hide: tabActive !== 'history'}"/>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {MODAL_LOGIN} from "@/store/mutations.type";
    import OrdersTable from "@/components/OrdersTable";
    import HistoryTable from "@/components/HistoryTable";

    export default {
        name: "Orders",
        components: {HistoryTable, OrdersTable},
        data() {
            return {
                tabActive: 'orders'
            }
        },
        methods: {
            showLogin() {
                this.$store.commit(MODAL_LOGIN, true)
            }
        },
        computed: {
            ...mapGetters(['tokens', 'loggedIn'])
        }
    }
</script>

<style scoped>
    .login-banner {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
    }

    .table-container {
        overflow-x: scroll;
    }
</style>
