import {
    createStore
} from "vuex";
export default createStore({
    state: {
        collapse: false,
        editableTabs: [],
    },
    mutations: {
        handleCollapse(state, data) {
            state.collapse = data;
        },
        addTags(state, data) {
            state.editableTabs.push(data)
        },
        deleteTags(state, data) {
            state.editableTabs.splice(data)
        },
        clearTags(state) {
            state.editableTabs = []
        },
        deleteOtherTags(state, data) {
            state.editableTabs = data
        }
    }
})