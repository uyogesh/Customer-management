import React from 'react'
import {
    TouchableWithoutFeedback,
    NativeModules
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import { fetchMessageList, loadingEnabled, fetchChat, selectCurrentlyChattingContact } from '../../../actions/messageActions'
import ContactContent from './content'
import color from '../../../styles/color';

class Contact extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('contact').first_name,
        headerTitleStyle: {
            color: color.black,
            flex: 1
        },
        headerStyle: {
            // backgroundColor: '#383A42',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS,
            // tintColor: "#E6E7E8",
        },
        headerLeft: <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            navigation.goBack()
        }}>
            <Icon name="chevron-left" size={50} color={color.black} />
        </TouchableWithoutFeedback>,
        headerRight: <TouchableWithoutFeedback style={{ paddingLeft: 10 }} onPress={() => {

        }}>
            <Icon name="gear" size={30} />
        </TouchableWithoutFeedback>

    })

    onMessageClicked(contact) {
        this.props.loadingEnabled()
        const newContact = {
            phone_number: contact.phone_no,
            contact_id: contact.id,
        } 
        this.props.selectCurrentlyChattingContact(newContact)
        const type = contact.contact_id ? "contact_id" : "phone_no"
        const contactId_or_number = contact.contact_id || contact.phone_no
        this.props.navigation.push('chat', { type, contactId_or_number })
    }

    render() {
        return (
            <ContactContent contact={this.props.navigation.getParam('contact')} animKey={this.props.navigation.getParam('key')} onMessageClicked={this.onMessageClicked.bind(this)} />
        )
    }
}


export default connect(null, { fetchMessageList, loadingEnabled, fetchChat, selectCurrentlyChattingContact })(Contact)