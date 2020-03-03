import {
    TYPE_FETCH_MESSAGE_LIST,
    TYPE_MESSAGE_LIST_SUCCESS,
    TYPE_MESSAGE_LIST_EMPTY,
    TYPE_FETCH_CHAT,
    TYPE_FETCH_CHAT_FAILURE,
    TYPE_FETCH_CHAT_SUCCESS,
    TYPE_MESSAGE_LOADING,
    TYPE_FETCH_ADDITIONAL_CHAT,
    TYPE_SELECT_CONTACT_FOR_CHAT,
    TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS,
    TYPE_CHAT_LOADING,
    TYPE_CLEAR_CHATS,
    TYPE_FETCH_ADDITIONAL_MESSAGES,
    TYPE_ADD_TO_CURRENT_MESSAGE_LIST,
} from '../actions/actionTypes'

const initState = {
    loading: true,
    messages: [],
    chats_loading: true,
    current_chats: [],
    current_chatting_contact: [],
    custom_message_loading: true,
    custom_messages: []
}

export default (state = initState, action) => {
    switch (action.type) {
        case TYPE_FETCH_MESSAGE_LIST:
            return {
                ...state,
                loading: true
            }
        case TYPE_MESSAGE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload
            }
        case TYPE_MESSAGE_LIST_EMPTY:
            return {
                ...state,
                chats_loading: false,
                loading: false,
                messages: action.payload
            }
        case TYPE_FETCH_CHAT:
            return {
                ...state,
                chats_loading: true
            }
        case TYPE_FETCH_CHAT_SUCCESS:
            return {
                ...state,
                loading: false,
                chats_loading: false,
                current_chats: action.payload
            }
        case TYPE_FETCH_CHAT_FAILURE:
            return {
                ...state,
                loading: false,
                chats_loading: false,
                current_chats: []
            }
        case TYPE_CLEAR_CHATS:
            return {
                ...state,
                current_chats: []
            }
        case TYPE_FETCH_ADDITIONAL_CHAT:
            // return {
            //     ...state,
            //     loading: false,
            //     current_chats: {
            //         ...state.current_chats,
            //         data: action.payload
            //     }
            // }
            return {
                ...state,
                current_chats: action.payload
                
            }
        case TYPE_FETCH_ADDITIONAL_MESSAGES:
            return {
                ...state,
                messages: action.payload
            }
        case TYPE_MESSAGE_LOADING:
            return {
                ...state,
                loading: true
            }
        case TYPE_CHAT_LOADING:
            return {
                ...state,
                chats_loading: true
            }
        case TYPE_SELECT_CONTACT_FOR_CHAT:
            return {
                ...state,
                current_chatting_contact: action.payload
            }
        case TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS:
            return {
                ...state,
                custom_message_loading: false,
                custom_messages: action.payload
            }
        case TYPE_ADD_TO_CURRENT_MESSAGE_LIST:
            return {
                ...state,
                messages:{
                    ...state.messages,
                    data: action.payload
                }
            }
        default:
            return state
    }
}