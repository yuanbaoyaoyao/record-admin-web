import {
    createStore
} from "vuex";
export default createStore({
    state: {
        collapse: false,
    },
    mutations: {
        handleCollapse(state, data) {
            state.collapse = data;
        }
    }
})