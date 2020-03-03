import axios from "axios"
import { BASE_URL } from '../Utils/urls'
import {
    TYPE_LOGIN_STARTED,
    TYPE_LOGIN_SUCCESS,
    TYPE_LOGIN_FAILURE,
    TYPE_AUTH_TOKEN_FAILURE,
    TYPE_ERROR_RESET,
    TYPE_AUTH_TOKEN_SUCCESS,
    TYPE_LOGOUT,
    TYPE_CLEAR_ERROR,
} from '../actions/actionTypes'
import { store } from '../App'
import qs from 'querystring'
// import request from 'request'
export const getAuthToken = (username, password, navigation, platform) => {

    return (dispatch, state) => {
        dispatch({
            type: TYPE_LOGIN_STARTED
        })
        const body = {
            email: username,
            password: password
        }



        axios.post(BASE_URL + "/api/auth/login", qs.stringify(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json'
            },
            //  
        }).then((response) => {
            if(response.status===200){
            dispatch({
                type: TYPE_AUTH_TOKEN_SUCCESS,
                payload: response.data
            })} else {
                dispatch({type:TYPE_LOGIN_FAILURE, payload: true})    
            }
        
            return response.data.token||''
        }).then((token) => {
                dispatch(getUserInfo(token,navigation, platform))
        }
        ).catch((err) => {
            console.log('error:', err)
            dispatch({type:TYPE_LOGIN_FAILURE, payload: true})
        })
    }
}

export const getUserInfo = (token, navigation, platform) => {
    return (dispatch, state) => {
        console.log("Im here")
        if (state().auth.token.token) {
            
                axios.get(BASE_URL + 'api/auth/me', {
                    headers: {
                        Authorization: 'bearer ' + token
                    },
                }).then(function (response) {
                    dispatch({ type: TYPE_LOGIN_SUCCESS, payload: response.data })
                    if(platform==="web"){
                        navigation.push('/contacts')
                    }
                    else {
                        navigation.navigate('drawerNavigator')
                    }
                    
                }).catch(err => {
                    console.log(err)
                })
        }
    }
}

export const logOut = () => {
        return ({type:TYPE_LOGOUT})
}

export const clearLoginError = () => {
    return ({type: TYPE_CLEAR_ERROR})
}