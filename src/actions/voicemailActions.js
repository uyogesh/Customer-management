import axios from 'axios'
import {
    TYPE_VOICE_MAIL_LOADING,
    TYPE_FETCH_VOICE_MAIL_SUCESS,
    TYPE_VOICE_MAIL_ADD,
    VOICEMAIL_RESPONSE_EMPTY,
    TYPE_VOICE_MAIL_LOADED,
    TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS,
    TYPE_SELECT_CURRENT_VOICEMAIL,
    TYPE_INDIVIDUAL_VOICEMAIL_LOADING,
} from './actionTypes'
import { isEmpty } from 'ramda'
import { BASE_URL } from '../Utils/urls'


export const fetchVoiceMails = () => {
    return (dispatch, getState) => {
        dispatch({ type: TYPE_VOICE_MAIL_LOADING })
        axios.get(`${BASE_URL}api/voicemails`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            if (isEmpty(response.data.data)) {
                dispatch({ type: VOICEMAIL_RESPONSE_EMPTY })
                dispatch({ type: TYPE_VOICE_MAIL_LOADED })
                return 0
            } else {
                const latest = response.data[0]
                dispatch({ type: TYPE_SELECT_CURRENT_VOICEMAIL, payload: response.data.data[0] })
                dispatch(fetchIndividualVoiceMail(response.data.data[0]))
                return response.data
            }

        }).then(responseData => {
            if (!(responseData === 0)) {
                dispatch({ type: TYPE_FETCH_VOICE_MAIL_SUCESS, payload: responseData })
                dispatch({ type: TYPE_VOICE_MAIL_LOADED })
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

export const fetchVoiceMailListPure = () => {
    return (dispatch, getState) => {
        axios.get(`${BASE_URL}api/voicemails`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            if (!(response === 0)) {
                dispatch({ type: TYPE_FETCH_VOICE_MAIL_SUCESS, payload: response.data })
                dispatch({ type: TYPE_VOICE_MAIL_LOADED })
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

export const addVoiceMail = (sound, receiver) => {
    return (dispatch, getState) => {
        // dispatch({ type: TYPE_VOICE_MAIL_LOADING })
        let form = new FormData()
        // form.append('contact_id','')
        form.append('receiver_phone', receiver)
        // form.append('message', '')
        // form.append('file', '')
        form.append('binary_files', sound)
        console.log("Add VoiceMail: ", sound, receiver)
        axios.post(`${BASE_URL}api/voicemails`, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            // dispatch({ type: TYPE_VOICE_MAIL_LOADED })
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
    }
}

export const fetchIndividualVoiceMail = (voice_mail_thread) => {
    return (dispatch, getState) => {
        const phone = voice_mail_thread.receive_or_sent === 'sent' ? voice_mail_thread.receiver_phone : voice_mail_thread.sender_phone
        let form = new FormData()
        form.append('contact_id_or_phone', phone)
        form.append('type', 'new_number')
        axios.post(`${BASE_URL}api/voicemails/individual-info`, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            dispatch({ type: TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS, payload: response.data })
        }).catch(error => {
            console.log(error)
        })
    }
}

export const addLocalVoiceMail = (message) => {
    return (dispatch, getState) => {
        const current_message = getState().voiceMails.voicemails.data
        const new_message = [message, ...current_message]
        dispatch({ type: TYPE_VOICE_MAIL_ADD, payload: new_message })
    }
}

export const voiceMailLoadingEnabled =() => {
    return {type:TYPE_INDIVIDUAL_VOICEMAIL_LOADING}
}


export const registerVoiceMailES = (id, phone_no, callback) => {
    var es = new EventSource(`${BASE_URL.substring(0,BASE_URL.length-1)}:3000/hub?topic=` + encodeURIComponent(
        `${BASE_URL}broadcasting/voicemail/${id}/${phone_no}`
    ));
    es.addEventListener('message', (messageEvent) => {
        var eventData = JSON.parse(messageEvent.data);
        callback(eventData)
    });
}
