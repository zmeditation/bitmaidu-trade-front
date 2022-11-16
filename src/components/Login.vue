<template>
    <div class="modal-wrapper"
         v-bind:class="modalLoginActive ? '' : 'hide'"
    v-on:click.stop="hideModal()">
        <div class="modal" v-on:click.stop>
            <div class="modal-header">
                <h5>{{ tokens.SignIn }} <i class="material-icons close" v-on:click.stop="hideModal">close</i> </h5>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <label for="login">{{ tokens.Login }}:</label>
                    <input type="text" id="login" :value="login" @input="updateLoginVal">
                </div>
                <div class="form-row">
                    <label for="password">{{ tokens.Password }}:</label>
                    <input type="password" id="password" :value="password" @input="updatePasswordVal">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary"
                    v-on:click="processLogin()"
                >{{ tokens.SignIn }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {LOGIN} from "@/store/actions.type";
    import {mapGetters} from "vuex";
    import {MODAL_LOGIN} from "@/store/mutations.type";

    export default {
        name: "Login",
        data() {
            return {
                login: '',
                password: ''
            }
        },
        methods : {
            hideModal() {
                this.login = '';
                this.password = '';
                this.$store.commit(MODAL_LOGIN, false);
            },
            processLogin() {
                this.$store.dispatch(LOGIN, {
                    email: this.login,
                    password: this.password
                })
            },
            updateLoginVal(e) {
                this.login = e.target.value
            },
            updatePasswordVal(e) {
                this.password = e.target.value
            }
        },
        computed: {
            ...mapGetters(['tokens', 'modalLoginActive', 'loggedIn'])
        }
    }
</script>

<style scoped>
    .modal {
        width: 300px;
    }

    .modal-body {
        border-bottom: none;
    }
</style>
