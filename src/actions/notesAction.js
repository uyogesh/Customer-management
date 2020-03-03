import axios from 'axios'
import {
    TYPE_FETCH_CONTACT_NOTES_SUCCESS,
    TYPE_ADD_CONTACT_NOTES,
    TYPE_CONTACTS_LOADING,
    TYPE_CONTACTS_LOADING_FINISHED
} from './actionTypes'
import { BASE_URL } from '../Utils/urls';
import qs from 'querystring'
import { fetchIndividualContact } from './contactsActions';


export const fetchNotes = (contact_id) => {

    return (dispatch, getState) => {
        const { token } = getState().auth.token

        axios.post(BASE_URL + '/api/contact-notes/list', qs.stringify({
            contact_id
        }), {
                headers: {
                    Authorization: 'bearer ' + token,
                    contentType: 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                dispatch({ type: TYPE_FETCH_CONTACT_NOTES_SUCCESS, payload: response.data })
            }).catch(error => {
                console.log(error)
            })
    }
}

export const addNote = (contact_id, note) => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token

        axios.post(BASE_URL + 'api/contact-notes', qs.stringify({
            contact_id: contact_id,
            note: note
        }), {
                headers: {
                    Authorization: 'bearer ' + token,
                    contentType: 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: TYPE_CONTACTS_LOADING_FINISHED
                    })
                    dispatch(fetchNotes(contact_id))
                }
            }).catch(error => {
                console.log(error)
            })
    }
}

export const removeNoteById = (id, contact_id) => {
    return (dispatch, getState) => {
        dispatch(setContactLoading())
        const { token } = getState().auth.token

        axios.delete(BASE_URL+'api/contact-notes/' + id, {
            headers: {
                Authorization: 'bearer '+token
            }
        }).then(response => {
            if(response.data.message === 'ok') {
                dispatch(fetchNotes(contact_id))
            }
        }).then(()=>{
            dispatch(fetchIndividualContact(contact_id))
        })
    }
}

export const setContactLoading = () => 
    ({ type: TYPE_CONTACTS_LOADING })
