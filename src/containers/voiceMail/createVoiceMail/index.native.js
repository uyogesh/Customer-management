import React from 'react'
import {
    View,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import AudioPlayer from '../../../components/audioPlayer'
import { connect } from 'react-redux'
import { fetchIndividualVoiceMail, addLocalVoiceMail, addVoiceMail } from '../../../actions/voicemailActions'
import color, { colorwAlpha } from '../../../styles/color'
import { BASE_URL } from '../../../Utils/urls';


const dim = Dimensions.get('window')
class MessageThread extends React.Component {

    constructor(props) {
        super(props)
        
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.onData = this.onData.bind(this)
        this.onStop = this.onStop.bind(this)
    }
    state = {
        message: '',
        messages: [
            {
                message: 'Hello there!!',
                sent_receive_status: 0
            },
            {
                message: 'Hello there!!',
                sent_receive_status: 0
            },
            {
                message: 'Hello there!!',
                sent_receive_status: 1
            },
            {
                message: 'Hello there!!',
                sent_receive_status: 1
            }
        ],
        photo: null,
        flatRef: null,
        record: false,
        recordedBlob: null,

    }

    startRecording = () => {
        
        this.setState({
            record: true
        });
        console.log("On start recording: ", this.state)
    }

    stopRecording = () => {
        this.setState({
            record: false
        });
    }

    onData(recordedBlob) {

        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop(recordedBlob) {
        this.setState({ recordedBlob })
        console.log('recordedBlob is: ', recordedBlob);

    }

   
    componentDidMount() {
        this.props.fetchIndividualVoiceMail(this.props.current_voicemail)
    }
    render() {
        const { loading, user, classes, current_voicemail } = this.props
        console.log(this.state)
        return (
            <View style={[{ flex: 1, paddingBottom: 50, width: '100%' }, this.props.backgroundColor]}>
                {loading ?
                    <ActivityIndicator color={color.base} size={20} /> :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, marginBottom: 20 }}>
                            <FlatList
                                data={this.props.voicemails}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{flex:1, padding: 20, borderBottomColor: 'rgba(0,0,0,0.3)', borderBottomWidth:1}}>
                                            <AudioPlayer audio={`${BASE_URL}${item.voice_message_file}`}/>
                                            <Text style={{alignSelf:'flex-end'}}>{item.created_at}</Text>
                                        </View>
                                    )
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                // onContentSizeChange={() => this.flatList.scrollToIndex({index:0 ,animated: true })}
                                ref={ref => this.flatList = ref}
                                
                                style={{flex:1, height: dim.height, width: dim.width}}
                            // onLayout={() => this.flatList.scrollToIndex({index:0,animated: true })}
                            />
                        </View>
                        {/* <View style={styles.bottomTextInput}>
                            
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                                <View>
                                    <ReactMic
                                        record={this.state.record}
                                        className="sound-wave"
                                        onStop={this.onStop}
                                        onData={this.onData}
                                        strokeColor="#000000"
                                        backgroundColor={color.base} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                                        <button onClick={this.startRecording} type="button" style={{ flex: 1, fontSize: 15, fontFamily: 'Lato', flexDirection: 'row', padding: 5 }}>Start &#127908;</button>
                                        <button onClick={this.stopRecording} type="button" style={{ flex: 1, fontSize: 15, fontFamily: 'Lato', padding: 5 }}>Stop &#9632;</button>
                                    </View>
                                    {this.state.recordedBlob ? <View style={{ flex: 1, marginLeft: 10 }}><AudioPlayer audio={this.state.recordedBlob.blobURL} /></View> : null}
                                </View>
                            </View>
                            <button
                                    ref={(ref) => this.buttonRef = ref}
                                    disabled={!this.state.recordedBlob}
                                    style={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
                                    onClick={() => {
                                        const msg = {
                                            binary_message_file:this.state.recordedBlob.blobURL,
                                            created_at: "now",
                                            file_type: "audio",
                                            receive_or_sent: "sent",
                                            local: true
                                        }
                                        let phone = current_voicemail.receive_or_sent==='sent'?current_voicemail.receiver_phone:current_voicemail.sender_phone
                                        this.props.addLocalVoiceMail(msg)
                                        this.props.addVoiceMail(this.state.recordedBlob.blob, phone)
                                    }}>

                                    <Send color={this.state.message === '' ? color.base : 'grey'} />
                                </button>
                        </View> */}
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomTextInput: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: colorwAlpha(color.base, 0.1),
        padding: 15,
        margin: 30
    },
    text: {
        flex: 1,
        height: 50
    }
})

const mapStateToProps = (state) => ({
    voicemails: state.voiceMails.current_voicemail.data,
    user: state.auth,
    loading: state.voiceMails.voicemail_loading,
    current_voicemail: state.voiceMails.current_voicemail_thread
})

export default connect(mapStateToProps, { fetchIndividualVoiceMail, addLocalVoiceMail, addVoiceMail })(MessageThread)