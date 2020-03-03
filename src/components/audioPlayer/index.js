import React from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform,
    StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import SoundPlayer from 'react-native-sound-player'
import color from '../../styles/color';

export default class AudioPlayer extends React.Component {

    constructor(props){
        super(props)
        this.playAudio = this.playAudio.bind(this)
        // this.playAudio = this.
    }

    state = {
        loaded: false,
        playing: false,
        progress: 0
    }

    _onFinishedPlayingSubscription = null
    _onFinishedLoadingSubscription = null
    _onFinishedLoadingFileSubscription = null
    _onFinishedLoadingURLSubscription = null

    componentDidMount() {
        _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            this.setState({playing: false, progress: 0})
            console.log('finished playing', success)
        })
        _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            console.log('finished loading', success)
        })
        _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
            console.log('finished loading file', success, name, type)
        })
        _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
            this.setState({loaded: true})
            console.log('finished loading url', success, url)
        })
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

    playAudio(url) {
        try {
            if (!this.state.loaded) {
                SoundPlayer.playUrl(url)
                this.getInfo()
            } else {
                SoundPlayer.resume()
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    pauseAudio() {
        SoundPlayer.pause()
    }

    render() {
        const { audio } = this.props
        const {playing} =this.state
        console.log(audio)
        if(playing)
        this.getInfo()
        return (
            <View style={styles.container}>
                <View style={styles.play}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (!playing) {
                            this.playAudio(audio)
                        } else {
                            this.pauseAudio()
                        }
                        this.setState({
                            playing: !playing
                        })
                        
                    }}
                    style={{backgroundColor: 'red', padding:15}}
                    >
                        <Icon name={!playing ? "controller-play" : "controller-paus"} style={{color: color.base}} size={32} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.seekBar}>
                    {
                        Platform.select({
                            android: <ProgressBarAndroid styleAttr="Horizontal" progress={this.state.progress} indeterminate={false} style={{width: '100%'}} />,
                            ios: <ProgressViewIOS progress={this.state.progress} style={{width: '90%'}}/>
                        })
                    }
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        _onFinishedPlayingSubscription.remove()
        _onFinishedLoadingSubscription.remove()
        _onFinishedLoadingURLSubscription.remove()
        _onFinishedLoadingFileSubscription.remove()
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    play: {
        flex:0,
        minWidth: 20
    },
    seekBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        marginLeft: 10,
        width: '100%'
    }
})

AudioPlayer.defaultProps = {
    audio: 'https://www.pacdv.com/sounds/people_sound_effects/baby-babble-1.mp3'
}