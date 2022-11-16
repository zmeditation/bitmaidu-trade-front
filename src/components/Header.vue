<template>
    <div class="flex-row">
        <div class="header flex-col">
            <div class="info">
                <img class="logo" src="@/assets/logo.svg" />
                <!-- <span class="logo-text">{{ companyName }}</span> -->
                <div class="buttons-mobile">
                <span class="btn btn-primary info-item"
                      v-on:click="showCabinet"
                      v-bind:class="{hide: !loggedIn}"
                >{{ tokens.Account }}</span>
                    <span class="btn btn-primary info-item"
                          v-on:click="logout"
                          v-bind:class="{hide: !loggedIn}"
                    >{{ tokens.SignOut }}</span>
                    <span class="info-item language">
                    <span class="flag-icon" :class="'flag-icon-'+langActive"></span>
                    <ul>
                        <li v-on:click="changeLang('gb')"><span class="flag-icon flag-icon-gb"></span> English</li>
                        <li v-on:click="changeLang('ru')"><span class="flag-icon flag-icon-ru"></span> Русский</li>
                        <li v-on:click="changeLang('jp')"><span class="flag-icon flag-icon-jp"></span> Japanese</li>
                    </ul>
                </span>
                </div>
            </div>
            <div class="info">
            <span class="info-item" v-bind:class="{hide: !loggedIn}">
                <i class="material-icons">account_circle</i>
                <span>{{user.fullname}}</span>
            </span>
            <div class="buttons">
                <span class="btn btn-primary info-item"
                      v-on:click="showLogin"
                      v-bind:class="{hide: loggedIn}"
                >{{ tokens.SignIn }}</span>
                <span class="btn btn-primary info-item"
                      v-on:click="showCabinet"
                      v-bind:class="{hide: !loggedIn}"
                >{{ tokens.Account }}</span>
                <span class="btn btn-primary info-item"
                      v-on:click="showSupport"
                      v-bind:class="{hide: !loggedIn}"
                >Support Chat</span>
                <span class="btn btn-primary info-item"
                      v-on:click="logout"
                      v-bind:class="{hide: !loggedIn}"
                >{{ tokens.SignOut }}</span>
                <span class="info-item language">
                    <span class="flag-icon" :class="'flag-icon-'+langActive"></span>
                    <ul>
                        <li v-on:click="changeLang('gb')"><span class="flag-icon flag-icon-gb"></span> English</li>
                        <li v-on:click="changeLang('ru')"><span class="flag-icon flag-icon-ru"></span> Русский</li>
                        <li v-on:click="changeLang('jp')"><span class="flag-icon flag-icon-jp"></span> Japanese</li>
                    </ul>
                </span>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {LANG, MODAL_CABINET, MODAL_LOGIN, MODAL_SUPPORT} from "@/store/mutations.type";
    import {LOGOUT} from "@/store/actions.type";
    import {COMPANY_NAME, SEPARATE_CABINET, SEPARATE_LOGIN} from "@/common/config";

    export default {
        name: "Header",
        data() {
            return {
                companyName: COMPANY_NAME
            }
        },
        methods: {
            showLogin() {
                if (SEPARATE_LOGIN) {
                    window.location = SEPARATE_LOGIN
                } else {
                    this.$store.commit(MODAL_LOGIN, true)
                }
            },
            showSupport() {
                this.$store.commit(MODAL_SUPPORT, true)
            },
            showCabinet() {
                if (SEPARATE_CABINET) {
                    window.location = '/cabinet'
                } else {
                    this.$store.commit(MODAL_CABINET, true)
                }
            },
            logout() {
                this.$store.dispatch(LOGOUT)
            },
            changeLang(lang) {
                this.$store.commit(LANG, lang)
            }
        },
        computed: {
            ...mapGetters(['tokens', 'loggedIn', 'user', 'account', 'orders', 'langActive'])
        }
    }
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px 0;
        flex: 1 1 auto;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .logo {
        width: 10em;
        padding-top: 0;
        margin-top: -10px;
    }
    @media (max-width: 767px) {
        .logo {
            width: 7em;
            margin-top: -10px;
        }
    }

    .logo-text {
        font-size: 1.3em;
        flex: 1 1 auto;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
        margin-left: 15px;
    }

    i {
        font-size: 1.4em;
        margin-right: 5px;
    }

    .info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .info:first-child {
        flex: 1 1 auto;
        margin-top: 8px;
    }

    .info-item {
        margin-left: 15px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .grey {
        margin-right: 3px;
    }

    .language {
        position: relative;
    }

    .language ul {
        position: absolute;
        z-index: 3;
        top: 10px;
        right: -20px;
        display: none;
        list-style-type: none;
        padding: 10px;
    }

    .language li {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        background: var(--background);
        transition: background-color 0.3s ease-in-out;
    }

    .language li:hover {
        cursor: pointer;
        background: var(--background-dark);
    }

    .language:hover ul {
        display: block;
    }

    .language ul:hover {
        display: block;
    }

    .flag-icon {
        margin-right: 10px;
    }

    @media (max-width: 767px) {
        .buttons {
            display: none !important;
        }

        .buttons-mobile {
            display: flex !important;
        }
    }

    .buttons {
        display: flex;
    }

    .buttons-mobile {
        display: none;
    }
</style>
