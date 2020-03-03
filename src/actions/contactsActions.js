import axios from 'axios'
import {
    TYPE_CONTACTS_FETCH_REQUEST,
    TYPE_CONTACTS_REQUEST_SUCCESS,
    TYPE_CONTACTS_LOADING_FINISHED,
    TYPE_CONTACTS_LOADING,
    TYPE_FETCH_CONTACT_NOTES_SUCCESS,
    TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS,
    TYPE_CLEAR_INDIVIDUAL_CONTACT,
    FETCH_ADDITIONAL_CONTACT_SUCCESS

} from './actionTypes'
import qs from 'querystring'
import {BASE_URL} from '../Utils/urls'


export const requestContacts = (params='') => {
    return (dispatch, state) => {
        dispatch({type:TYPE_CONTACTS_LOADING})
        const {token} = state().auth.token
        axios.get(BASE_URL+'api/contacts?query='+params,{
            headers: {
                Authorization: 'bearer '+token
            }
        }).then(response => {
            
            let alphabatisedList = {
                a:[],
                b:[],
                c:[],
                d:[],
                e:[],
                f:[],
                g:[],
                h:[],
                i:[],
                j:[],
                k:[],
                l:[],
                m:[],
                n:[],
                o:[],
                p:[],
                q:[],
                r:[],
                s:[],
                t:[],
                u:[],
                v:[],
                w:[],
                x:[],
                y:[],
                z:[],
            }
            // response.data.forEach(element => {
            //     alphabatisedList[element.name.split('')[0].toLowerCase()] = [...alphabatisedList[element.name.split('')[0].toLowerCase()], element]
            // });
            // let list = []
            // Object.keys(alphabatisedList).map((element, index)=>{
            //     if(alphabatisedList[element].length!=0){
            //         list.push({[element]:alphabatisedList[element]})
            //     }
                
            // })
            // console.log("Revised List is: ",list)
            // alphabatisedList = alphabatisedList.filter(element => Object.values(element).length!=0)    
            // console.log(alphabatisedList)
            // console.log("From Action (Contacts): ", response.data, response)
            dispatch({type:TYPE_CONTACTS_REQUEST_SUCCESS, payload: response.data})
            dispatch({type:TYPE_CONTACTS_LOADING_FINISHED})
        })
        .catch(err => {
            // console.log('Error fetching')
        })
    }
}


export const fetchIndividualContact = (contact_id) => {

    //check if the selected contact already exists on Store
    //if not call for it from backend
    
    return (dispatch, getState) => {
        axios.get(`${BASE_URL}api/contacts/${contact_id}`, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            dispatch({type: TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS, payload: response.data})
        })
        
    }
}

export const clearIndividualContact = () => {
    return ({type: TYPE_CLEAR_INDIVIDUAL_CONTACT})
}

export const addPhoto = (contact_id, photo, platform="web") => {
    return (dispatch, getState) => {
        var form = new FormData()
        form.append('contact_id',contact_id)
        if(platform==='web'){
        form.append('photo', photo)
        } else {
            console.log('file://'+photo.path)
            form.append('photo', {
                uri: 'file://'+photo.path,
                type: photo.type,
                name: photo.fileName
            })
        }
        axios.post(BASE_URL+'api/contacts/photo-store',
        form,
        {
            headers: {
                Authorization: 'bearer '+getState().auth.token.token,
                contentType: 'multipart/form-data'
            }
        }).then(response => {
            dispatch(fetchIndividualContact(contact_id))
            dispatch({type:TYPE_CONTACTS_LOADING_FINISHED})
        })
    }
}

export const addAdditionalContacts = (nextLink) => {
    return (dispatch, getState) => {
        axios.get(nextLink, {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            let prevList = getState().contacts.list.data
            let nextList = {...response.data, data:[
                ...prevList,
                ...response.data.data
            ]}
            
            dispatch({type: FETCH_ADDITIONAL_CONTACT_SUCCESS, payload: nextList })
        })
    }
}

export const submitContact = (contact, photo, navigation, platform='web') => {
    return (dispatch, getState) => {
        dispatch({type:TYPE_CONTACTS_LOADING})
        axios.post(BASE_URL+'api/contacts',qs.stringify(contact),{
            headers: {
                Authorization: 'bearer '+ getState().auth.token.token
            }
        }).then(response => {
            dispatch(requestContacts(''))
            return(response.data)
        }).then((data)=>{
            if(photo){
                dispatch(addPhoto(data.data.id, photo, platform))
            }
        }).then(()=>{
            if(platform==="native")
            {
                navigation.goBack()
            } else {
                navigation()
            }
        })
        .catch(error => {
            // console.log("Error: ", error)
        })
    }
}


export const editContact = (editedContact, file, onClose, platform) => {
    return (dispatch, getState)=>{
        const {id} = editedContact
        delete editedContact.id
        // console.log("From Action:", JSON.stringify(editedContact))
        axios.put(`${BASE_URL}api/contacts/${id}`,
        qs.stringify(editedContact),
        {
            headers: {
                Authorization: `bearer ${getState().auth.token.token}`
            }
        }).then(response => {
            if(file){
                dispatch(addPhoto(id, file))
            }
            return ''
        })
        .then(response => {
            dispatch(requestContacts(''))
            dispatch(fetchIndividualContact(id))
            return ''
        }).then(resp => {
            onClose()
        })
        .catch(error => {

        })
    }
}   
const platFormFreeNavigation = (path) => {

}