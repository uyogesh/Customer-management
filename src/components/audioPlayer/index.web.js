import React from 'react'
import {
    View,
    TouchableOpacity,
    ProgressBarAndroid,
    StyleSheet
} from 'react-native'
import Play from '@material-ui/icons/PlayCircleFilled'
import Pause from '@material-ui/icons/PauseCircleFilled'
import LinearProgress from 'react-progressbar'
import AudioRecorder from 'react-audio-recorder'
import color from '../../styles/color'

export default class AudioPlayer extends React.Component {

    constructor(props){
        super(props)
        this.audio = new Audio(props.audio)

    }

    state = {
        loaded: false,
        playing: false,
        progress: 0
    }

    _onFinishedPlayingSubscription = null

    playAudio(){
        
        this.audio.play()
    }

    pauseAudio(){
        this.audio.pause()
    }

    componentDidMount(){
        this._onFinishedPlayingSubscription = this.audio.addEventListener('ended', (event) => {
            this.setState({playing: false, progress: 0})
            console.log('finished playing', event)
        })
        // this.setState({})
        this.audio.addEventListener('timeupdate', (event) => {
            console.log(event)
            const progress = (this.audio.currentTime+0.01)/(this.audio.duration+0.01)
            this.setState({progress})
        })
        
    }

    componentWillUnmount(){
        this.audio.removeEventListener('timeupdate', ()=>{})
        this.audio.removeEventListener('ended',  ()=>{})
        this.audio.pause()
        this.audio.currentTime=0
    }

    render() {
        const {loaded,playing, progress} = this.state
        console.log('Progress', progress)
        return (
            <View style={styles.container}>
                <View style={styles.play}>
                    <TouchableOpacity onPress={() => {
                        if (!playing) {
                            this.playAudio()
                        } else {
                            this.pauseAudio()
                        }
                        this.setState({
                            playing: !playing
                        })

                    }}
                    >
                        {!playing? <Play color={color.base}/>: <Pause color={color.base}/>}
                    </TouchableOpacity>
                </View>
                <View style={styles.seekBar}>
                <LinearProgress completed={progress*100} style={{width: '100%'}}  />
                    {/* <ProgressBarAndroid styleAttr="Horizontal" progress={progress} indeterminate={false} style={{ width: '100%' }} /> */}
                </View>
            </View>
        )
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
        width: '100%'
    }
})

AudioPlayer.defaultProps = {
    audio: 'https://www.pacdv.com/sounds/people_sound_effects/baby-babble-1.mp3'
}