<template>
    <div id="app">
        <Header />
        <div class="flex-row main-row">
            <Markets/>
            <div class="chart-col">
                <Chart/>
                <Depth/>
            </div>
            <Orderbook/>
        </div>
        <div class="flex-row main-row">
            <Order/>
            <Orders/>
            <LastTrades/>
        </div>
        <Login/>
        <Cabinet/>
        <Notifications/>
        <Support/>
    </div>
</template>

<script>
    import Header from '@/components/Header'
    import Markets from "@/components/Markets";
    import Chart from "@/components/Chart";
    import Orderbook from "@/components/Orderbook";
    import Order from "@/components/Order";
    import Orders from "@/components/Orders";
    import LastTrades from "@/components/LastTrades";
    import Login from "@/components/Login";
    import Cabinet from "@/components/Cabinet";
    import {APP_INIT} from "@/store/actions.type";
    import Notifications from "@/components/Notifications";
    import Depth from "@/components/Depth";
    import Support from "./components/Support";

    export default {
        name: 'App',
        mounted() {
            this.$store.dispatch(APP_INIT)
        },
        components: {
            Support,
            Depth,
            Notifications,
            Cabinet,
            Login,
            LastTrades,
            Orders,
            Order,
            Orderbook,
            Chart,
            Markets,
            Header
        }
    }
</script>

<style>
    :root {
        --background: #131722;
        --background-dark: #000;
        --font: #eeeeee;
        --brand: #10d876;
        --green: #10d876;
        --red: #ff0000;
        --green-bright: #00ff00;
        --red-bright: #ff0000;
        --primary-button: #10d876;
        --secondary-button: #6c757d;
        --even: #1c1c1c;
        --odd: #202020;
        --border: #2d2d2d;
    }

    *, *:before, *:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    *:focus {
        outline: none !important;
    }

    ::-webkit-scrollbar {
        width: 1px;
        height: 0px;
    }

    ::-webkit-scrollbar-track {
        background: var(--background-dark);
    }

    ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover {
        background: var(--brand);
    }

    ::-webkit-scrollbar-corner {
        background: rgba(0,0,0,0);
    }

    html, body {
        min-height: 100%;
        width: 100%;
        color: var(--font);
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 13px;
        font-weight: 300;
        background-color: var(--background);
        overflow-x: hidden;
        display: flex;
        justify-content: center;
    }

    h5 {
        font-size: 1.2em;
        font-weight: 300;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    input, select, textarea {
        display: block;
        width: 100%;
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: var(--font);
        background-color: var(--background);
        background-clip: padding-box;
        border: 1px solid var(--background-dark);
        border-radius: 0.25rem;
        transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;
    }

    input:focus {
        background-color: transparent;
        border-color: var(--background);
    }

    .checkbox-row {
        display: flex;
        align-items: center;
    }

    .checkbox-row label {
        flex: 1 1 auto;
        margin: 0 0 0 10px !important;
        text-align: left;
    }

    input[type=checkbox] {
        width: 14px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0
    }

    td, th {
        padding: 0.4em;
    }

    th {
        text-align: left;
    }

    #app {
        display: flex;
        flex-direction: column;
        width: calc(100% - 50px);
        height: 100%;
        margin: 0 15px;
    }

    @media (max-width: 767px) {
        .no-mobile {
            display: none !important;
        }
    }

    .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 -20px;
    }

    .flex-col {
        display: flex;
        flex-direction: column;
        padding: 0 20px
    }

    .space-between {
        justify-content: space-between;
    }

    .green {
        color: var(--green);
    }

    .red {
        color: var(--red);
    }

    .grey {
        color: var(--secondary-button)
    }

    .pointer {
        cursor: pointer;
    }

    .pad {
        margin: 0 5px;
    }

    .hide {
        display: none !important;
    }

    .scroll {
        overflow: scroll;
    }

    .btn {
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding: 0.15em 0.6em;
        border: 1px solid transparent;
        font-size: 0.9em;
        line-height: 1.5;
        border-radius: 0.25em;
        transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    }

    .btn-primary {
        color: var(--font);
        background-color: transparent;
        border-color: var(--primary-button);
    }

    .btn-primary:hover {
        background-color: var(--primary-button);
    }

    .btn-secondary {
        background-color: transparent;
        color: var(--font);
        border-color: var(--secondary-button);
    }

    .btn-secondary:hover {
        background-color: var(--secondary-button);
    }

    .btn-transparent {
        background-color: transparent;
        border-color: var(--primary-button);
        color: var(--font)
    }

    .btn-transparent:hover {
        background-color: var(--primary-button);
        color: var(--font)
    }

    .btn-disabled {
        background-color: transparent;
        color: var(--secondary-button);
        border-color: var(--secondary-button);
    }

    h5 .material-icons {
        font-size: 1.5em;
        margin: 0
    }

    .main-row {
        align-items: stretch;
    }

    .app-item {
        background-color: var(--background-dark);
        padding: 10px 15px;
        margin: 5px
    }

    .markets {
        flex: 2 0 auto
    }

    .chart-col {
        flex: 5 1 auto;
        /*min-width: 600px;*/
        min-height: 600px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .orderbook {
        flex: 2 0 auto;
    }

    .order {
        flex: 1 0 20%;
        min-width: 350px;
    }

    .orders {
        flex: 3 1 auto;
    }

    .lasttrades {
        flex: 1 0 20%;
    }

    .tabs {
        overflow-x: scroll;
        display: flex;
        justify-content: flex-start;
        margin: 5px 0
    }

    .tabs span {
        font-size: 13px;
        margin-right: 1rem;
        padding: 5px;
        color: var(--secondary-button);
        cursor: pointer;
        transition: color 0.3s ease-in-out, border-bottom-color 0.3s ease-in-out;
        border-bottom: 1px solid transparent;
    }

    .tabs span:hover, .tabs span.active {
        border-bottom: 1px solid var(--brand);
        color: var(--font)
    }

    .tabs span:last-child {
        margin-right: 0;
    }

    .two-cols {
        display: flex;
    }

    .onecol {
        display: flex;
        flex: 1 1;
        flex-direction: column;
        padding-right: 30px;
    }

    .onecol:last-child {
        padding-right: 0;
    }

    .modal-wrapper {
        position: fixed;
        z-index: 1080;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,0.8);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .modal {
        width: 300px;
        display: flex;
        flex-direction: column;
        background: var(--background-dark);
    }

    .modal-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--border);
        border-bottom: 1px solid var(--brand);
        border-radius: 5px 5px 0 0;
        padding: 15px;
    }

    .modal-header h5 {
        margin-bottom: 0;
        font-size: 1.4em;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        padding: 0;
        border-top: 15px solid var(--background);
        border: 1px solid var(--border);
        border-bottom: 15px solid var(--background);
        flex: 1 1 auto;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        padding: 15px;
        border: 1px solid var(--border);
        border-top: none;
        border-radius: 0 0 5px 5px;
    }

    .modal-footer .btn {
        margin-left: 20px;
        padding: 0.375rem 0.75rem;
        font-weight: 600;
    }

    .modal label {
        margin: 1rem 0 0.1rem;
        display: block;
        width: 100%;
        font-size: 1.2em;
    }

    .modal h4 {
        font-size: 1.4em;
        font-weight: 400;
        margin: 15px 0
    }

    .modal th {
        background-color: rgba(0,0,0,0.3);
    }

    .modal .close {
        color: var(--secondary-button);
        font-size: 1.3em;
        cursor: pointer;
    }

    .form-row {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 15px;
    }

    @media (max-width: 767px) {
        .modal-body {
            flex-direction: column !important;
        }

        .two-cols {
            flex-direction: column !important;
        }

        .onecol {
            padding-right: 0 !important;
        }

        .extra-text {
            display: none !important;
        }

        .content {
            padding: 10px !important;
        }

        h4 {
            padding: 0 15px !important;
        }

        .no-mobile {
            display: none !important;
        }
    }

    .vue-slider-rail {
        background-color: var(--background);
    }

    .vue-slider-dot {
        background-color: var(--font);
        border-radius: 50%;
        cursor: grab;
        width: 10px !important;
        height: 10px !important;
    }

    .material-icons.large {
        font-size: 4em;
        width: 100%;
        margin: 0 0 10px;
    }

    .text {
        font-size: 1em;
        line-height: 1.5em;
    }

    .text-muted {
        margin-top: 5px;
        font-size: 0.9em;
        font-style: italic;
        display: block
    }

    .support-email {
        text-decoration: underline;
        color: var(--font)
    }

    .subaction {
        border-bottom: 1px dotted;
        cursor: pointer;
    }

    .form-actions {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
    }

    .form-actions .btn {
        padding: 0.375rem 0.75rem;
        font-weight: 400;
        font-size: 1em;
    }
</style>
