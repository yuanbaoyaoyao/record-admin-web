import storage from "../../utils/storage"

const order = {
    state: {
        orderSn: '',
    },
    mutations: {
        SET_ORDER_SN: (state, orderSn) => {
            state.orderSn = orderSn
            storage.set("ORDER_SN", orderSn)
        },
    }
}

export default order;