import React from 'react'
import {
    View,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import VoiceMailThread from './createVoiceMail/index'
import { fetchVoiceMails, fetchIndividualVoiceMail } from '../../actions/voicemailActions'
import {TYPE_SELECT_CURRENT_VOICEMAIL} from '../../actions/actionTypes'
import VoiceMailRow from '../../components/voiceMailRow'
// import CreateVoiceMail from './createVoiceMail/index'
import NavBar from '../../components/navBarWeb'
import Drawer from '../../components/drawer'
import color from '../../styles/color'

class VoiceMail extends React.Component {
    constructor(props){
        super(props)
        this.onContactSelected = this.onContactSelected.bind(this)
    }
    state = {
        open: false,
        openModal: false,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    }

    onContactSelected(contact) {
        console.log("From VoiceMails: ",this.props)
        this.props.addVoiceMailUser(contact)
        this.props.fetchIndividualVoiceMail(contact)
    }

    componentDidMount() {
        Dimensions.addEventListener('change', (window, screen) => {
            this.setState({
                height: window.window.height,
                width: window.window.width
            })
        })
        this.props.fetchVoiceMails()
    }

    onCreate() {
        console.log('Clicked')
    }

    render() {
        const { voiceMails, loading, user, voicemail_empty } = this.props
        const { height, width, openModal } = this.state
        console.log("From render: ",this.props)
        return (
            <View style={[styles.container, { height, width }]}>
                <NavBar title="Messages" onClickHandler={
                    () => {
                        this.setState({ open: true })
                    }
                }
                showSearch={false}
                handleSearch={()=>{}}
                    leftOption=""
                    onLeftButtonClick={() => {
                        
                    }}
                />
                <Drawer open={this.state.open} onClose={() => {
                    this.setState({ open: false })
                }}
                    user={user}
                    navigate={(path) => {
                        this.props.history.push(path)
                    }} />

                {loading ?
                    <ActivityIndicator color={color.base} size={20} /> :
                    (voicemail_empty?<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No VoiceMail To Show</Text></View>:
                    <View style={{ flexDirection: 'row', flex: 1, height: this.state.height, overflow: 'hidden', width: this.state.width }}>
                        <View style={{ flex: 1, flexDirection: 'column', borderRightWidth: 1, borderRightColor: '#DDD' }}>
                            <View style={styles.bannerHolder}>
                                <Text style={styles.banner}>Voice Mails</Text>
                            </View>
                            <View style={{ flex: 7 }}>
                                <FlatList
                                    style={{ flex: 1, width: '100%' }}
                                    data={voiceMails}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <VoiceMailRow contact={item} onContactSelected={this.onContactSelected} />
                                        )
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'baseline' }}>
                            <View style={{ flex: 1, width: '100%', borderBottomColor: '#BBB', borderBottomWidth: 1 }}>
                                {/* <MessageBanner photo={current_user.photo} full_name={current_user.full_name} phone_number={current_user.phone_number} /> */}
                            </View>
                            <View style={{ flex: 7, width: '100%' }}>
                                <VoiceMailThread
                                />
                            </View>
                        </View>
                    </View>)
                }
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 65,
    },
    banner: {
        fontWeight: 'bold',
        fontSize: 32,
        alignSelf: 'center'
    },
    bannerHolder: {
        flex: 1,
        justifyContent: 'center',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        // padding: 20
    }
})

const mapStateToProps = (state) => ({
    voiceMails: state.voiceMails.voicemails.data,
    loading: state.voiceMails.loading,
    user: state.auth,
    voicemail_empty: state.voiceMails.voicemail_empty,
})

const mapDispatchToProps = (dispatch, getState) => ({
    fetchVoiceMails: () => dispatch(fetchVoiceMails()),
    addVoiceMailUser: (thread) => dispatch({type:TYPE_SELECT_CURRENT_VOICEMAIL, payload: thread}),
    fetchIndividualVoiceMail: (thread) => dispatch(fetchIndividualVoiceMail(thread))
})
export default connect(mapStateToProps, mapDispatchToProps)(VoiceMail)
