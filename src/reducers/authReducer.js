import {
    TYPE_LOGIN_STARTED,
    TYPE_LOGIN_SUCCESS,
    TYPE_LOGIN_FAILURE,
    TYPE_ERROR_RESET,
    TYPE_AUTH_TOKEN_REQUEST,
    TYPE_AUTH_TOKEN_SUCCESS,
    TYPE_AUTH_TOKEN_FAILURE,
    TYPE_LOGOUT,
    TYPE_CLEAR_ERROR,
} from '../actions/actionTypes'

const initState = {
    "loading": false,
    "error": false,
    "id": null,
    "first_name": "",
    "last_name": "",
    "phone_no": null,
    "address": null,
    "email": "",
    "password": "",
    "avatar": null,
    "remember_token": null,
    "created_at": "",
    "updated_at": "",
    "token": null,
    "expires_in": null
}

export default (state = initState, action) => {
    switch (action.type) {
        case TYPE_AUTH_TOKEN_SUCCESS:
            return Object.assign({}, state, {token: action.payload})

        case TYPE_AUTH_TOKEN_FAILURE:
            return Object.assign({}, state, { token: null, expires_in: null })

        case TYPE_LOGIN_STARTED:
            return Object.assign({}, state, { loading: true })

        case TYPE_LOGIN_SUCCESS:
            return Object.assign({}, state, action.payload, { loading: false })

        case TYPE_LOGIN_FAILURE:
            return Object.assign({}, state, { loading: false, error: action.payload })

        case TYPE_CLEAR_ERROR:
            return Object.assign({}, state, { error: null })
        
        case TYPE_LOGOUT:
            return {
                ...state,
                token: null,
            }
        default:
            return state
    }
}