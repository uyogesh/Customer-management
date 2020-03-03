import {
    TYPE_CONTACTS_FETCH_REQUEST,
    TYPE_CONTACTS_LOADING,
    TYPE_CONTACTS_REQUEST_FAILURE,
    TYPE_CONTACTS_REQUEST_SUCCESS,
    TYPE_CONTACTS_LOADING_FINISHED,
    TYPE_CONTACT_SELECT,
    TYPE_CONTACT_FETCH_REQUEST,
    TYPE_CONTACT_FETCH_SUCCESS,
    TYPE_CONTACT_FETCH_FAILURE,
    TYPE_FETCH_CONTACT_NOTES_SUCCESS,
    TYPE_ADD_CONTACT_NOTES,
    TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS,
    TYPE_CLEAR_INDIVIDUAL_CONTACT,
    FETCH_ADDITIONAL_CONTACT_SUCCESS
} from '../actions/actionTypes'


const initState = {
    loading: "pending",
    list: [],
    notes: [],
    contact: {
        full_name: 'Inca',
        phone_no: '',
        notes: [''],
        id: 0,
        photo: ''
    },
    contactLoading: true

}

export default (state = initState, action) => {
    switch (action.type) {
        case TYPE_CONTACTS_LOADING:
            return {
                ...state,
                loading: 'pending'
            }
        case TYPE_CONTACTS_REQUEST_SUCCESS:
            return {
                ...state,
                list: action.payload
            }
        case TYPE_CONTACTS_LOADING_FINISHED:
            return {
                ...state,
                loading: 'done'
            }
        case TYPE_FETCH_CONTACT_NOTES_SUCCESS:
            return {
                ...state,
                notes: action.payload.data,
                loading: 'done'
            }
        case TYPE_ADD_CONTACT_NOTES:
            return {
                ...state,
                loading: 'done'
            }
        case TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS:
            return {
                ...state,
                contact: action.payload,
                contactLoading: false
            }
        case TYPE_CLEAR_INDIVIDUAL_CONTACT:
            return {
                ...state,
                contact: {
                    full_name: 'Inca',
                    phone_no: '',
                    notes: [''],
                    id: 0,
                    photo: ''
                },
                contactLoading: true
            }
        case FETCH_ADDITIONAL_CONTACT_SUCCESS:
            return {
                ...state,
                list: action.payload
            }
        default:
            return state
    }
}