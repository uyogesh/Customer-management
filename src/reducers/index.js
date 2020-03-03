import { combineReducers } from 'redux'
import authReducer from './authReducer'
import contactsReducer from './contactsReducer'
import msgReducer from './msgReducer'
import tagReducer from './tagsReducer'
import voiceMailReducer from './voiceMailReducer'

export default combineReducers({
    auth: authReducer,
    contacts: contactsReducer,
    messages: msgReducer,
    tags: tagReducer,
    voiceMails: voiceMailReducer,
})