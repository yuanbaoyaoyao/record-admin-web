const tag = {
    state: {
        collapse: false,
        editableTabs: [],
        token: null
    },
    mutations: {
        HANDLE_COLLAPSE(state, data) {
            state.collapse = data;
        },

        HANDLE_ADD_TAGS(state, data) {
            state.editableTabs.push(data)
        },
        HANDLE_DELETE_TAGS(state, data) {
            state.editableTabs.splice(data.i, 1)

        },
        HANDLE_CLEAR_TAGS(state) {
            state.editableTabs = []
        },
        HANDLE_DELETE_OTHER_TAGS(state, data) {
            state.editableTabs = data
        }
    }
}

export default tag