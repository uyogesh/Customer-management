import React from 'react'
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Button,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import AlphaScrollFlatList from '../../components/alphabetScrollList'
import ContactRow from '../../components/contactRow'
import SearchBar from '../../components/searchBar'
import color from '../../styles/color'
import { store } from '../../App'
import { registerEventSource, registerVoiceMailES } from '../../Utils/messageApiNative'
import { requestContacts } from '../../actions/contactsActions'
import { sendChatMessageLocal, fetchMessageListPure } from '../../actions/messageActions'
import { addLocalVoiceMail, fetchVoiceMailListPure } from '../../actions/voicemailActions'



const dim = Dimensions.get('window')

class Contacts extends React.Component {

    constructor(props) {
        super(props)
        this.alphabetGroup = this.alphabetGroup.bind(this)
        this.openContactModal = this.openContactModal.bind(this)
        this.state = {
            openModal: false,
            searchBarAnim: new Animated.Value(0),
            date: "2016-05-15",
            disabled: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        const parent = navigation.dangerouslyGetParent();
        const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
        return ({
            headerLeft:
                <TouchableOpacity onPress={() => {
                    if (isDrawerOpen) {
                        navigation.closeDrawer()
                    } else {
                        navigation.openDrawer()
                    }
                }
                }
                    style={{ marginLeft: 20 }}
                >
                    <Icon name="navicon" size={30} color="#9900E0" />
                </TouchableOpacity>,
            headerRight:
                <TouchableOpacity onPress={() => navigation.navigate('CreateContacts')}
                    style={{ marginRight: 20 }}
                >
                    {/* <Icon name="plus" size={30} color="#9900E0" style={{ fontWeight: 'bold' }} /> */}
                    <Text style={{ color: color.base }}>Add Contact</Text>
                </TouchableOpacity>,
            headerTitle: <SearchBar />,
            headerTitleStyle: {
                color: "#9900E0",
                fontSize: 30,
                fontWeight: 'bold',
                alignSelf: 'center',
                textAlign: "center",
                flex: 1,


            },
            headerStyle: {
                backgroundColor: color.primary,
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS,


            },
        }
        )
    }

    // addLatestMessage(message){
    //     this.props.sendChatMessageLocal(message.data.message)
    // }

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
            // var audio = new Audio('https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.mp3')
            // audio.play()
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
            // var audio = new Audio('https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.mp3')
            // audio.play()
        }
    }

    componentDidMount() {
        const { id, phone_no } = this.props.user
        this.props.requestContacts('')
        registerEventSource(id, phone_no, this.addLatestMessage.bind(this))

    }

    openContactModal(contact, key) {
        this.props.navigation.navigate('Contact', { contact, key })
    }

    alphabetGroup({ item }) {
        const key = Object.keys(item)[0]
        const last = item[key].length

        return (
            <View style={styles.groupContainer}>
                <StatusBar
                    backgroundColor="#383A42"
                />
                <View style={styles.groupHeader}>
                    <Text style={{ color: color.grey, fontSize: 20 }}>
                        {key.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.groupBody}>
                    {item[key].map((contact, index) => {

                        return <ContactRow
                            contact={contact}
                            last={index === last}
                            key={contact.name}
                            animKey={contact.name + index}
                            navigation={this.props.navigation}
                            disabled={this.state.disabled}
                            onContactSelected={this.openContactModal.bind(this)}
                        />
                    }
                    )}
                </View>

            </View>
        )
    }


    render() {
        const { loading, contacts } = this.props

        if (loading != "pending") {
            return (
                <View style={{ flex: 1, backgroundColor: color.primary }}>
                    {contacts.length === 0 ?
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, color: 'grey', fontWeight: 'bold' }}>
                                No Contacts Yet, Add Contacts From Option from top left Corner!!
                        </Text>
                        </View> :
                        <AlphaScrollFlatList
                            renderItem={({ item, index }) => {

                                return <ContactRow
                                    contact={item}
                                    last={false}
                                    key={item.first_name + index}
                                    animKey={item.first_name + index}
                                    navigation={this.props.navigation}
                                    onContactSelected={this.openContactModal.bind(this)}
                                />
                            }}
                            // style={{flex:1}}
                            data={contacts}
                            scrollBarColor={"#000"}
                            scrollBarFontSizeMultiplier={1.5}
                            keyExtractor={(item, index) => {
                                return item + String(index)
                            }}

                        />}
                </View>
            )
        }
        else {
            return (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary }}>
                    <ActivityIndicator
                        color={color.orange}
                        size={50}
                    />

                </View>
            )
        }
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
        flex: 1,
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => ({
    user: state.auth,
    contacts: state.contacts.list.data,
    loading: state.contacts.loading,
    current_user: state.messages.current_chatting_contact,
})
// const ContactWrapper = connect(null, null)() 
export default connect(mapStateToProps, { requestContacts, sendChatMessageLocal, fetchMessageListPure, addLocalVoiceMail, fetchVoiceMailListPure })(Contacts)