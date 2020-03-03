import React from 'react'
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native'
import color from '../../styles/color';
import { BASE_URL } from '../../Utils/urls'
const dim = Dimensions.get('window')

export default class ChatThread extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),
        loaded: false
    }

    renderPictureComp(file) {
        console.log("From Chat File: ", file)
        if (file.split(':')[0] === 'blob') {
            return (
                <img src={file} style={{width:'300px'}} />
            )
        } else {
            return (
                <img src={BASE_URL + file} style={{width:'300px'}} />
            )
        }
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
        const boxStyle = message.phone_number === user.phone_no ? { backgroundColor: "#87189d", alignSelf: 'flex-start' } : { backgroundColor: '#D4AAE2', alignSelf: 'flex-end' }
        const textStyle = message.phone_number === user.phone_no ? { color: '#FFF' } : { color: '#000' }
        return (
            <Animated.View style={[styles.animView, boxStyle]}>
                {message.message ?
                    <View>
                        <Text style={[styles.text, textStyle]}>
                            {message.message}
                        </Text>
                        <Text>
                            {message.created_at}
                        </Text>
                    </View>:
                    this.renderPictureComp(message.file)
                }
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    animView: {
        maxWidth: dim.width / 2 + 100,
        height: 'auto',
        borderRadius: 20,
        padding: 10,
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
