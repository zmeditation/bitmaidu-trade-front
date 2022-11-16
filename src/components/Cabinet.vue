<template>
    <div class="modal-wrapper"
         v-bind:class="modalCabinetActive ? '' : 'hide'"
         v-on:click.stop="hideModal()">
        <div class="modal" v-on:click.stop>
            <div class="modal-header">
                <h5>Client Area</h5>
                <i class="material-icons close-button" v-on:click="hideModal()">close</i>
            </div>
            <div class="modal-body">
                <div class="cabinet-tabs">
                    <div class="cabinet-tab"
                        v-bind:class="{active: current === 'profile'}"
                        v-on:click="current = 'profile'"
                    >
                        <span>Profile</span>
                        <i class="material-icons">settings</i>
                    </div>
                    <div class="cabinet-tab"
                         v-bind:class="{active: current === 'balances'}"
                         v-on:click="current = 'balances'"
                    >
                        <span>Balances</span>
                        <i class="material-icons">toll</i>
                    </div>
                    <div class="cabinet-tab"
                         v-bind:class="{active: current === 'deposit'}"
                         v-on:click="current = 'deposit'"
                    >
                        <span>Deposit</span>
                        <i class="material-icons">account_balance_wallet</i>
                    </div>
                    <div class="cabinet-tab"
                         v-bind:class="{active: current === 'withdrawal'}"
                         v-on:click="current = 'withdrawal'"
                    >
                        <span>Withdrawals</span>
                        <i class="material-icons">payment</i>
                    </div>
                </div>
                <div class="content">
                    <Profile v-bind:class="{hide: current !== 'profile'}"></Profile>
                    <Balances v-bind:class="{hide: current !== 'balances'}"></Balances>
                    <Deposit v-bind:class="{hide: current !== 'deposit'}"></Deposit>
                    <DepositsTable v-bind:class="{hide: current !== 'deposit'}"></DepositsTable>
                    <Withdrawal v-bind:class="{hide: current !== 'withdrawal'}"></Withdrawal>
                    <WithdrawalsTable v-bind:class="{hide: current !== 'withdrawal'}"></WithdrawalsTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Deposit from "@/components/Cabinet/Deposit";
    import Profile from "@/components/Cabinet/Profile";
    import Withdrawal from "@/components/Cabinet/Withdrawal";
    import DepositsTable from "@/components/Cabinet/DepositsTable";
    import WithdrawalsTable from "@/components/Cabinet/WithdrawalsTable";
    import {MODAL_CABINET} from "@/store/mutations.type";
    import Balances from "@/components/Cabinet/Balances";

    export default {
        name: "Cabinet",
        components: {Balances, WithdrawalsTable, DepositsTable, Withdrawal, Profile, Deposit},
        data() {
            return {
                current: 'profile'
            }
        },
        computed: {
            ...mapGetters(['modalCabinetActive'])
        },
        methods: {
            hideModal() {
                this.$store.commit(MODAL_CABINET, false)
            }
        }
    }
</script>

<style scoped>
    .modal {
        width: 80%;
        min-height: 80%;
        height: 80%;
        flex-direction: column;
    }

    .close-button {
        color: var(--font);
        cursor: pointer;
        margin-right: 10px;
    }

    .modal-body {
        flex-direction: row;
    }

    .cabinet-tabs {
        margin-top: 0;
        display: flex;
        flex-direction: column;
        flex: 1 1 20%;
        background-color: var(--background);
    }

    .cabinet-tab {
        padding: 20px;
        cursor: pointer;
        font-size: 1.2em;
        display: flex;
        justify-content: space-between;
    }

    .cabinet-tab.active, .cabinet-tab:hover {
        background-color: var(--background-dark);
    }

    .content {
        flex: 4 1 80%;
        background-color: var(--background-dark);
        padding: 1rem 2rem;
    }
</style>
