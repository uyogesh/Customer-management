
// auth Reducers related actionsTypes
export const TYPE_LOGIN_STARTED = 'TYPE_LOGIN_STARTED'
export const TYPE_LOGIN_SUCCESS = 'TYPE_LOGIN_SUCCESS'
export const TYPE_LOGIN_FAILURE = 'TYPE_LOGIN_FAILURE'
export const TYPE_ERROR_RESET = 'TYPE_ERROR_RESET'
export const TYPE_AUTH_TOKEN_REQUEST = 'TYPE_AUTH_TOKEN_REQUEST'
export const TYPE_AUTH_TOKEN_SUCCESS = 'TYPE_AUTH_TOKEN_SUCCESS'
export const TYPE_AUTH_TOKEN_FAILURE = 'TYPE_AUTH_TOKEN_FAILURE'
export const TYPE_CLEAR_ERROR="TYPE_CLEAR_ERROR"

// contacts related actionTypes
export const TYPE_CONTACTS_FETCH_REQUEST = 'TYPE_CONTACTS_FETCH_REQUEST'
export const TYPE_CONTACTS_LOADING = 'TYPE_CONTACTS_LOADING'
export const TYPE_CONTACTS_LOADING_FINISHED = 'TYPE_CONTACTS_LOADING_FINISHED'
export const TYPE_CONTACTS_REQUEST_FAILURE = 'TYPE_CONTACTS_REQUEST_FAILURE'
export const TYPE_CONTACTS_REQUEST_SUCCESS = 'TYPE_CONTACT_REQUEST_SUCCESS'
export const TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS="TYPE_FETCH_INDIVIDUAL_CONTACT_SUCCESS"
export const TYPE_CLEAR_INDIVIDUAL_CONTACT="TYPE_CLEAR_INDIVIDUAL_CONTACT"
export const FETCH_ADDITIONAL_CONTACT_SUCCESS="FETCH_ADDITIONAL_CONTACT_SUCCESS"

// Individual contact related actionTypes
export const TYPE_CONTACT_SELECT = 'TYPE_CONTACT_SELECT'
export const TYPE_CONTACT_FETCH_REQUEST = 'TYPE_CONTACT_FETCH_REQUEST'
export const TYPE_CONTACT_FETCH_SUCCESS = 'TYPE_CONTACT_FETCH_SUCCESS'
export const TYPE_CONTACT_FETCH_FAILURE = 'TYPE_CONTACT_FETCH_FAILURE'

// Messages
export const TYPE_FETCH_MESSAGE_LIST = "TYPE_FETCH_MESSAGE_LIST"
export const TYPE_MESSAGE_LIST_SUCCESS = "TYPE_MESSAGE_LIST_SUCCESS"
export const TYPE_MESSAGE_LIST_EMPTY="TYPE_MESSAGE_LIST_EMPTY"
export const TYPE_FETCH_CHAT = "TYPE_FETCH_CHAT"
export const TYPE_MESSAGE_LOADING = "TYPE_MESSAGE_LOADING"
export const TYPE_FETCH_CHAT_SUCCESS = "TYPE_FETCH_CHAT_SUCCESS"
export const TYPE_FETCH_CHAT_FAILURE = "TYPE_FETCH_CHAT_FAILURE"
export const TYPE_FETCH_ADDITIONAL_CHAT = "TYPE_FETCH_ADDITIONAL_CHAT"
export const TYPE_SELECT_CONTACT_FOR_CHAT = "TYPE_SELECT_CONTACT_FOR_CHAT"
export const TYPE_CHAT_LOADING="TYPE_CHAT_LOADING"
export const TYPE_FETCH_ADDITIONAL_MESSAGES="TYPE_FETCH_ADDITIONAL_MESSAGES"
export const TYPE_CLEAR_CHATS="TYPE_CLEAR_CHATS"
export const TYPE_ADD_TO_CURRENT_MESSAGE_LIST="TYPE_ADD_TO_CURRENT_MESSAGE_LIST"

//Tags
export const TYPE_FETCH_TAGS = "TYPE_FETCH_TAGS"
export const TYPE_FETCH_TAGS_SUCCESS = "TYPE_FETCH_TAGS_SUCCESS"
export const TYPE_TAGS_ADDED = "TYPE_TAGS_ADDED"
export const TYPE_TAGS_LOADING = "TYPE_TAGS_LOADING"

//Notes Action Types
export const TYPE_FETCH_CONTACT_NOTES_SUCCESS = "TYPE_FETCH_CONTACT_NOTES_SUCCESS"
export const TYPE_ADD_CONTACT_NOTES = "TYPE_ADD_CONTACT_NOTES"

//Custom messages
export const TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS = "TYPE_FETCH_CUSTOM_MESSAGE_SUCCESS"
export const TYPE_CUSTOM_MESSAGE_ADD = "TYPE_CUSTOM_MESSAGE_ADD"
export const TYPE_CUSTOM_MESSAGE_LOADING = "TYPE_CUSTOM_MESSAGE_LOADING"

//Voice mail Types
export const TYPE_VOICE_MAIL_LOADING = "TYPE_VOICE_MAIL_LOADING"
export const TYPE_FETCH_VOICE_MAIL_SUCESS = "TYPE_FETCH_VOICE_MAIL_SUCESS"
export const TYPE_VOICE_MAIL_ADD = "TYPE_VOICE_MAIL_ADD"
export const TYPE_VOICE_MAIL_LOADED = "TYPE_VOICE_MAIL_LOADED"
export const TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS = "TYPE_FETCH_INDIVIDUAL_VOICE_MAIL_SUCCESS"
export const TYPE_INDIVIDUAL_VOICEMAIL_LOADING = "TYPE_INDIVIDUAL_VOICEMAIL_LOADING"
export const TYPE_SELECT_CURRENT_VOICEMAIL = "TYPE_SELECT_CURRENT_VOICEMAIL"
export const VOICEMAIL_RESPONSE_EMPTY = "VOICEMAIL_RESPONSE_EMPTY"
export const TYPE_VOICE_MAIL_INDIVIDUAL_LOADING="TYPE_VOICE_MAIL_INDIVIDUAL_LOADING"

//LOg Out
export const TYPE_LOGOUT = "TYPE_LOGOUT" 