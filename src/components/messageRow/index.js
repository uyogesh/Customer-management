import React from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import { filter, isEmpty, isNil } from 'ramda'
import { changeReadStatus, chatLoadingEnabled, deleteContactMessages } from '../../actions/messageActions'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls';
import Delete from '@material-ui/icons/Delete'

class MessageRow extends React.Component {
    state = {
        focused: false
    }

    getContactFromList(contact, contacts) {
        if (contact.receive_or_sent === "sent") {
            let a = filter((value) => {
                return contact.phone_number === value.phone_no
            }, contacts)
            if(isEmpty(a)){
                return contact
            }
            return a[0]
            

        } else {
            return contact
        }
    }

    getTag(contact){
        if(isNil(contact.full_name)){
            return '#'
        }else {
            return contact.full_name.split('')[0].toUpperCase()
        }
    }

    render() {
        const { current_contact, contact, contact_list } = this.props
        const active = current_contact.phone_number === (contact.receive_or_sent === "sent" ? contact.phone_number : contact.sender_phone)
        const localContact = this.getContactFromList(contact, contact_list)
        const pic = contact.receive_or_sent === "sent" ? localContact.photo: contact.sender_info.avatar 
        return (
            <TouchableOpacity onPress={() => {
                this.props.chatLoadingEnabled()
                this.props.onContactSelected(this.props.contact)
                if (contact.read_status === 0) {
                    this.props.changeReadStatus(contact.id)
                }
            }}
                style={[this.state.focused ? styles.contactHolderLast : styles.contactHolder, active ? { backgroundColor: 'rgba(0,0,0,0.2)' } : {}]}
            >
                <View
                    style={styles.row}
                    onMouseEnter={
                        () => {
                            this.setState({ focused: true })
                        }
                    }
                    onMouseLeave={() => {
                        this.setState({ focused: false })
                    }}
                >
                    <View style={[styles.circularImageHolder, { backgroundColor: '#9900E0', borderColor: "#9900E0", borderWidth: 2, overflow: 'hidden' }]}>
                        {pic ?
                            <Image source={{ uri: BASE_URL + pic }} style={{ height: 60, width: 60 }} /> :
                            <Text style={[styles.thumbnail, { color: 'white' }]}>
                                {this.getTag(localContact)}
                            </Text>}
                    </View>
                    <View style={styles.textHolder}>
                        <Text style={styles.text}>
                            {localContact.full_name || localContact.phone_number}
                        </Text>
                        <Text style={this.props.contact.read_status === 1 ? styles.miniText : styles.miniTextBold}>
                            {this.props.contact.message || '...'}
                        </Text>
                    </View>
                    <View style={{marginLeft: "auto"}}>
                        <Delete style={{fontSize: 'xx-large'}} onClick={() => {
                            contact.id ?
                                this.props.deleteContactMessages(contact.id, 'contactId') :
                                this.props.deleteContactMessages(contact.phone_number, 'phone_no')
                        }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

// ()=> props.push('Contact',{user:{name:props.name}})
const styles = StyleSheet.create({
    contactHolder: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        paddingStart: 20,
        marginTop: 5
    },
    row: {
        flexDirection: 'row'
    },
    contactHolderLast: {
        flex: 1,
        width: '100%',
        paddingBottom: 20,
        paddingTop: 20,
        paddingStart: 20,
        marginTop: 5,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    textHolder: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingStart: 20
    },
    text: {
        fontSize: 20,
        color: "#000",
        // fontWeight:'bold',
        fontFamily: 'Lato'
    },
    circularImageHolder: {
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,

    },
    thumbnail: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Lato',
        alignSelf: 'center'
    },
    miniText: {
        fontFamily: 'Lato',
        color: "#777",
    },
    miniTextBold: {
        fontWeight: 'bold',
        color: color.baseLight
    }
})

export default connect((state) => ({ current_contact: state.messages.current_chatting_contact, contact_list: state.contacts.list.data }), {changeReadStatus, chatLoadingEnabled, deleteContactMessages})(MessageRow)
