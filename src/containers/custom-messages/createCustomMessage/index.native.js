import React from 'react'
import {
    View,
    Text,
    Button,
    TextInput,
    TouchableWithoutFeedback,
    Picker,
    PermissionsAndroid,
    StyleSheet
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import SoundRecorder from 'react-native-sound-recorder'
import SoundPlayer from 'react-native-sound-player'
import { Dropdown } from 'react-native-material-dropdown'
import RadioForm, { RadioButtonInput, RadioButtonLabel, RadioButton } from 'react-native-simple-radio-button'
import Icon from 'react-native-vector-icons/Entypo'
import color from '../../../styles/color'


export default class CreateMessage extends React.Component {

    constructor(props) {
        super(props)
        this.messageTypeSection = this.messageTypeSection.bind(this)
        this.getInfo = this.getInfo.bind(this)
    }
    state = {
        openModal: false,
        date: null,
        message_type: 'Sunday Message',
        from: '',
        to: '',
        textMessage: '',
        message_format: 'Text',
        message_format_choices: [
            {
                value: 'Text'
            },
            {
                value: 'Voice'
            }
        ],
        recordStart: false,
        recordPath: '',
        message_type_data: [
            {
                value: 'Sunday Message',
            },
            {
                value: 'Holiday Message'
            },
            {
                value: 'Time Interval Message'
            },
            {
                value: 'Sunday Message'
            }
        ]
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Text style={{ color: 'black', fontSize: 18 }}>Create Custom Messages</Text>,
        headerTitleStyle: {
            flex: 1,
            color: 'black',
            fontSize: 18
        },
        headerLeft: <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            navigation.goBack()
        }}>
            <Icon name="chevron-thin-left" size={20} color={color.base} />
        </TouchableWithoutFeedback>,
    })


    messageTypeSection() {
        const { message_type } = this.state
        if (message_type === "Holiday Message") {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text>Date</Text>
                    <DatePicker androidMode="calendar" onDateChange={(date) => {
                        this.setState({ date })
                    }}
                        date={this.state.date}
                    />
                </View>
            )
        }
        else if (message_type === "Time Interval Message") {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flexDirection: 'row' }}>
                    <View>
                        <Text>From</Text>
                        <TextInput
                            style={{ width: 60 }}
                            onChangeText={(text) => {
                                this.setState({ from: text })
                            }}
                            value={this.state.from}
                        />
                    </View>
                    <View>
                        <Text>To</Text>
                        <TextInput
                            style={{ width: 60 }}
                            onChangeText={(text) => {
                                this.setState({ to: text })
                            }}
                            value={this.state.to}
                        />
                    </View>
                </View>
            )
        } else if (message_type === "Sunday Message") {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flexDirection: 'row' }}>
                    <Text>Date</Text>
                    <DatePicker androidMode="calendar" onDateChange={(date) => {
                        this.setState({ date })
                    }}
                        date={this.state.date}
                    />
                </View>
            )
        }
        else {
            return null
        }
    }

    async getInfo() {
        try {
            const info = await SoundPlayer.getInfo()
            console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
            const progress = (info.currentTime + 0.1) / (info.duration + 0.1)
            this.setState({ progress })
        } catch (e) {
            console.log('There is no song playing', e)
        }
    }

    render() {
        return (
            <View style={styles.modalContainer}>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white' }}>
                    <View style={{ flex: 1 }}>
                        <Icon name="price-tag" size={24} color={color.base} />
                    </View>
                    <View style={{ flex: 4 }}>
                        <Dropdown 
                            data={this.state.message_type_data}
                            value={this.state.message_type}
                            label="Message Assignment"
                            animationDuration={0}
                            onChangeText={value=>{
                                this.setState({
                                    message_type: value
                                })
                            }}
                        />
                    </View>
                </View>
                    {this.messageTypeSection()}
                
                <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Icon name="modern-mic" size={24} color={color.base} />
                    </View>
                    <View style={{ flex: 4 }}>
                        <Dropdown
                            data={this.state.message_format_choices}
                            label="Message Type"
                            value={this.state.message_format}
                            onChangeText={value => {
                                this.setState({message_format: value})
                            }}
                        />
                    </View>
                </View>
                {this.state.message_format === "Text" ?
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text>Text Message</Text>
                        <TextInput onTextChane={text => {
                            this.setState({ textMessage: text })
                        }} />
                    </View> :
                    <View style={{ flex: 1, backgroundColor: 'white' }}>

                        <Text>Audio</Text>
                        <View>
                            <Button
                                disabled={this.state.recordStart}
                                onPress={async () => {
                                    const granted = await PermissionsAndroid.request(
                                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
                                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                        console.log(SoundRecorder.PATH_DOCUMENT)
                                        SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + "/" + new Date().getTime() + '.mp3')
                                        this.setState({ recordStart: true })
                                    } else {
                                        console.log("Location permission denied")
                                    }
                                }} title="Record" />
                            <Button disabled={!this.state.recordStart} onPress={() => {
                                SoundRecorder.stop().then(result => {
                                    console.log(result)
                                    this.setState({ recordStart: false })
                                    this.setState({ recordPath: result.path })
                                })
                                console.log("Record stopped")
                            }} title="Stop" />
                            <Button onPress={async () => {
                                console.log(this.state.recordPath)
                                SoundPlayer.playUrl(this.state.recordPath, 'mp3')
                                this.getInfo()
                            }} title="Listen" />
                        </View>
                    </View>
                }
                <Button title="Submit" onPress={()=>{
                    console.log(this.state)
                    // if(this.state.message_type===""){
                    //     this.setState({error: true})
                    //     return 
                    // }
                    // this.setState({disabled: true})
                    
                    // this.props.onCreate(this.state)
                }}/>
            </View>
        )
    }

    componentWillUnmount() {
        SoundPlayer.stop()
    }
}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        width: '100%',
        paddingLeft: 50,
        paddingRight: 50
    }
})