import React from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    FlatList,
    TimePickerAndroid,
    Modal,
    Picker,
    PickerItem,
    PickerIOSItem,
    PickerIOS,
    ActivityIndicator,
    Platform,
    StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Entypo'
import AudioPlayer from '../../components/audioPlayer'
import DatePicker from 'react-native-datepicker'
import { fetchCustomMessages, addCustomMessage, deleteCustomMessage } from '../../actions/messageActions'
import color from '../../styles/color';
import { BASE_URL } from '../../Utils/urls';

class CustomMessage extends React.Component {
    state = {
        openModal: false,
        date: null,
        message_type: '',
        from: '',
        to: '',
        textMessage: ''
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Text style={{fontSize:18, color: 'black'}}>Custom Messages</Text>,
        headerTitleStyle: {
            flex: 1,
            color: 'black',
            fontSize: 18
        },
        headerLeft: <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            navigation.goBack()
        }}>
            <Icon name="chevron-left" size={30} color={color.base} />
        </TouchableWithoutFeedback>,
        headerRight:
            <TouchableOpacity onPress={() => {
                navigation.push('createCustomMessage')
            }}
                style={{ marginRight: 20 }}
            >
                <Icon name="plus" size={30} color="#9900E0" style={{ fontWeight: 'bold' }} />
            </TouchableOpacity>
    })

    renderMessages({ item }) {
        return (
            <View style={styles.customMessage}>
                <View style={styles.upperHolder}>
                    <TouchableWithoutFeedback style={{alignSelf: 'flex-end'}} onPress={()=>{
                        this.props.deleteCustomMessage(item.id)
                    }}>
                        <Icon name="squared-cross" size={20} color={color.base} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 2 }}>
                    {item.message_type === "text" ?
                        <Text style={{color: color.baseLight, fontSize: 18}}>{item.text_message}</Text> :
                        <AudioPlayer audio={BASE_URL + item.voice_message} />}
                    <Text>Message Assigned for {item.forward_date_time}</Text>
                </View>
            </View>
        )
    }



    componentDidMount() {
        this.props.fetchCustomMessages()
    }

    render() {
        let { messages, loading } = this.props

        const openModal = this.props.navigation.getParam("showModal", false)
        return (
            <View style={styles.container}>
                {!loading ?
                    <View>
                        <FlatList
                            data={messages}
                            renderItem={this.renderMessages.bind(this)}
                            style={{ flex: 1 }}
                        />
                    </View>

                    :
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ActivityIndicator size={20} color={color.base} />
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
        overflow: 'scroll'
    },
    upperHolder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    customMessage: {
        flex: 0,
        minHeight: 100,
        borderRadius: 20,
        backgroundColor: 'white',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 1,
        padding: 20


    },
    modalContainer: {
        flex: 1,
        width: '100%'
    }
})

const mapStateToProps = (state) => ({
    messages: state.messages.custom_messages.data,
    loading: state.messages.custom_message_loading
})

export default connect(mapStateToProps, { fetchCustomMessages, addCustomMessage, deleteCustomMessage })(CustomMessage)