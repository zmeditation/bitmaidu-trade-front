<template>
    <div class="modal-wrapper"
         v-bind:class="modalSupportActive ? '' : 'hide'"
         v-on:click.stop="hideModal">
        <div class="modal" v-on:click.stop>
            <div class="modal-header">
                <h5>Live Chat <i class="material-icons close" v-on:click.stop="hideModal">close</i> </h5>
            </div>
            <div class="modal-body">
                <div class="scroll-container" id="support-messages">
                    <template>
                        <div v-for="message in supportMessages"
                             :key="message.id"
                             :class="message.manager_id ? 'from-manager' : 'from-client'"
                             class="message"
                        >
                            <div class="box">
                                <span class="text">{{ message.text }}</span>
                                <span class="time">{{ timeToString(message.time_created*1000).split(' ')[1]+' '+timeToString(message.time_created*1000).split(' ')[0].slice(0,5) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="form-row">
                    <textarea v-model="message" @keyup.enter="sendMessage"/>
                    <button class="btn btn-primary"><i class="material-icons" v-on:click="sendMessage">send</i> Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {SUPPORT_SEND} from "@/store/actions.type";
import {mapGetters} from "vuex";
import {MODAL_SUPPORT} from "@/store/mutations.type";
import {timeToString} from "@/common/helpers";

export default {
    name: "Support",
    data() {
        return {
            message: ''
        }
    },
    methods : {
        hideModal() {
            this.login = '';
            this.password = '';
            this.$store.commit(MODAL_SUPPORT, false)
        },
        sendMessage() {
            if (!this.message) {
                return
            }
            this.$store.dispatch(SUPPORT_SEND, this.message)
            this.message = ''
        },
        timeToString
    },
    computed: {
        ...mapGetters(['tokens', 'modalSupportActive', 'supportMessages'])
    },
    watch: {
        supportMessages() {
            setTimeout(() => {
                let container = document.getElementById("support-messages")
                container.scrollTop = container.scrollHeight
            }, 300)
        }
    }
}
</script>

<style scoped>
    .modal {
        width: 600px;
        height: 80%;
        min-height: 500px;
        background: var(--background-dark);
    }

    .modal-body {
        border-bottom: none;
        overflow: hidden;
        border-top-color: var(--background-dark);
    }

    .scroll-container {
        overflow-y: scroll;
        flex: 1 1 auto;
        padding: 0 20px;
    }

    .form-row {
        margin-top: 15px;
        flex: 0 0 100px;
        display: flex;
        align-items: stretch;
        flex-direction: row !important;
    }

    textarea {
        flex: 1 1 auto;
        height: auto;
    }

    .btn {
        margin-left: 20px;
        flex: 0 0 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .message {
        display: flex;
        width: 100%;
    }

    .from-client {
        justify-content: flex-end;
    }

    .from-manager {
        justify-content: flex-start;
    }

    .box {
        max-width: 90%;
        display: flex;
        flex-direction: column;
        margin: 2px;
        background-color: var(--background);
        border-radius: 3px;
        min-width: 140px;
    }

    .text {
        padding: 10px 10px 0 10px;
    }

    .time {
        display: flex;
        justify-content: flex-end;
        font-size: 0.7em;
        padding: 3px;
        color: var(--secondary-button);
    }
</style>
