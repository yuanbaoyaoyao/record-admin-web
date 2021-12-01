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

        handleAddTags(state, data) {
            state.editableTabs.push(data)
        },
        handleDeleteTags(state, data) {
            state.editableTabs.splice(data.i, 1)
            
        },
        handleClearTags(state) {
            state.editableTabs = []
        },
        handleDeleteOtherTags(state, data) {
            state.editableTabs = data
        }
    }
})