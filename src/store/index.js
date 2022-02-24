import { createStore } from "vuex";

import app from "./modules/app";
import permission from "./modules/permission";
import tag from "./modules/tag";
import user from "./modules/user"
import getters from "./getters"

const store = createStore({
    modules: {
        app,
        permission,
        tag,
        user
    },
    getters
})

export default store