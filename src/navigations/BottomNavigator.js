import React from 'react'
import {
    createBottomTabNavigator,
    createDrawerNavigator,
    createAppContainer,
    createStackNavigator
} from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'
import color from '../styles/color'
import Contacts from '../containers/contacts/index'
import Contact from '../containers/contacts/Contact/index.native'
import CreateContact from '../containers/contacts/createNewContact'
import CustomMessage from '../containers/custom-messages'
import createCustomMessage from '../containers/custom-messages/createCustomMessage/index'
import VoiceMail from '../containers/voiceMail/index'
import VoiceMailThread from '../containers/voiceMail/createVoiceMail/index'
import Message from '../containers/messages/index'
import MessageThread from '../containers/messages/messageThread'
import Settings from '../containers/settings/index'
import Login from '../containers/login/Login'
import Drawer from '../containers/navigationDrawer'

const contactsStack = createStackNavigator({
    Contacts: {
        screen: Contacts,
        title: "Contacts"
    },
    CreateContacts: {
        screen: CreateContact,

    },
    Contact: {
        screen: Contact
    }
},
{
    
    initialRouteName: 'Contacts'
})

const messageStack = createStackNavigator({
    messages: {
        screen: Message,
        
    },
    chat: {
        screen: MessageThread
    }
})

const voiceMailStack = createStackNavigator({
    voiceMail: {
        screen: VoiceMail,
    },
    voicemailThread: {
        screen: VoiceMailThread
    }
})

const settingsStack = createStackNavigator({
    setting: {
        screen: Settings
    }
})

const customMessageStack = createStackNavigator({
    customMessage: {
        screen: CustomMessage
    },
    createCustomMessage: {
        screen: createCustomMessage
    }
})

const drawerNavigator = createDrawerNavigator({
    
    contactsStack,
    messageStack,
    voiceMailStack,
    customMessageStack,
    settingsStack,
    
},{
    initialRouteName: 'contactsStack',
    mode:'modal',
    drawerType: 'slide',
    drawerWidth: 200,
    drawerBackgroundColor: color.primary,
    overlayColor: 'rgba(0,0,0,0)',
    contentComponent: Drawer
})


const topStackNav = createStackNavigator({
    Login: {
        screen: Login,
    },
    drawerNavigator
},
{
    mode: 'modal',
    initialRouteName: 'Login',
    headerMode: "none"
    
})

export default createAppContainer(topStackNav)