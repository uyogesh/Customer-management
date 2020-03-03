import React from 'react'
import {
    View,
    Text,
    Button,
    TextInput,
    StyleSheet
} from 'react-native'

import DatePicker from 'react-datepicker'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Radio from '@material-ui/core/Radio'
import Close from '@material-ui/icons/CloseRounded'
import MenuItem from '@material-ui/core/MenuItem'
import AudioPlayer from '../../../components/audioPlayer/index'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { ReactMic } from 'react-mic'
import { withStyles } from "@material-ui/core/styles"
import { Dropdown } from 'react-native-material-dropdown'
import "react-datepicker/dist/react-datepicker.css"
import color from '../../../styles/color'


const materialStyles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: 18,
        minWidth: 120,
        width: '50%'
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class CreateMessage extends React.Component {

    constructor(props) {
        super(props)
        this.messageTypeSection = this.messageTypeSection.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.onData = this.onData.bind(this)
        this.onStop = this.onStop.bind(this)

    }
    state = {
        openModal: false,
        recordedBlob: null,
        isDefault: false,
        disabled: false,
        date: null,
        time: null,
        message_type: '',
        from: '',
        to: '',
        textMessage: '',
        message_format: 1,
        message_format_choices: [
            {
                value: 'Text'
            },
            {
                value: 'Voice'
            }
        ],
        record: false,
        recordPath: '',
        message_type_data: [
            {
                value: 'Default Message',
            },
            {
                value: 'Weekend Message'
            },
            {
                value: 'Holiday Message'
            },
            {
                value: 'Fixed Time Interval Message'
            }
        ],
        error: null,
    }

    startRecording = () => {
        this.setState({
            record: true,
            recordedBlob: null
        });
    }

    stopRecording = () => {
        this.setState({
            record: false
        });
    }

    onData(recordedBlob) {

        // console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop(recordedBlob) {
        
        this.setState({ recordedBlob })
        console.log('recordedBlob is: ', recordedBlob);
    }

    handlePlay() {

    }
    messageTypeSection() {
        const { message_type } = this.state
        if (message_type === 2) {
            return (
                <View style={{ flex: 1, zIndex: 100, overflow: 'visible', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text>Date</Text>
                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <DatePicker
                            placeholderText="From"
                            dropdownMode="scroll"
                            onChange={(fromDate) => {
                                this.setState({ fromDate })
                            }}
                            selected={this.state.fromDate}
                        />
                        <DatePicker
                            placeholderText="To"
                            dropdownMode="scroll"
                            onChange={(toDate) => {
                                this.setState({ toDate })
                            }}
                            selected={this.state.toDate}
                        />
                    </View>
                </View>
            )
        }
        else if (message_type === 3) {
            return (
                <View style={{ flex: 1, zIndex: 100, paddingLeft: '30%', paddingLeft: '30%', overflow: 'visible', justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white', flexDirection: 'row  ' }}>
                    <View style={{ margin: 10 }}>
                        <Text style={{ margin: 5 }}>From</Text>
                        <TextInput
                            style={{ width: 60, borderRadius: 10, fontSize: 15, borderColor: color.base, borderWidth: 1 }}
                            onChangeText={(text) => {
                                this.setState({ from: text })
                            }}
                            keyboardType="numeric"
                            value={this.state.from}
                        />
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ margin: 5 }}>To</Text>
                        <TextInput
                            style={{ width: 60, borderRadius: 10, fontSize: 15, borderColor: color.base, borderWidth: 1 }}
                            onChangeText={(text) => {
                                this.setState({ to: text })
                            }}
                            keyboardType="numeric"
                            value={this.state.to}
                        />
                    </View>
                </View>
            )
        } else if (message_type === 4) {
            return (
                <View style={{ flex: 1, zIndex: 100, paddingLeft: '30%', paddingLeft: '30%', overflow: 'visible', justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white', flexDirection: 'row  ' }}>
                    <View style={{ margin: 10 }}>
                        <Text style={{ margin: 5 }}>From</Text>
                        <TextInput
                            style={{ width: 60, borderRadius: 10, fontSize: 15, borderColor: color.base, borderWidth: 1 }}
                            onChangeText={(text) => {
                                this.setState({ from: text })
                            }}
                            value={this.state.from}
                        />
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ margin: 5 }}>To</Text>
                        <TextInput
                            style={{ width: 60, borderRadius: 10, fontSize: 15, borderColor: color.base, borderWidth: 1 }}
                            onChangeText={(text) => {
                                this.setState({ to: text })
                            }}
                            value={this.state.to}
                        />
                    </View>
                </View>
            )
        }
        else {
            return null
        }
    }

    render() {
        console.log("The State is:  ",this.state)
        const { classes } = this.props
        return (
            <View style={styles.modalContainer}>
                <View style={{ flex: -1, alignSelf: 'flex-end', marginBottom: -40, marginRight: 20, zIndex: 100 }}>
                    <Close onClick={this.props.onModalClose} style={{ fontSize: 32, color: color.base }} />
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel ref={ref => { this.inputLabel = ref }} htmlFor="outlined-age-simple">
                            Message Assigned To
                            </InputLabel>
                        <Select
                            value={this.state.message_type}
                            error={this.state.error && this.state.message_type === ""}
                            onChange={(event) => {
                                this.setState({
                                    message_type: event.target.value
                                })
                            }}
                            input={<OutlinedInput labelWidth={160} name="Type" id="outlined-age-simple" />}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={0}>Default Message</MenuItem>
                            <MenuItem value={1}>Weekend Message</MenuItem>
                            <MenuItem value={2}>Holiday Message</MenuItem>
                            <MenuItem value={3}>Fix Time interval message</MenuItem>

                        </Select>
                    </FormControl>
                </View>
                {/*{this.messageTypeSection()}*/}

                {/*<View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>*/}


                {/*    <FormControl variant="outlined" className={classes.formControl}>*/}
                {/*        <InputLabel ref={ref => { this.inputLabel = ref }} htmlFor="outlined-age-simple">*/}
                {/*            Type*/}
                {/*            </InputLabel>*/}
                {/*        <Select*/}
                {/*            value={this.state.message_format}*/}
                {/*            onChange={(event) => {*/}
                {/*                this.setState({*/}
                {/*                    message_format: event.target.value*/}
                {/*                })*/}
                {/*            }}*/}
                {/*            input={<OutlinedInput labelWidth={40} name="Type" id="outlined-age-simple" />}*/}
                {/*        >*/}
                {/*            <MenuItem value="">*/}
                {/*                <em>None</em>*/}
                {/*            </MenuItem>*/}
                {/*            <MenuItem value={1}>Text</MenuItem>*/}
                {/*            <MenuItem value={2}>Voice Message</MenuItem>*/}
                {/*        </Select>*/}
                {/*    </FormControl>*/}

                {/*</View>*/}
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start' }}>

                    <Text style={{ margin: 10, fontSize: 20, fontFamily: 'Lato', alignSelf: 'center' }}>Text Message</Text>
                    <textarea
                        numberOfLines={10}
                        style={{ alignSelf: 'center', width: 500 }}
                        onChange={text => {
                            this.setState({ textMessage: text.target.value })
                        }}
                    />
                </View>
                <View style={{ flex: 2, backgroundColor: 'white', paddingLeft: '20%', paddingRight: '20%' }}>
                    <View style={{ flex: 1 }}><Text style={{ margin: 10, fontSize: 20, fontFamily: 'Lato', alignSelf: 'center' }}>Audio Message</Text></View>
                    <View style={{ flex: 1 }}>
                        <ReactMic
                            record={this.state.record}
                            className="sound-wave"
                            mimeType="audio/mpeg"
                            onStop={this.onStop.bind(this)}
                            onData={this.onData.bind(this)}
                            strokeColor="#000000"
                            backgroundColor={color.base} />

                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                        <button onClick={this.startRecording.bind(this)} type="button" style={{ flex: 1, fontSize: 15, fontFamily: 'Lato', flexDirection: 'row', padding: 5 }}>Start &#127908;</button>
                        <button onClick={this.stopRecording.bind(this)} type="button" style={{ flex: 1, fontSize: 15, fontFamily: 'Lato', padding: 5 }}>Stop &#9632;</button>
                    </View>
                    {this.state.recordedBlob ? <View><AudioPlayer audio={this.state.recordedBlob.blobURL} /></View> : null}

                </View>

                {/* <View style={{ flex: -1, flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    style={{ flex: 1, marginLeft: 10 }}
                    <input type="checkbox" onChange={() => {
                        console.log(this.state.isDefault)
                        this.setState({ isDefault: !this.state.isDefault })
                    }}
                        style={{ margin: 5 }}
                    />
                    <Text>Is Default Message.</Text>
                </View> */}
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        title="Submit"
                        disabled={this.startRecording.disabled}
                        onPress={() => {

                            if (this.state.message_type === "" || (!this.state.date && !this.state.from && !this.state.to)) {
                                this.setState({ error: true })
                                return
                            }
                            this.setState({ disabled: true })

                            this.props.onCreate(this.state)
                        }}
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginTop: '5%',
        marginLeft: 50,
        margingRight: 50,
        paddingLeft: '30%',
        paddingRight: '30%',
    }
})

export default withStyles(materialStyles)(CreateMessage)
