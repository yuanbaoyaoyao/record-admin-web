import { createStore } from "vuex";

import app from "./modules/app";
import permission from "./modules/permission";
import tag from "./modules/tag";
import user from "./modules/user"
import statisticsDetail from "./modules/statisticsDetail"
import order from "./modules/order";
import getters from "./getters"

const store = createStore({
    modules: {
        app,
        permission,
        tag,
        user,
        statisticsDetail,
        order
    },
    getters
})

export default store