import React from 'react'
import {
    View,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Dimensions,
    Text,
    FlatList,
    CameraRoll,
    StyleSheet,
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/EvilIcons'
import ImagePicker from 'react-native-image-picker'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { fetchChat, sendChatMessageLocal, sendChatMessage, fetchAdditionalChat, clearChat } from '../../../actions/messageActions'
import Chat from '../../../components/chatThread'
import color from '../../../styles/color'
import { BASE_URL } from '../../../Utils/urls';



class MessageThread extends React.Component {
    constructor(props) {
        super(props)
        this.normalizeChat = this.normalizeChat.bind(this)
    }
    state = {
        message: '',
        messages: [
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }
        ],
        flatRef: null,
        chatLoaded: false,
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('name'),
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
            <Icon name="chevron-left" size={35} color={color.black} />
        </TouchableWithoutFeedback>,
    })

    componentDidMount() {
        const type = this.props.navigation.getParam('type')
        const contactId_or_number = this.props.navigation.getParam('contactId_or_number')
        this.props.fetchChat(contactId_or_number)
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        let formatted_date = moment().format('YYYY-MM-DD HH:mm:ss').toLocaleString()
        const newMessage =
        {
            message: messages[0].text,
            sent_receive_status: 1,
            created_at: formatted_date
        }
        this.props.sendChatMessage(messages[0].text)
        this.props.sendChatMessageLocal(newMessage)
    }

    handleAudio() {
        ImagePicker.showImagePicker
    }
    normalizeChat(chats) {
        console.log(chats)
        var messages =  chats.map((value, index) => {
            const a = {
                _id: index,
                text: value.message,
                createdAt: moment(value.created_at),
                user: {
                    _id: value.phone_number === this.props.user.phone_no ? 2 : 1,
                    avatar: value.phone_number === this.props.user.phone_no ? `${BASE_URL}${value.sender_info.avatar}` || '' : ''
                }
            }
            if (!(value.file === null || value.file === "null")) {
                a['image'] = `${BASE_URL}${value.file}`
            }
            return a
        })
        console.log("The messages are: ", messages)
        this.setState({ invertedList: messages.reverse(), chatLoaded: true })
    }

    componentWillUnmount(){
        this.props.clearChat()
    }

    render() {
        let { loading, sendChatMessageLocal, chats, user, other_contact } = this.props
        const { message, chatLoaded } = this.state
        let messages = []
        let invertedList
        if (chats.data) {
            messages =  chats.data.map((value, index) => {
                const a = {
                    _id: index,
                    text: value.message,
                    createdAt: moment(value.created_at),
                    user: {
                        _id: value.phone_number === this.props.user.phone_no ? 2 : 1,
                        avatar: value.phone_number === this.props.user.phone_no ? `${BASE_URL}${value.sender_info.avatar}` || '' : ''
                    }
                }
                if (!(value.file === null || value.file === "null")) {
                    a['image'] = `${BASE_URL}${value.file}`
                }
                return a
            })
            invertedList = messages.reverse()
        }
        console.log(messages)
        return (
            <KeyboardAvoidingView style={styles.container}>
                {invertedList===undefined ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary }}>
                        <ActivityIndicator
                            color={color.orange}
                            size={50}
                        />

                    </View> :
                    <GiftedChat
                        messages={invertedList}
                        onSend={messages => this.onSend(messages)}
                        listViewProps={{
                            // initialScrollIndex: invertedList.length - 1,
                            ref: (ref) => {
                                console.log("Inverted List length: ", invertedList.length)
                                this.chatBoxRef = ref
                            },
                            onLayout: () => this.chatBoxRef.scrollToEnd(),
                            onEndReachedThreshold: 0.1,
                            onEndReached: () => {
                                if(!(this.props.chats.links.next===null)){
                                    this.props.fetchAdditionalChat()
                                }
                            }
                        }}
                        style={{ flex: 1 }}
                        user={{
                            _id: 1,
                        }}
                        inverted={false} // inverted false due to react-native 0.55 has a weird bug while scrolling in FlatList inverted vertically.
                    //This bug is compensated by leaving the inverted=false, but by inverting the chat data itself, and setting initialScrollIndex to last element.  

                    // renderActions={() => {
                    //     return (
                    //         <Icon
                    //             name="image"
                    //             size={35}
                    //             hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    //             color={color.base}
                    //             style={{
                    //                 bottom: 50,
                    //                 // right: Dimensions.get("window").width / 2,
                    //                 // position: "absolute",
                    //                 shadowColor: "#000",
                    //                 shadowOffset: { width: 0, height: 0 },
                    //                 shadowOpacity: 0.5,
                    //                 zIndex: 2,
                    //                 backgroundColor: "transparent"
                    //             }}
                    //             onPress={this.handleAudio}

                    //         />
                    //     )
                    // }}
                    />
                }
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10

    },
    icon: {
        padding: 5
    }
})

const mapStateToProps = (state) => ({
    chats: state.messages.current_chats,
    loading: state.messages.loading,
    contacts: state.contacts.list.data,
    user: state.auth,
    other_contact: state.messages.current_chatting_contact
})

export default connect(mapStateToProps, { fetchChat, sendChatMessageLocal, sendChatMessage, fetchAdditionalChat, clearChat })(MessageThread)