import {
    TYPE_VOICE_MAIL_LOADING,
    TYPE_FETCH_VOICE_MAIL_SUCESS,
    TYPE_VOICE_MAIL_ADD,
    TYPE_VOICE_MAIL_LOADED,
    TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS,
    TYPE_INDIVIDUAL_VOICEMAIL_LOADING,
    TYPE_SELECT_CURRENT_VOICEMAIL,
    VOICEMAIL_RESPONSE_EMPTY,
} from '../actions/actionTypes'

const initState = {
    loading: true,
    voicemails: [],
    voicemail_loading: true,
    current_voicemail_thread:[],
    current_voicemail:[],
    voicemail_empty: false,
}

export default (state = initState, action) => {
    switch (action.type) {
        case TYPE_VOICE_MAIL_LOADING:
            return {
                ...state,
                loading: true,
                
            }
        case TYPE_INDIVIDUAL_VOICEMAIL_LOADING:
            return {
                ...state,
                voicemail_loading: true
            }
        case TYPE_FETCH_VOICE_MAIL_SUCESS:
            return {
                ...state,
                loading: false,
                voicemails: action.payload
            }
        case TYPE_VOICE_MAIL_LOADED:
            return {
                ...state,
                loading: false
            }
        case TYPE_VOICE_MAIL_ADD:
            return {
                ...state,
                current_voicemail: {
                    ...state.current_voicemail,
                    data: action.payload
                },
                voicemail_loading: false
            }
        case TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS:
            return {
                ...state,
                current_voicemail: action.payload,
                voicemail_loading: false
            }
        case TYPE_SELECT_CURRENT_VOICEMAIL:
            return {
                ...state,
                current_voicemail_thread: action.payload
            }
        case VOICEMAIL_RESPONSE_EMPTY:
            return {
                ...state,
                voicemail_empty: true
            }
        default:
            return state
    }
}