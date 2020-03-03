import axios from 'axios'
import qs from 'querystring'
import {
    TYPE_FETCH_TAGS,
    TYPE_FETCH_TAGS_SUCCESS,
    TYPE_TAGS_ADDED,
    TYPE_TAGS_LOADING
} from './actionTypes'
import { requestContacts, fetchIndividualContact } from './contactsActions'
import { BASE_URL } from '../Utils/urls'

export const fetchTags = () => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token

        axios.get(BASE_URL + 'api/tags',
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }
        ).then(response => {
            dispatch({
                type: TYPE_FETCH_TAGS_SUCCESS,
                payload: response.data
            })
        }).catch(error => {
            console.log(error)
        })
    }
}

export const tagsLoading = () => {
    return {
        type: TYPE_TAGS_LOADING
    }
}

export const tagsLoaded = () => {
    return {
        type: 'TYPE_TAGS_LOADED'
    }
}

export const addTags = (tag) => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token
        console.log("ADD TAG clicked")
        axios.post(BASE_URL + 'api/tags',
            qs.stringify({
                tag
            }),
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }
        ).then(response => {
            dispatch(fetchTags())
        })
    }
}

export const assignTag = (contact_id, tag) => {
    return (dispatch, getState) => {
        // axios.post(BASE_URL+'')
    }
}

export const ejectTag = (contact_id, tag) => {
    return (dispatch, getState) => {
        const form = new FormData()
        form.append('contact_id', contact_id)
        form.append('tag_id', tag)
        axios.post(`${BASE_URL}api/contact/eject-tag`, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            console.log(response)
            dispatch(fetchIndividualContact(contact_id))
        })
    }
}

export const removeTag = (id) => {
    return (dispatch, getState) => {
        axios.delete(`${BASE_URL}api/tags/${id}`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            console.log(response)
            dispatch(fetchTags())
        }).catch(error => {
            console.log(error)
        })
    }
}