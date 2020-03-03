import React from 'react'
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Dimensions,
    StyleSheet
} from 'react-native'
import Cross from '@material-ui/icons/CloseRounded'
import { connect } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import { fetchCustomMessages, addCustomMessage, deleteCustomMessage } from '../../actions/messageActions'
import NavBar from '../../components/navBarWeb'
import Drawer from '../../components/drawer'
import CreateContact from './createCustomMessage/index'
import AudioPlayer from '../../components/audioPlayer/index'
import { BASE_URL } from '../../Utils/urls'
import color from '../../styles/color'

const dim = Dimensions.get('window')
class CustomMessage extends React.Component {

    constructor(props) {
        super(props)
        this.updateDimension = this.updateDimension.bind(this)
    }

    state = {
        height: dim.height,
        width: dim.width,
        openModal: false,
        date: null,
        message_type: '',
        from: '',
        to: '',
        textMessage: '',
        left: false,


    }

    renderMessages({ item }) {
        return (
            <View style={styles.customMessage}>
                <View style={styles.upperHolder}>
                    
                    <Cross style={{alignSelf: 'flex-end'}} color={color.base} onClick={()=>{
                        this.props.deleteCustomMessage(item.id)
                    }} />
                </View>
                <View style={{ flex: 2 }}>
                    {item.message_type === "text" ?
                        <Text>{item.text_message}</Text> :
                        <AudioPlayer audio={BASE_URL + item.voice_message} />
                    }
                    {item.is_default==="1"?<Text style={{fontWeight: 'bold', color: color.base, alignSelf: 'flex-end'}}>Default Message</Text>:null}

                </View>
            </View>
        )
    }

    // audioRecorder(){
    //     <AudioRecorder />   
    // }

    updateDimension(windowSize, screenSize) {
        this.setState({ height: windowSize.window.height })
        this.setState({ width: windowSize.window.width })
    }

    onAddCustomMessage() {
        this.setState({ openModal: true })
    }

    onCreate(innerState) {
        const { recordedBlob,
            date,
            time,
            message_type,
            from,
            to,
            textMessage,
            isDefault,
            message_format } = innerState

        if (message_format === 1) {
            this.props.addCustomMessage(textMessage, "text", message_type, message_type === 3 ? from + '-' + to : date, isDefault ? 1 : 0)
        }
        else if (message_format === 2) {
            this.props.addCustomMessage(recordedBlob.blob, "audio", message_type, message_type === 3 ? from + '-' + to : date, isDefault ? 1 : 0)
        }

    }

    renderArrangedList({ item, index }) {

    }

    arrangeCustomMessages(messages) {
        let customMessage = {
            Sunday_Message: [],
            Holiday_Message: [],
            Fixed_Time_Interval_Message: [],
            // Fixed_Day_Message: [],
        }

        messages.forEach((value, index) => {
            if (value.forward_type === 1) {
                customMessage['Sunday_Message'].push(value)
            } else if (value.forward_type === 2) {
                customMessage['Holiday_Message'].push(value)
            } else if (value.forward_type === 3) {
                customMessage['Fixed_Time_Interval_Message'].push(value)
            }//  else if (value.forward_type === 4) {
            //     customMessage['Fixed_Day_Message'].push(value)
            // }
        })

        return customMessage

    }
    componentWillReceiveProps(nextProp){
        if(this.props.customMessage!=nextProp.customMessage){
            this.setState({openModal: false})
        }
    }

    componentDidMount() {
        this.props.fetchCustomMessages()
        Dimensions.addEventListener('change', this.updateDimension)
    }

    render() {
        const { customMessage, loading } = this.props
        const { openModal } = this.state
        // console.log(messages)
        
        return (
            <View style={[styles.container, {height: this.state.height}]}>
                <link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet"></link>
                <NavBar onClickHandler={() => {
                    this.setState({ left: true })

                }}
                    leftOption="Add a Custom Message"
                    onLeftButtonClick={this.onAddCustomMessage.bind(this)}

                />
                <Drawer open={this.state.left} onClose={() => {
                    this.setState({ left: false })
                }}
                    navigate={(path) => {
                        this.props.history.push(path)
                    }}
                    user={this.props.user}
                />
                <Modal open={openModal} onClose={() => {
                    this.setState({ openModal: false })
                }}
                    style={{ flex: 1, height: this.state.height - 200 }}
                >
                    <CreateContact onCreate={this.onCreate.bind(this)} onModalClose={() => {
                        this.setState({ openModal: false })
                    }} />
                </Modal>
                {!loading ?
                    <View style={{ paddingTop: 64, height: this.state.height, flexDirection: 'row' }}>
                        {Object.keys(customMessage).map((value, index) =>
                            <View style={{flex:1}}>
                                <Text style={{ alignSelf: 'center', fontSize: 24, fontWeight: 'bold', color: color.base, margin:10 }}>{value.replace(/_/g, ' ')}</Text>
                                {customMessage[value].length===0?
                                <Text style={{alignSelf: 'center', top:  20}}>No Custom Messages {value.replace(/_/g, ' ')}</Text>:
                                <FlatList
                                    data={customMessage[value]}
                                    renderItem={this.renderMessages.bind(this)}
                                    style={{ flex: 1, marginLeft: '20%', marginRight: '20%' }}
                                />}
                            </View>
                        )}
                    </View> :
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ActivityIndicator size={20} color={color.base} />
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(153, 0, 224, 0.1)',

        // overflow: 'scroll',

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
    customMessage: state.messages.custom_messages,
    loading: state.messages.custom_message_loading,
    user: state.auth,
})

export default connect(mapStateToProps, { fetchCustomMessages, addCustomMessage, deleteCustomMessage })(CustomMessage)