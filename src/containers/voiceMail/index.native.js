import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Dimensions,
    StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import VoiceMailRow from '../../components/voiceMailRow'
import { fetchVoiceMails, fetchIndividualVoiceMail } from '../../actions/voicemailActions'
import {TYPE_SELECT_CURRENT_VOICEMAIL} from '../../actions/actionTypes'
import color from '../../styles/color'

class VoiceMail extends React.Component {
    constructor(props){
        super(props)
        this.onContactSelected = this.onContactSelected.bind(this)
    }

    static navigationOptions = ({navigation})=>({
        title: 'VoiceMail',
        headerLeft: () =>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 20 }}
            >
                <Icon name="navicon" size={30} color="#9900E0" />
            </TouchableOpacity>,
    })

    
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
        this.props.navigation.push('voicemailThread')
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

    
    render(){
        const { voiceMails, loading, user } = this.props
        const { height, width, openModal } = this.state
        return (
            <View style={styles.container}>
                {loading ?
                    <ActivityIndicator color={color.base} size={20} /> :
                    <View style={{ flexDirection: 'row', flex: 1, height: this.state.height, overflow: 'hidden', width: this.state.width }}>
                        <View style={{ flex: 1, flexDirection: 'column', borderRightWidth: 1, borderRightColor: '#DDD' }}>
                            <View style={{ flex: 1 }}>
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
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
})

const mapDispatchToProps = (dispatch, getState) => ({
    fetchVoiceMails: () => dispatch(fetchVoiceMails()),
    addVoiceMailUser: (thread) => dispatch({type:TYPE_SELECT_CURRENT_VOICEMAIL, payload: thread}),
    fetchIndividualVoiceMail: (thread) => dispatch(fetchIndividualVoiceMail(thread))
})
export default connect(mapStateToProps, mapDispatchToProps)(VoiceMail)