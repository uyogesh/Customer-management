import axios from 'axios'
import qs from 'querystring'
import { isNil, uniqBy } from 'ramda'
import { BASE_URL } from '../Utils/urls'
import {
    TYPE_FETCH_MESSAGE_LIST,
    TYPE_MESSAGE_LIST_SUCCESS,
    TYPE_MESSAGE_LIST_EMPTY,
    TYPE_FETCH_CHAT,
    TYPE_MESSAGE_LOADING,
    TYPE_FETCH_CHAT_SUCCESS,
    TYPE_FETCH_CHAT_FAILURE,
    TYPE_CLEAR_CHATS,
    TYPE_SELECT_CONTACT_FOR_CHAT,
    TYPE_FETCH_ADDITIONAL_CHAT,
    TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS,
    TYPE_CUSTOM_MESSAGE_ADD,
    TYPE_CUSTOM_MESSAGE_LOADING,
    TYPE_CHAT_LOADING,
    TYPE_FETCH_ADDITIONAL_MESSAGES,
    TYPE_ADD_TO_CURRENT_MESSAGE_LIST,
    TYPE_CONTACTS_LOADING
} from './actionTypes'

export const fetchMessageList = (contact = null, query='') => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token
        axios.get(`${BASE_URL}api/messages?query=${query}`, {
            headers: {
                Authorization: 'bearer ' + token,
            }
        }).then((response) => {
            if (isNil(contact)) {
                if (!(response.data.data.length === 0)) {
                    dispatch(selectCurrentlyChattingContact(response.data.data[0]))
                    dispatch({
                        type: TYPE_MESSAGE_LIST_SUCCESS,
                        payload: response.data
                    })

                    return response.data.data[0]
                }
                else {
                    dispatch(selectCurrentlyChattingContact(response.data))
                    dispatch({
                        type: TYPE_MESSAGE_LIST_EMPTY,
                        payload: response.data
                    })
                    return response.data.data
                }

            }
            else {
                let prevList = response.data
                prevList.data = [contact, ...prevList.data]
                prevList.data = uniqBy((value)=>value.phone_number, prevList.data)
                dispatch({
                    type: TYPE_MESSAGE_LIST_SUCCESS,
                    payload: prevList
                })
                return contact
            }
            return undefined
        }).then(latest => {
            const user = getState().auth
            const type = "phone_number"
            // const contactId_or_number = user.phone_no === latest.phone_number ? latest.sender_phone : latest.phone_number
            if (!(latest === undefined)) {
                const contactId_or_number = latest.receive_or_sent === "receive" ? latest.sender_phone : latest.phone_number
                dispatch(fetchChat(contactId_or_number))
            }
        }

        )
            .catch(err => {
                // console.log(err)
            })
    }
}

export const fetchMessageListPure = (contact = null) => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token
        axios.get(BASE_URL + 'api/messages', {
            headers: {
                Authorization: 'bearer ' + token,
            }
        }).then((response) => {
            if (isNil(contact)) {
                dispatch({
                    type: TYPE_MESSAGE_LIST_SUCCESS,
                    payload: response.data
                })
            } else {
                let prevList = response.data
                prevList.data = [contact, ...prevList.data]
                // const newList = [contact, ...prevList]
                dispatch({
                    type: TYPE_MESSAGE_LIST_SUCCESS,
                    payload: prevList
                })
            }

        }).catch(err => {
            // console.log(err)
        })
    }
}

export const addCurrentMessageList = (contact) => {
    return (dispatch, getState) => {

    }
}

export const fetchAdditionalMessage = () => {
    return (dispatch, getState) => {
        const previousList = getState().messages.messages
        axios.get(previousList.links.next, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            let nextList = { ...response.data, data: [...previousList.data, ...response.data.data] }
            dispatch({ type: TYPE_FETCH_ADDITIONAL_MESSAGES, payload: nextList })
        })
    }
}

export const fetchChat = (contactId_or_number, query='') => {
    return (dispatch, getState) => {
        const { token } = getState().auth.token
        axios.post(BASE_URL + '/api/messages/individual-messages',
            qs.stringify({
                contactId_or_number: contactId_or_number,
                type: 'phone_number',
                query
            }),
            {
                headers: {
                    Authorization: 'bearer ' + token,
                    contentType: 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                dispatch({ type: TYPE_FETCH_CHAT_SUCCESS, payload: response.data })
            }).catch(error => {
                dispatch({ type: TYPE_FETCH_CHAT_FAILURE })
            })
        // var es = new EventSource('http://31.220.64.240')
    }

}

export const clearChat = () => {
    return ({ type: TYPE_CLEAR_CHATS })
}

export const fetchAdditionalChat = () => {
    return (dispatch, getState) => {
        const previousList = getState().messages.current_chats
        const currentContact = getState().messages.current_chatting_contact
        let form = new FormData()
        form.append('type', 'phone_number')
        form.append('contactId_or_number', currentContact.receive_or_sent === "sent" ? currentContact.phone_number : currentContact.sender_phone)
        axios.post(previousList.links.next, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            let nextList = { ...response.data, data: [...previousList.data, ...response.data.data] }
            dispatch({ type: TYPE_FETCH_ADDITIONAL_CHAT, payload: nextList })
        }).catch(error => {
            // console.log(error)
        })
    }
}

export const selectCurrentlyChattingContact = (contact) => {
    return (dispatch, getState) => {
        dispatch({ type: TYPE_SELECT_CONTACT_FOR_CHAT, payload: contact })

    }
}

export const sendChatMessage = ({ message, file }) => {
    return (dispatch, getState) => {
        let msg = {}
        const user = getState().auth
        const current_contact = getState().messages.current_chatting_contact
        const { sender_info, phone_number, sender_phone, first_name } = current_contact
        let formData = new FormData()
        if (!sender_info) {
            formData.append('sent_receive_status', "1")
            formData.append('contact_id', current_contact.id || '')
            formData.append('phone_number', current_contact.phone_number || '')
            formData.append('message', message || '')
            formData.append('contact_or_number_type', current_contact.contact_id ? 'existing_number' : 'new_number')
            formData.append('file', file)
            msg = {
                sent_receive_status: "1",
                contact_id: current_contact.id || '',
                phone_number: current_contact.phone_number || '',
                message: message || '',
                contact_or_number_type: current_contact.contact_id ? 'existing_number' : 'new_number',
                file: file
            }
        } else {
            if (current_contact.phone_number === user.phone_no) {
                formData.append('sent_receive_status', "1")
                formData.append('contact_id', current_contact.contact_id || '')
                formData.append('phone_number', current_contact.sender_phone || '')
                formData.append('message', message || '')
                formData.append('contact_or_number_type', current_contact.contact_id ? 'existing_number' : 'new_number')
                formData.append('file', file)
                msg = {
                    sent_receive_status: "1",
                    contact_id: current_contact.contact_id || '',
                    phone_number: current_contact.sender_phone || '',
                    message: message || '',
                    contact_or_number_type: current_contact.contact_id ? 'existing_number' : 'new_number',
                    file: file
                }
            } else {
                formData.append('sent_receive_status', "1")
                formData.append('contact_id', current_contact.contact_id || '')
                formData.append('phone_number', current_contact.phone_number || '')
                formData.append('message', message || '')
                formData.append('contact_or_number_type', current_contact.contact_id ? 'existing_number' : 'new_number')
                formData.append('file', file)
                msg = {
                    sent_receive_status: "1",
                    contact_id: current_contact.contact_id || '',
                    phone_number: current_contact.phone_number || '',
                    message: message || '',
                    contact_or_number_type: current_contact.contact_id ? 'existing_number' : 'new_number',
                    file: file
                }
            }


        }
        const { token } = getState().auth.token
        // msg = {
        //     sent_receive_status: "1",
        //     contact_id: contact_id || '',
        //     phone_number: phone_number|| '',
        //     message: message || '',
        //     contact_or_number_type:contact_id?'existing_number':'new_number',
        //     file: null
        // }
        axios.post(
            BASE_URL + 'api/messages',
            formData
            ,
            {
                headers: {
                    Authorization: `bearer ${token}`
                }
            }
        ).then(response => {
            // console.log(response)
        }).catch(error => {
            // console.log(error)
        })
    }

}

export const sendChatMessageLocal = (message) => {

    return (dispatch, getState) => {

        // const msg = {
        //     "contact_id": contact_id,
        //     "phone_number": number,
        //     "contact_or_number_type": number_type,
        //     "message": message,
        //     "sent_receive_status": 1,
        //     "file": file
        // }
        const previousList = getState().messages.current_chats
        const currentContact = getState().messages.current_chatting_contact
        const newMsg = getState().messages.current_chats.data ? [message, ...getState().messages.current_chats.data] : [message]
        console.log("New Message: ", newMsg)
        let nextList = { ...previousList, data: newMsg }
        dispatch({ type: TYPE_FETCH_ADDITIONAL_CHAT, payload: nextList })

    }
}

export const loadingEnabled = () => {
    return ({ type: TYPE_MESSAGE_LOADING })
}

export const chatLoadingEnabled = () => {
    return ({ type: TYPE_CHAT_LOADING })
}


export const registerEventSource = (id, phone_number, callback) => {
    var es = new EventSource(`${BASE_URL.substring(0, BASE_URL.length - 1)}:3000/hub?topic=` + encodeURIComponent(
        `${BASE_URL}broadcasting/message/${id}/${phone_number}`
    ));
    // es.onmessage = (Event) => {
    //     var eventData = JSON.parse(Event.data);
    //     console.log(eventData)
    // }
    es.addEventListener('message', (messageEvent) => {
        var eventData = JSON.parse(messageEvent.data);
        console.log(eventData.message)
        callback(eventData)
    });
    console.log(es)
}


export const fetchCustomMessages = () => {
    return (dispatch, getState) => {
        axios.get(`${BASE_URL}api/custom-messages`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            dispatch({
                type: TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS,
                payload: response.data
            })
        }).catch(error => {
            console.log(error)
        })
    }
}

export const addCustomMessage = (message = " ", type, forward_type, forward_date_time, default_status) => {
    return (dispatch, getState) => {

        let form = new FormData()
        if (type === "audio") {
            let sound = new File([message], 'a.mp3', {
                type: 'audio/mpeg'
            })
            form.append('voice_message', '')
            form.append('binary_files', message)
            form.append('message_type', 'audio')
            form.append('forward_type', forward_type)
            form.append('forward_date_time', forward_date_time)
            form.append('is_default', default_status)
        } else {
            form.append('text_message', message)
            form.append('binary_files', '')
            form.append('message_type', 'text')
            form.append('forward_type', forward_type)
            form.append('forward_date_time', forward_date_time)
            form.append('is_default', default_status)
        }

        axios.post(`${BASE_URL}api/custom-messages/store`, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            console.log(response)
            dispatch(fetchCustomMessages())
        }).catch(error => {
            console.log(error)
        })
    }
}

export const deleteCustomMessage = (id) => {
    return (dispatch, getState) => {
        axios.delete(`${BASE_URL}api/custom-messages/delete/${id}`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`,
            }
        }).then(response => {
            console.log(response)
            dispatch(fetchCustomMessages())
        })
    }
}

export const addVoiceMail = (message = " ", type, forward_type, forward_date_time, default_status) => {
    return (dispatch, getState) => {

        let form = new FormData()

        form.append('receiver_phone', '9803473830')
        form.append('message', '')
        form.append('file', '')
        form.append('binary_files', message)
        // form.append('is_default', default_status)

        axios.post(`${BASE_URL}api/voicemails`, form, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`,
                // 'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
    }
}

export const changeReadStatus = (id) => {
    return (dispatch, getState) => {
        axios.get(`${BASE_URL}api/messages/change-status/${id}`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            dispatch(fetchMessageListPure())

        })
    }
}

export const deleteContactMessages = (contact_id_or_phone_no, type) => {
    return (dispatch, getState) => {
        axios.post(`${BASE_URL}api/messages/delete-all`,
            qs.stringify({
                contact_id_or_phone_no: contact_id_or_phone_no,
                type: type,
            }),
            {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            dispatch({ type: TYPE_CONTACTS_LOADING })
            // dispatch({ type: TYPE_FETCH_MESSAGE_LIST })
            dispatch(fetchMessageListPure())
            dispatch(fetchChat())

        })
    }
}
