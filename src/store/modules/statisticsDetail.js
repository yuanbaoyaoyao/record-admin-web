import storage from "../../utils/storage"

const statistics = {
    state: {
        userDetailName: '',
        userRadio:1,
        userDateState: 1,
        userSpecifiedTime1: '',
        userSpecifiedTime2: '',
        // userDetailName: '',
        // orderRadio:1,
        // orderDateState: 1,
        // orderSpecifiedTime1: '',
        // orderSpecifiedTime2: '',
        // userDetailName: '',
        consumableRadio: 1,
        consumableTitle: '',
        consumableSkusTitle: '',
        consumableDateState: 1,
        consumableSpecifiedTime1: '',
        consumableSpecifiedTime2: '',
    },
    mutations: {
        SET_USER_DETAIL_NAME: (state, userDetailName) => {
            state.userDetailName = userDetailName
            storage.set("USER_DETAIL_NAME", userDetailName)
        },
        SET_USER_DATE_STATE: (state, userDateState) => {
            state.userDateState = userDateState
            storage.set("USER_DATE_STATE", userDateState)
        },
        SET_USER_RADIO: (state, userRadio) => {
            state.userRadio = userRadio
            storage.set("USER_RADIO", userRadio)
        },
        SET_USER_SPECIFIED_TIME1: (state, userSpecifiedTime2) => {
            state.userSpecifiedTime2 = userSpecifiedTime2
            storage.set("USER_SPECIFIED_TIME1", userSpecifiedTime2)
        },
        SET_USER_SPECIFIED_TIME2: (state, userSpecifiedTime2) => {
            state.userSpecifiedTime2 = userSpecifiedTime2
            storage.set("USER_SPECIFIED_TIME2", userSpecifiedTime2)
        },
        
        // SET_USER_DATE_STATE: (state, userDateState) => {
        //     state.userDateState = userDateState
        //     storage.set("USER_DATE_STATE", userDateState)
        // },
        // SET_ORDER_DATESTATE: (state, orderDateState) => {
        //     state.orderDateState = orderDateState
        //     storage.set("ORDER_DATESTATE", orderDateState)
        // },
        // SET_ORDER_RADIO: (state, orderRadio) => {
        //     state.orderRadio = orderRadio
        //     storage.set("ORDER_RADIO", orderRadio)
        // },
        // SET_ORDER_SPECIFIED_TIME1: (state, orderSpecifiedTime1) => {
        //     state.orderSpecifiedTime1 = orderSpecifiedTime1
        //     storage.set("ORDER_SPECIFIED_TIME1", orderSpecifiedTime1)
        // },
        // SET_ORDER_SPECIFIED_TIME2: (state, orderSpecifiedTime2) => {
        //     state.orderSpecifiedTime2 = orderSpecifiedTime2
        //     storage.set("ORDER_SPECIFIED_TIME2", orderSpecifiedTime2)
        // },

        // SET_CONSUMABLE_DETAIL_NAME: (state, userDetailName) => {
        //     state.userDetailName = userDetailName
        //     storage.set("USER_DETAIL_NAME", userDetailName)
        // },

        SET_CONSUMABLE_DATE_STATE: (state, consumableDateState) => {
            state.consumableDateState = consumableDateState
            storage.set("CONSUMABLE_DATE_STATE", consumableDateState)
        },
        SET_CONSUMABLE_TITLE: (state, consumableTitle) => {
            state.consumableTitle = consumableTitle
            storage.set("CONSUMABLE_TITLE", consumableTitle)
        },
        SET_CONSUMABLE_SKUS_TITLE: (state, consumableSkusTitle) => {
            state.consumableSkusTitle = consumableSkusTitle
            storage.set("CONSUMABLE_SKUS_TITLE", consumableSkusTitle)
        },
        SET_CONSUMABLE_RADIO: (state, consumableRadio) => {
            state.consumableRadio = consumableRadio
            storage.set("CONSUMABLE_RADIO", consumableRadio)
        },
        SET_CONSUMABLE_SPECIFIED_TIME1: (state, consumableSpecifiedTime1) => {
            state.consumableSpecifiedTime1 = consumableSpecifiedTime1
            storage.set("CONSUMABLE_SPECIFIED_TIME1", consumableSpecifiedTime1)
        },
        SET_CONSUMABLE_SPECIFIED_TIME2: (state, consumableSpecifiedTime2) => {
            state.consumableSpecifiedTime2 = consumableSpecifiedTime2
            storage.set("CONSUMABLE_SPECIFIED_TIME2", consumableSpecifiedTime2)
        },
    }
}

export default statistics;