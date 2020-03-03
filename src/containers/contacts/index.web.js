import React from 'react'
import {
    View,
    Text,
    Animated,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import AlphaScrollFlatList from '../../components/alphabetScrollList'
import Modal from '@material-ui/core/Modal'
import ContactRow from '../../components/contactRow'
import AddContact from './createNewContact/index.web'
import NavBar from '../../components/navBarWeb'
import registerMessage from '../../Utils/messageAPI'
import color from '../../styles/color';
import { store } from '../../App'
import { requestContacts, addAdditionalContacts } from '../../actions/contactsActions'
import { sendChatMessageLocal, fetchMessageListPure, fetchAdditionalMessage } from '../../actions/messageActions'
import { registerVoiceMailES, addLocalVoiceMail, fetchVoiceMailListPure } from '../../actions/voicemailActions'
import { fetchTags } from '../../actions/tagsAction'
import Drawer from '../../components/drawer'
import '../../styles/color'



const dim = Dimensions.get('window')


class Contacts extends React.Component {

    constructor(props) {
        super(props)
        this.alphabetGroup = this.alphabetGroup.bind(this)
        this.openContactModal = this.openContactModal.bind(this)
        this.state = {
            openModal: false,
            searchBarAnim: new Animated.Value(0),
            left: false,
            right: false,
            up: false,
            down: false,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
        }
    }

    addLatestMessage(message) {
        const current_user = store.getState().messages.current_chatting_contact
        console.log(message.data.message)
        console.log("Store rn is: ", store.getState())
        if (message.data.message.sender_phone === (current_user.receive_or_sent === "sent" ? current_user.phone_number : current_user.sender_phone)) {
            console.log("INSIDE IF: LOCAL: ")
            this.props.sendChatMessageLocal(message.data.message)
        }
        else {
            console.log("INSIDE ELSE: REALTIME ")
            this.props.fetchMessageListPure()
            var audio = new Audio('https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.mp3')
            audio.play()
        }
    }

    addLatestVoiceMail(message) {
        const current_user = store.getState().voiceMails.current_voicemail_thread
        console.log("New Message: ", message)
        console.log("contact: ", current_user)
        // console.log("Store rn is: ", store.getState())
        if (message.data.voiceMail.sender_phone === (current_user.receive_or_sent === "sent" ? current_user.phone_number : current_user.sender_phone)) {
            this.props.addLocalVoiceMail(message.data.voiceMail)
        }
        else {
            this.props.fetchVoiceMailListPure()
            var audio = new Audio('https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.mp3')
            audio.play()
        }
    }

    componentDidMount() {
        const { id, phone_no } = this.props.user
        this.props.requestContacts()
        registerMessage(id, phone_no, this.addLatestMessage.bind(this))
        registerVoiceMailES(id, phone_no, this.addLatestVoiceMail.bind(this))
        Dimensions.addEventListener('change', (window, screen) => {
            this.setState({ height: window.window.height, width: window.window.width })
        })
        this.props.fetchTags()
    }

    addContacts() {
        this.setState({ openModal: true })
    }

    closeModal() {
        this.setState({ openModal: false })
    }

    openContactModal(contact, key) {
        // this.setState({ contactSelected: '', openModal: true })
        // this.props.requestContacts()
        this.props.history.push('contact/' + contact.id, { contact, key })
    }

    handleSearch(query) {
        this.props.requestContacts(query)
    }

    handleMessageClick(contact) {
        this.props.history.push('/message', { newMessageForContact: contact })
    }

    alphabetGroup({ item }) {
        const key = Object.keys(item)[0]
        const last = item[key].length
        return (
            <View style={[styles.groupContainer, { paddingStart: 200 }]}>
                <View style={styles.groupHeader}>
                    <Text style={{ color: color.grey, fontSize: 20 }}>
                        {key.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.groupBody}>
                    {item[key].map((name, index) => {
                        return <ContactRow
                            name={name}
                            last={index === last}
                            key={name}
                            animKey={name + index}
                            navigation={this.props.history}
                            onContactSelected={this.openContactModal.bind(this)} />
                    }
                    )}
                </View>

            </View>
        )
    }


    render() {
        const { loading, contacts } = this.props
        console.log(this.props)
        return (

            <View style={{ height: this.state.height, overflow: 'hidden' }}>
                <NavBar onClickHandler={() => {
                    this.setState({ left: true })

                }}
                    handleSearch={this.handleSearch.bind(this)}
                    leftOption="Create Contact"
                    onLeftButtonClick={this.addContacts.bind(this)}

                />
                <Drawer open={this.state.left} onClose={() => {
                    this.setState({ left: false })
                }}
                    navigate={(path) => {
                        this.props.history.push(path)
                    }}
                    user={this.props.user}
                />
                {loading === "pending" ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary, minHeight: dim.height }}>
                        <ActivityIndicator
                            color={color.orange}
                            size={50}
                        />
                    </View>
                    :
                    // paddingLeft: dim.width - dim.width * 0.98
                    <View style={{ flex: 1, backgroundColor: 'rgba(153, 0, 224, 0.01)',  }}>
                        <link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet"></link>
                        <Modal open={this.state.openModal} onClose={this.closeModal.bind(this)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <AddContact close={this.closeModal.bind(this)} />
                            </View>
                        </Modal>


                        { contacts.data ?

                                contacts.data.length === 0 ?
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '30%'
                                    }}>
                                        <Text style={{fontSize: 24, color: 'grey', fontWeight: 'bold'}}>
                                            No Contacts Yet, Add Contacts From Option from top left Corner!!
                                        </Text>
                                    </View> :
                                    <AlphaScrollFlatList
                                        renderItem={({item, index}) =>
                                            <ContactRow
                                                contact={item}
                                                last={false}
                                                key={item.first_name || index}
                                                navigation={this.props.history}
                                                onContactSelected={this.openContactModal.bind(this)}
                                                onMessageClicked={this.handleMessageClick.bind(this)}
                                            />}
                                        data={contacts.data}
                                        style={{flex: 1, maxHeight: this.state.height, paddingTop: 65}}
                                        scrollBarColor={color.base}
                                        scrollBarFontSizeMultiplier={1.5}
                                        itemHeight={dim.height - 65}
                                        scrollBarContainerStyle={{
                                            position: 'fixed',
                                            height: dim.height - 65,
                                            marginTop: 65,
                                            marginRight: 20,
                                            zIndex: 1000
                                        }}
                                        onEndReachedThreshold={0.9}
                                        onEndReached={() => {
                                            if (contacts.links.next) {
                                                this.props.addAdditionalContacts(contacts.links.next)
                                            }
                                        }}
                                        keyExtractor={(item, index) => {
                                            return item + String(index)
                                        }}
                                    />
                             : null
                        }
                    </View>}
            </View>
        )
    }


}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        width: dim.width
    },
    groupContainer: {
        flex: 1,
        flexDirection: 'column',


    },
    groupHeader: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0)',
        paddingStart: 20,

    },
    groupBody: {
        flex: 1,
        flexDirection: 'column',

    },
    parallel: {
        flex: 1,
        flexDirection: 'row',

    },
    contentForm: {
        flex: 1
    }
})

// const ContactWrapper = connect(null, null)() 
const mapStateToProps = (state) => ({
    contacts: state.contacts.list,
    loading: state.contacts.loading,
    user: state.auth,
    current_user: state.messages.current_chatting_contact,
})

Contacts.defaultProps = {
    contacts: [],
    loading: "pending"
}


export default connect(mapStateToProps, { requestContacts, sendChatMessageLocal, fetchTags, fetchMessageListPure, addLocalVoiceMail, fetchVoiceMailListPure, fetchAdditionalMessage, addAdditionalContacts })(Contacts)
