import React from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    KeyboardAvoidingView,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { filter, isEmpty } from 'ramda'
import NavBar from '../../components/navBarWeb'
import Drawer from '../../components/drawer'
import SearchBar from '../../components/searchBar'
import SendNewMessage from './sendNewMessage/index.web'
import { fetchMessageList, loadingEnabled, selectCurrentlyChattingContact, fetchChat, registerEventSource, sendChatMessageLocal, fetchAdditionalMessage, addCurrentMessageList, fetchMessageListPure } from
        '../../actions/messageActions'
import MessageRow from '../../components/messageRow'
import MessageBanner from '../../components/messageBanner'
import MessageThread from './messageThread/index.web'
import color from '../../styles/color'
import Modal from "@material-ui/core/Modal";



let dim = Dimensions.get('window')
class Message extends React.Component {

    state = {
        openModal: false,
        open: false,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    }


    openContactModal(contact) {
        this.props.selectCurrentlyChattingContact(contact)
        this.props.fetchChat(contact.receive_or_sent === "sent" ? contact.phone_number : contact.sender_phone)
        // this.props.history.push('chat', { type, contactId_or_number })
    }

    addLatestMessage(message) {
        this.props.sendChatMessageLocal(message.data.message)
    }

    handleSearch(query){
        this.props.fetchMessageList(null, query)
    }

    componentDidMount() {
        // this.props.fetchMessageList()
        const { location } = this.props.history
        if (location.state && location.state.newMessageForContact) { //If the message icon on Contacts page is clicked and redirected here

            let localMessage = {
                contact_id: location.state.newMessageForContact.id,
                created_at: moment(),
                full_name: location.state.newMessageForContact.full_name,
                message: '',
                message_type: 'text',
                phone_number: location.state.newMessageForContact.phone_no,
                read_status: 0,
                receive_or_sent: 'sent',
                sender_info: {
                    avatar: '',
                    full_name: '',
                    phone: '',
                    user_id: 0
                },
                sender_phone: ''
            }


            this.props.fetchMessageList(localMessage)
            this.props.selectCurrentlyChattingContact(localMessage) //First set as Currently Selected Contact
            // this.props.fetchMessageListPure(localMessage)
        } else {
            this.props.fetchMessageList()
        }
        Dimensions.addEventListener('change', (window, screen) => {
            this.setState({
                height: window.window.height,
                width: window.window.width
            })
        })
        // registerEventSource(this.props.user.id, this.props.user.phone_no, this.addLatestMessage.bind(this))
    }

    addContacts() {
        this.setState({ openModal: true })
    }

    closeModal() {
        this.setState({ openModal: false })
    }

    getContactFromList(contact, contacts) {
        if (contact.receive_or_sent === "sent") {
            let a = filter((value) => {
                return contact.phone_number === value.phone_no
            }, contacts)
            if (isEmpty(a)) {
                return contact
            }
            return a[0]


        } else {
            return contact
        }
    }

    render() {
        const { messages, loading, user, contacts, chats_loading } = this.props
        let { current_user } = this.props
        if (current_user.length !== 0) {
            if (current_user.receive_or_sent === "sent") {
                current_user['id'] = current_user.contact_id
                current_user['phone_number'] = current_user.phone_number
            } else if (current_user.receive_or_sent === "receive") {
                current_user['id'] = current_user.contact_id
                current_user['phone_number'] = current_user.sender_phone
                current_user['full_name'] = current_user.sender_info.full_name
            }
        }
        const currentLocalUser = this.getContactFromList(current_user, contacts.data)
        return (
            <View
                style={{ flexDirection: 'row', flex: 1, height: this.state.height, overflow: 'hidden', paddingTop: 65 }}>
                <NavBar title="Messages" onClickHandler={() => {
                    this.setState({ open: true })
                }}
                    leftOption="Send Message"
                    onLeftButtonClick={this.addContacts.bind(this)}
                />
                <Drawer open={this.state.open} onClose={() => {
                    this.setState({ open: false })
                }}
                    user={user}
                    navigate={(path) => {
                        this.props.history.push(path)
                    }}
                />
                <KeyboardAvoidingView style={styles.container}>
                    {loading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary }}>
                            <ActivityIndicator
                                color={color.orange}
                                size={50}
                            />

                        </View> :
                        <View style={{ flex: 1 }}>
                            <View style={styles.bannerHolder}>
                                {/* <Text style={styles.banner}>Messages</Text> */}
                                <SearchBar handleSearch={this.handleSearch.bind(this)}/>
                            </View>
                            <Modal open={this.state.openModal} onClose={this.closeModal.bind(this)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <SendNewMessage
                                        close={this.closeModal.bind(this)}
                                        contact={this.props.contacts}
                                        navigation={this.props.history}
                                    />
                                </View>
                            </Modal>
                            {
                                (messages.data.length !== 0) ?
                                <View style={{flex: 7}}>
                                <FlatList
                                renderItem={({item}) => {
                                const active = current_user.phone_number === (item.receive_or_sent === "sent" ? item.phone_number : item.sender_phone)
                                return (<MessageRow
                                    contact={item}
                                    last={false}
                                    active={active}
                                    key={item.name}
                                    navigation={this.props.history}
                                    onContactSelected={this.openContactModal.bind(this)}
                                />)
                            }}
                                data={messages.data}
                                keyExtractor={(item, index) => {
                                return item + String(index)
                            }}
                                style={{height: '100%'}}
                                initialScrollIndex={0}
                                onEndReachedThreshold={0.4}
                                onEndReached={() => {
                                console.log("New Message request sent")
                                if (!(messages.links.next === null)) {

                                    this.props.fetchAdditionalMessage()
                                    console.log("Confirmed: ", messages.links.next)
                                } else {

                                }
                            }}

                                />
                                </View>
                                :
                                    <View style={{flex: 7}}>
                                        <Text style={{ alignSelf: 'center', top: '50%', flex:7, marginTop: '30px' }}>No messages matched.</Text>
                                    </View>

                            }
                        </View>}
                </KeyboardAvoidingView>
                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'baseline' }}>
                    <View style={{ flex: 1, width: '100%', borderBottomColor: '#BBB', borderBottomWidth: 1 }}>
                        <MessageBanner contact_info={currentLocalUser} navigation={this.props.history} />
                    </View>
                    <View style={{ flex: 7, width: '100%' }}>
                        {!(current_user.length === 0) || chats_loading ? <MessageThread
                        /> : <Text style={{ alignSelf: 'center', top: '50%' }}>No Messages To Display.</Text>}
                    </View>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 60,
        // height: dim.height,
        // backgroundColor: "#DDD",
        borderRightWidth: 1, borderRightColor: '#BBB'
    },
    banner: {
        fontWeight: 'bold',
        fontSize: 32
    },
    bannerHolder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        // padding: 20
    }
})

const mapStateToProps = (state) => ({
    user: state.auth,
    messages: state.messages.messages,
    loading: state.messages.loading,
    contacts: state.contacts.list,
    current_user: state.messages.current_chatting_contact,
    chats_loading: state.messages.chats_loading,
})
export default connect(mapStateToProps,
    {
        fetchMessageList,
        loadingEnabled,
        selectCurrentlyChattingContact,
        fetchChat,
        sendChatMessageLocal,
        fetchAdditionalMessage,
        addCurrentMessageList,
        fetchMessageListPure,
    })(Message)
