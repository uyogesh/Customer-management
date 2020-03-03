import React from 'react'
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/EvilIcons'
import EventSource from '../../Utils/messageApiNative'
import { fetchMessageList, loadingEnabled, selectCurrentlyChattingContact, fetchChat, sendChatMessageLocal, fetchAdditionalMessage } from '../../actions/messageActions'
import MessageRow from '../../components/messageRow'
import color from '../../styles/color'


class Message extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Messages",
        headerLeft: () =>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 20 }}
            >
                <Icon name="navicon" size={30} color="#9900E0" />
            </TouchableOpacity>,
    })

    state={
        refreshing: false
    }

    openContactModal(contact) {
        this.props.loadingEnabled()
        this.props.selectCurrentlyChattingContact(contact)
        const type = contact.contact_id?"contact_id":"phone_number"
        const contactId_or_number = contact.phone_number
        const n = this.props.contacts.filter(value => {
            value.phone_no===contactId_or_number
        })
        const name = n.length>0?n[0].first_name:contactId_or_number
        this.props.navigation.push('chat', {type,contactId_or_number, name})
    }

    addLatestMessage(message){
        this.props.sendChatMessageLocal(message.data.message)
    }

    componentDidMount(){
        const {id, phone_no} = this.props.user
        this.props.fetchMessageList()
        // EventSource(id, phone_no, this.addLatestMessage.bind(this))
    }

    render() {
        const { messages, loading } = this.props
        return (
            <KeyboardAvoidingView style={styles.container}>
                {loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary }}>
                        <ActivityIndicator
                            color={color.orange}
                            size={50}
                        />

                    </View> :
                    <FlatList
                        renderItem={({ item }) =>
                            <MessageRow
                                contact={item}
                                last={false}
                                key={item.name}
                                navigation={this.props.navigation}
                                onContactSelected={this.openContactModal.bind(this)}
                            />}
                        data={messages.data}
                        refreshControl={
                        <RefreshControl 
                            refreshing={this.state.refreshing}
                            onRefresh={()=>{
                                this.setState({refreshing: true})
                            }}
                        />
                        }
                        onEndReachedThreshold={0.9}
                        onEndReached={()=>{
                            if(!(messages.links.next===null)){
                                this.props.fetchAdditionalMessage()
                            } else {
                                
                            }
                        }}
                        keyExtractor={(item, index) => {
                            return item + String(index)
                        }}
                        // initialScrollIndex={messages.length - 1}

                    />}
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.primary
    }
})

const mapStateToProps = (state) => ({
    messages: state.messages.messages,
    loading: state.messages.loading,
    user: state.auth,
    contacts: state.contacts.list.data,
})
export default connect(mapStateToProps, {fetchMessageList, loadingEnabled,fetchChat, selectCurrentlyChattingContact, sendChatMessageLocal, fetchAdditionalMessage})(Message)