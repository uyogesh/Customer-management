import {
    TYPE_TAGS_LOADING,
    TYPE_ADD_TAGS_SUCCESS,
    TYPE_FETCH_TAGS_SUCCESS,
} from '../actions/actionTypes'


const initState = {
    tags: [],
    loading: true
}

export default (state = initState, action) => {

    switch (action.type) {
        case TYPE_FETCH_TAGS_SUCCESS:
            return {
                ...state,
                tags: action.payload,
                loading: false,
            }
        case TYPE_ADD_TAGS_SUCCESS:
            return {
                ...state,
                tags: action.payload,
                loading: false
            }
        case TYPE_TAGS_LOADING:
            return {
                ...state,
                loading: true
            }
        case 'TYPE_TAGS_LOADED':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }


}