<template>
    <div class="toasts-container">
        <template>
            <div class="toast" v-for="notification in notifications"
                 :key="notification.id"
                 :class="notification.type"
             >{{ notification.text }}</div>
        </template>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Notifications",
        computed: {
            ...mapGetters(['notifications'])
        }
    }
</script>

<style scoped>
    .toasts-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 7777;
        width: 200px;
    }

    @media (max-width: 576px) {
        .toasts-container {
            left: 50%;
            margin-left: -100px;
        }
    }

    .toast.error {
        background-color: var(--red);
        color: var(--font);
        border: 1px solid var(--background);
        padding: 10px 30px
    }

    .toast.success {
        background-color: var(--green);
        color: var(--font);
        border: 1px solid var(--background);
        padding: 10px 30px
    }
</style>