import React from 'react'
import {
    View,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Text,
    FlatList,
    CameraRoll,
    StyleSheet,
} from 'react-native'
// import Icon from 'react-native-vector-icons/EvilIcons'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { fetchChat, sendChatMessageLocal, sendChatMessage } from '../../../actions/messageActions'
// import Chat from '../../../components/chatThread'
import color from '../../../styles/color'



class MessageThread extends React.Component {

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
        flatRef: null
    }

    componentDidMount() {
        const type = this.props.navigation.getParam('type')
        const contactId_or_number = this.props.navigation.getParam('contactId_or_number')
        console.log(type, contactId_or_number)
        this.props.fetchChat(type, contactId_or_number)
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        let current_datetime = new Date()
        let formatted_date = current_datetime.getUTCFullYear() + "-" + (current_datetime.getUTCMonth() + 1) + "-" + current_datetime.getUTCDay() + " " + current_datetime.getUTCHours() + ":" + current_datetime.getUTCMinutes() + ":" + current_datetime.getUTCSeconds() 
        console.log("Date: ",formatted_date)
        const newMessage = 
            {
                message: messages[0].text,
                sent_receive_status: 1,
                created_at: formatted_date
            }
        this.props.sendChatMessage(messages[0].text)
        this.props.sendChatMessageLocal(newMessage)
    }

    render() {
        let { loading, sendChatMessageLocal, chats, user, other_contact } = this.props
        const { message } = this.state
        let messages=[]
        console.log("Loaded this Native module on Web")
        if(chats){
        messages = chats.map((value, index) => {
            const date = value.created_at.split(' ')
            const year = date[0].split('-')
            const time = date[1].split(':')
            return {
                _id:  index,
                text: value.message,
                createdAt: new Date(Date.UTC(Number(year[0]), Number(year[1]), Number(year[2]), Number(time[0]), Number(time[1]), Number(time[2]))),
                user: {
                    _id: value.phone_number === user.phone_no ? 2 : 1
                }

            }
        })
    
    }
        return (
            <KeyboardAvoidingView style={styles.container}>
                {loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary }}>
                        <ActivityIndicator
                            color={color.orange}
                            size={50}
                        />

                    </View> :
                    <View style={{ justifyContent: 'center', alignItems: 'stretch', flex: 1 }}>
                        <GiftedChat
                            messages={messages}
                            onSend={messages => this.onSend(messages)}
                            user={{
                                _id: 1,
                            }}
                        />
                    </View>
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
    chats: state.messages.current_chats.data,
    loading: state.messages.loading,
    contacts: state.contacts.list,
    user: state.auth,
    other_contact: state.messages.current_chatting_contact
})

export default connect(mapStateToProps, { fetchChat, sendChatMessageLocal, sendChatMessage })(MessageThread)