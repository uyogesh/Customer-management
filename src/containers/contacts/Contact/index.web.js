import React from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    Animated,
    TouchableOpacity,
    Button,
    StyleSheet,
    Dimensions,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import { filter } from 'ramda'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import Modal from '@material-ui/core/Modal'
import Note from '../../../components/NoteCards'
import Tag from '../../../components/TagAssign'
import TagInput from '../../../components/tagInput/a'
import Navbar from '../../../components/navBarWeb'
import Cross from '@material-ui/icons/CloseOutlined'
import MessageBanner from '../../../components/messageBanner'
import MessageThread from '../../messages/messageThread/index.web'
import Drawer from '../../../components/drawer'
import MessageApi from '../../../Utils/messageAPI'
import EditContact from '../../../components/editContact'
import { BASE_URL } from '../../../Utils/urls'
import { fetchIndividualContact, clearIndividualContact } from '../../../actions/contactsActions'
import { fetchNotes, addNote, removeNoteById, setContactLoading } from '../../../actions/notesAction'
import { fetchTags, ejectTag } from '../../../actions/tagsAction'
import { loadingEnabled, selectCurrentlyChattingContact, fetchChat } from '../../../actions/messageActions'
import color from '../../../styles/color'

const dim = Dimensions.get('window')
class Contact extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            note: '',
            disabled: true,
            id: 0,
            openDrawer: false,
            openModal: false,
            showMessage: false,
            animValue: new Animated.Value(0),
            height: dim.height,
            width: dim.width,
        }
    }
    onEditContact() {
        this.setState({ openModal: true })
    }

    closeModal() {
        this.setState({ openModal: false })
    }

    onMessageSelected() {
        this.props.history.go('message', {})
    }
    onMessageClicked(contact) {
        this.props.selectCurrentlyChattingContact(contact)
        const type = contact.contact_id ? "contact_id" : "phone_number"
        const contactId_or_number = contact.contact_id || contact.phone_no
        this.props.fetchChat(contactId_or_number)
        this.setState({ showMessage: true }, () => {
            console.log("Inside animation")
            Animated.spring(this.state.animValue, {
                toValue: 1,
            }).start()
        })
    }

    navigate(path, params = '') {
        this.props.history.push("/" + path)
    }

    onRemoveNote(id) {
        this.props.setContactLoading()
        this.props.removeNoteById(id, this.props.match.params.id)
    }

    onRemoveTag(tag) {
        this.props.setContactLoading()
        this.props.ejectTag(this.props.location.state.contact.id, tag)
    }

    componentDidMount() {
        const { id } = this.props.match.params
        this.props.fetchIndividualContact(id)
        this.props.fetchNotes(id)
        this.props.fetchTags()
        Dimensions.addEventListener('change', (window, screen) => {
            this.setState({
                height: window.window.height,
                width: window.window.width
            })
        })
        // MessageApi()
    }

    componentWillUnmount() {

        this.props.clearIndividualContact()
    }

    render() {
        const { note, height, width } = this.state
        const { addNote, contact_notes, setContactLoading, loading } = this.props
        const { full_name, phone_no, notes, id, photo } = this.props.contact
        const tag = full_name.split('')[0].toUpperCase()

        return (
            <View style={[styles.container, { height: height, width: width }]} >
                <Navbar onClickHandler={() => {
                    this.setState({ openDrawer: !this.state.openDrawer })
                }}
                    leftOption="Edit Contact"
                    showSearch={false}
                    onLeftButtonClick={this.onEditContact.bind(this)}
                />
                <Drawer
                    open={this.state.openDrawer}
                    navigate={this.navigate.bind(this)}
                    onClose={() => {
                        this.setState({ openDrawer: false })
                    }}
                    user={this.props.user}
                />
                <Modal open={this.state.openModal} onClose={this.closeModal.bind(this)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <EditContact onClose={this.closeModal.bind(this)} contact={this.props.contact} />
                    </View>
                </Modal>

                {loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary, minHeight: dim.height }}>
                        <ActivityIndicator
                            color={color.orange}
                            size={50}
                        />
                    </View> :
                    <View style={[styles.container, { height: height, width: width }]}>
                        <View style={styles.left}>
                            <View style={styles.name}>
                                <View style={{ borderRadius: 200, width: 200, height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: color.base, overflow: 'hidden' }}>
                                    {
                                        photo ?
                                            <Image
                                                source={{ uri: BASE_URL + photo }}
                                                width={200}
                                                height={200}
                                                style={{ width: 200, height: 200, zIndex: 100 }}
                                            /> :
                                            <Text style={styles.thumb}>
                                                {tag}
                                            </Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <View style={styles.upperView}>
                                    <View style={styles.textHolder} >
                                        <Text style={[styles.nameText, { fontWeight: 'bold', fontSize: 32, color: color.base }]}>
                                            {full_name}
                                        </Text>
                                    </View>
                                    <View style={styles.mobile}>
                                        <Icon name="sticky-note" size={50} color={color.black} />
                                        <Text style={[styles.nameText, { alignSelf: 'center' }]}>
                                            Mobile
                            </Text>
                                        <Text style={[styles.nameText, { fontSize: 20, fontWeight: 'bold', marginTop: 5, color: 'grey' }]}>
                                            {phone_no.startsWith("+1") ? phone_no : "+1"+phone_no}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.lowerView}>
                                    <View style={styles.underline}>
                                        <TouchableOpacity onPress={() => {
                                            this.onMessageClicked(this.props.contact)
                                        }}>
                                            <Text style={styles.nameText}>
                                                Send Message
                                    </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={styles.underline}>
                                        <Text style={styles.nameText}>
                                            Share Contact
                            </Text>
                                    </View>
                                    <View style={styles.underline}>
                                        <Text style={styles.nameText}>
                                            Add to Favourites
                            </Text>
                                    </View> */}
                                </View>
                            </View>
                        </View>
                        <View style={styles.right}>
                            {this.state.showMessage ?
                                <Animated.View style={{
                                    justifyContent: 'center', alignItems: 'baseline', height: '80%', marginTop: 60, transform: [
                                        {
                                            translateX: this.state.animValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-1000, 0]
                                            })
                                        }
                                    ]
                                }}>
                                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => {
                                        this.setState({
                                            showMessage: false
                                        })
                                    }}><Cross /></TouchableOpacity>
                                    {/* <MessageBanner photo={contact[0].photo} full_name={contact[0].full_name} phone_number={contact[0].phone_no} /> */}
                                    <MessageThread
                                    />
                                </Animated.View>
                                : <View style={[styles.underline, {flexDirection: 'column', marginTop: 70, marginBottom: 20}]}>
                                    <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-around', maxWidth: 300  }}>
                                        <Text style={[styles.nameText]}>
                                            Notes
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextInput value={this.state.note} onChangeText={(e) => {
                                                this.setState({
                                                    note: e
                                                })
                                            }}
                                                style={{
                                                    backgroundColor: 'white'
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.charCode === 13) {
                                                        this.buttonRef.click()
                                                    }

                                                }}
                                            />
                                            <button disabled={this.state.note === ""} title="Add" onClick={() => {
                                                setContactLoading()
                                                addNote(id, note)
                                                this.setState({ note: '' })
                                            }}
                                                ref={ref => this.buttonRef = ref}
                                            >Add</button>
                                        </View>
                                        <View style={{ flex: 2, flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
                                            <FlatList
                                                data={contact_notes}
                                                renderItem={({ item }) => (
                                                    <Note note={item} onRemove={this.onRemoveNote.bind(this)} />
                                                )}
                                                style={{ flex: 1, height: '150%' }}
                                                onContentSizeChange={() => this.flatList.scrollToOffset({ offset: 0, animated: true })}
                                                ref={ref => this.flatList = ref}
                                                // initialScrollIndex={chats.length - 1}
                                                onLayout={() => this.flatList.scrollToOffset({ offset: 0, animated: true })}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        {loading === "pending" ? <ActivityIndicator color={color.base} size={30} /> : null}
                                    </View>
                                    {/* <Tag submitTags={() => { }} contact={this.props.contact} /> */}
                                    <TagInput contact={this.props.contact}/>
                                </View>
                            }
                        </View>
                    </View>}
                <link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet"></link>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'purple',
        height: Dimensions.get('window').height
    },
    left: {
        flex: 3,
        paddingTop: 20,
        flexDirection: 'column',
        borderRightWidth: 2,
        borderRightColor: '#DDD',
        zIndex: -100
    },
    right: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -100
    },
    name: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // width: Dimensions.get('window').width - 50,
        flexWrap: 'wrap',
        // height: 180
    },
    thumb: {
        fontSize: 120,
        fontWeight: 'bold',
        color: '#FFF'
    },
    nameText: {
        fontSize: 20,
        // paddingStart: 10,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Lato'
    },
    underline: {
        borderBottomWidth: 2,
        borderBottomColor: '#E6E7E8',
        flex: 1,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        flex: 2,
        // top: 50,
        // width: Dimensions.get('window').width - 100,
        flexDirection: 'column',
        // backgroundColor: 'blue'
    },
    upperView: {
        flexDirection: 'column',
        justifyContent: 'center',
        // backgroundColor:'red'
    },
    lowerView: {
        flex: 1,
        // backgroundColor: 'black',
        paddingTop: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHolder: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'center'
    },
    thumbnail: {
        fontSize: 26,
        // fontWeight:'bold',
        fontFamily: 'Lato-Regular',
        alignSelf: 'center',
        color: color.base
    },
    circularImageHolder: {
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,

    },
    textHold: {
        flexDirection: 'column',
        justifyContent: 'center',
        // paddingStart: 20
    },
    text: {
        fontSize: 20,
        color: "#000",
        // fontWeight:'bold',
        fontFamily: 'Lato-Regular'
    },
    miniText: {
        fontFamily: 'Lato-Regular',
        color: "#777",
        fontSize: 10
    },
    mobile: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        // paddingStart: 10
    },
    tagView: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    overlay: {
        flex: 1,
        height: Dimensions.get('window').height,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    }

})


const mapStateToProps = (state) => ({
    contacts: state.contacts.list.data,
    contact_notes: state.contacts.notes,
    loading: state.contacts.contactLoading,
    user: state.auth,
    contact: state.contacts.contact
})


export default connect(mapStateToProps, { fetchNotes, addNote, removeNoteById, setContactLoading, loadingEnabled, selectCurrentlyChattingContact, fetchChat, fetchTags, fetchIndividualContact, clearIndividualContact })(Contact)
