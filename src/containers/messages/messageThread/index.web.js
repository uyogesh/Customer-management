import React from 'react'
import {
    View,
    FlatList,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import { isEmpty } from 'ramda'
import Attach from '@material-ui/icons/AttachFile'
import Send from '@material-ui/icons/Send'
import Close from '@material-ui/icons/CloseRounded'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import { fetchChat, sendChatMessageLocal, sendChatMessage, fetchAdditionalChat } from '../../../actions/messageActions'
import Chat from '../../../components/chatThread'
import color, { colorwAlpha } from '../../../styles/color'


const styled = {
    text: {
        width: '90%'
    },
    icon: {
        width: '20px'
    },
    attah: {
        color: color.base
    }
}



class MessageThread extends React.Component {

    constructor(props) {
        super(props)
        this.renderPicture = this.renderPicture.bind(this)
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
        flatRef: null
    }
    renderPicture() {
        return (
            <View style={{ maxHeight: '30%', width: '100%', alignItems: 'flex-end', backgroundColor: colorwAlpha(color.base, 0.05), borderRadius: 20 }}>
                <View style={{ flex: 0, margin: 10 }}>
                    <Close style={{ alignSelf: 'flex-end', marginBottom: -10, zIndex: 100, color: 'white', fontWeight: 'bold', fontSize: 25, backgroundColor: colorwAlpha(color.base, 1), borderRadius: 25 }}
                        onClick={() => {
                            this.setState({ photo: null, photoLink: null })
                            this.uploadRef.value = ""
                        }}
                    />
                    <img src={this.state.photoLink} height={200} />
                </View>
            </View>
        )
    }

    render() {
        const { loading, user, classes } = this.props
        return (
            <View style={[{ flex: 1, paddingBottom: 50, paddingLeft: 50, paddingRight: 70, width: '100%', top: 60 }, this.props.backgroundColor]}>
                {loading ?
                    <ActivityIndicator color={color.base} size={20} /> :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                            {!isEmpty(this.props.chats.data) ?
                                <FlatList
                                    data={this.props.chats.data}
                                    inverted
                                    renderItem={({ item }) => {
                                        return (
                                            <Chat message={item} user={user} />
                                        )
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    // onContentSizeChange={() => this.flatList.scrollToIndex({index:0 ,animated: true })}
                                    ref={ref => this.flatList = ref}
                                    initialScrollIndex={0}
                                    style={{ height: '60%' }}
                                    onEndReachedThreshold={0.9}
                                    onEndReached={(e) => {
                                        if (!(this.props.chats.links.next === null)) {
                                            this.props.fetchAdditionalChat()
                                        }

                                    }}
                                // onLayout={() => this.flatList.scrollToIndex({index:0,animated: true })}
                                />
                                : null}
                        </View>
                        {this.state.photo ? this.renderPicture() : null}

                        { (this.props.chats.length !== 0) ?
                        <View style={styles.bottomTextInput}>
                            <TextField
                                onKeyDown={(event => {
                                    if (event.keyCode === 13) {
                                        this.buttonRef.click()
                                    }
                                })}
                                value={this.state.message}
                                disabled={this.state.photo}
                                onChange={(e) => {
                                    this.setState({ message: e.target.value })
                                }}
                                className={this.props.classes.text}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                                <input type="file" hidden ref={(ref) => this.uploadRef = ref}

                                    onChangeCapture={(event) => {
                                        if (event.target.files[0]) {
                                            this.setState({ photo: event.target.files[0] })
                                            this.setState({ photoLink: URL.createObjectURL(event.target.files[0]) })
                                        }

                                    }}
                                />
                                <button

                                    // ref={(ref) => this.buttonRef = ref}
                                    // disabled={this.state.message === ''}
                                    style={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
                                    onClick={() => {
                                        this.uploadRef.click()
                                        // this.setState({ message: '' })
                                    }}>

                                    <Attach className={classes.attach} />
                                </button>
                                <button
                                    ref={(ref) => this.buttonRef = ref}
                                    disabled={!this.state.photo && this.state.message === ''}
                                    style={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
                                    onClick={() => {

                                        const newMessage = this.state.photo ?
                                            {
                                                file: this.state.photoLink,
                                                receive_or_sent: "sent",
                                                created_at: moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),
                                                sender_info: {

                                                }
                                            } : {
                                                message: this.state.message,
                                                receive_or_sent: "sent",
                                                created_at: moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString(),
                                                sender_info: {

                                                }
                                            }

                                        this.props.sendChatMessage({ message: this.state.message, file: this.state.photo })
                                        this.props.sendChatMessageLocal(newMessage)
                                        this.setState({ message: '', photo: null, photoLink: null })
                                    }}>

                                    <Send color={this.state.message === '' ? color.base : 'grey'} />
                                </button>
                            </View>
                        </View> : null }
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
    chats: state.messages.current_chats,
    user: state.auth,
    loading: state.messages.chats_loading
})

const stylesComponent = withStyles(styled)(MessageThread)
export default connect(mapStateToProps, { fetchChat, sendChatMessageLocal, sendChatMessage, fetchAdditionalChat })(stylesComponent)