import React from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import {connect} from 'react-redux'
import {voiceMailLoadingEnabled} from '../../actions/voicemailActions'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls';


class VoiceMailRow extends React.Component {
    state = {
        focused: false
    }

    render() {
        const { current_contact, contact } = this.props
        const active = current_contact.sender_phone === (contact.receive_or_sent === "sent" ? contact.phone_number : contact.sender_phone)
        // const tag = this.props.contact.sender_info.first_name ? this.props.contact.sender_info.first_name.split('')[0].toUpperCase() : '#'
        const tag = contact.full_name ? contact.full_name.split('')[0].toUpperCase() : '#'
        return (
            <TouchableOpacity onPress={() => {
                this.props.voiceMailLoadingEnabled()
                this.props.onContactSelected(this.props.contact)

            }}
                style={[this.state.focused ? styles.contactHolderLast : styles.contactHolder, active ? { backgroundColor: 'rgba(0,0,0,0.4)' } : {}]}
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
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.circularImageHolder, { backgroundColor: '#9900E0', borderColor: "#9900E0", borderWidth: 2, overflow: 'hidden' }]}>
                            {this.props.contact.photo ?
                                <Image source={{ uri: BASE_URL + this.props.contact.photo }} style={{ height: 60, width: 60 }} /> :
                                <Text style={[styles.thumbnail, { color: 'white' }]}>
                                    {tag}
                                </Text>}
                        </View>
                        <View style={styles.textHolder}>
                            <Text style={styles.text}>
                                {this.props.contact.full_name || this.props.contact.receive_or_sent == 'sent' ? this.props.contact.receiver_phone : this.props.contact.sender_phone}
                            </Text>
                            <Text style={this.props.contact.message_seen === 1 ? styles.miniText : styles.miniTextBold}>
                                {this.props.contact.message || '...'}
                            </Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', padding:10 }}>
                        <Text>
                            {this.props.contact.created_at.split(' ')[0]}
                        </Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        fontSize: 10
    },
    miniTextBold: {
        fontWeight: '700',
        color: color.baseLight
    }
})

export default connect((state) => ({ current_contact: state.voiceMails.current_voicemail_thread }), { voiceMailLoadingEnabled })(VoiceMailRow)