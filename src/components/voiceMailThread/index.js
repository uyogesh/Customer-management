import React from 'react'
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native'
import AudioPlayer from '../audioPlayer/index'
import color from '../../styles/color';
import { BASE_URL } from '../../Utils/urls'
const dim = Dimensions.get('window')

export default class VoiceMailThread extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),
        loaded: false
    }

    componentDidMount() {
        if (this.props.is_last) {

        }
        else {
            Animated.timing(this.state.fadeAnim, {
                useNativeDriver: true,
                toValue: 1,
                duration: 1000
            }).start()
        }
    }

    render() {
        const { fadeAnim, loaded } = this.state
        const { message, user } = this.props
        let audio_link
        if(message.local){
             audio_link = message.binary_message_file
             console.log("Inside Audio: ", audio_link)
        }else{
            audio_link = BASE_URL+message.voice_message_file||BASE_URL+message.binary_message_file
        }
        const boxStyle = !(message.receive_or_sent === "sent") ? { backgroundColor: "#87189d", alignSelf: 'flex-start' } : { backgroundColor: '#D4AAE2', alignSelf: 'flex-end' }
        return (
            <Animated.View style={[styles.animView, boxStyle]}>
                <AudioPlayer audio={audio_link}/>
                <Text style={{alignSelf: 'flex-end', color: 'white'}}>{message.created_at}</Text>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    animView: {
        minWidth: dim.width / 2 + 100,
        height: 'auto',
        borderRadius: 20,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        fontFamily: 'Lato-Regular Lato',
        color: '#000'
    }
})