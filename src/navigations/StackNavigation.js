import React from 'react'
import {
    createStackNavigator,
    
} from 'react-navigation'
import Contacts from '../containers/contacts'
import Contact from '../containers/contacts/Contact'
import Login from '../containers/login/Login'

const ContactsNavigator = createStackNavigator({
    Contacts: {
        screen: Contacts,

    },
    Contact: {
        screen: Contact 
    },
    Login: {
        screen: Login 
    }
},{
    initialRouteName: 'Contacts'
})

export default ContactsNavigator