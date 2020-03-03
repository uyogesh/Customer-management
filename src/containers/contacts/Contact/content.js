import React from 'react'
import {
    View,
    Text,
    TextInput,
    FlatList,
    Button,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Linking,
    TouchableWithoutFeedback,
    Dimensions,
    StyleSheet,
} from 'react-native'
import Share from 'react-native-share'
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native'
import { connect } from 'react-redux'
import { fetchNotes, addNote, removeNoteById, setContactLoading } from '../../../actions/notesAction'
import { BASE_URL } from '../../../Utils/urls'
import color from '../../../styles/color'
import { Left, Up, Down } from '../../../components/Icons/icon'
import NoteCards from '../../../components/NoteCards'
// onView 0:Main, 1:Notes, 2:Tags, 3:loading

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            onView: 0,
            selection: [0, 1],
            notesCollapsed: true,
            note: '',
            activeSections: []
        }

        this.renderMainView = this.renderMainView.bind(this)
        this.onRemoveNote = this.onRemoveNote.bind(this)
        this.renderNotes = this.renderNotes.bind(this)
        this.renderItems = this.renderItems.bind(this)
    }

    rows = [
        {
            id: 1,
            title: 'Mobile',
            content: null
        },
        {
            id: 2,
            title: 'Send Message',
            content: null
        },
        {
            id: 3,
            title: 'Notes',
            content: null

        },
        {
            id: 4,
            title: 'Tags',
            content: null
        },
        {
            id: 5,
            title: 'Share Contact',
            content: null
        },
    ]

    onRemoveNote(id) {
        console.log('On Remove clicked')
        this.props.setContactLoading()
        this.props.removeNoteById(id, this.props.location.state.contact.id)
    }

    componentDidMount() {
        this.props.fetchNotes(this.props.contact.id)
    }

    renderNotes() {
        const { loading, contact_notes, setContactLoading, addNote } = this.props
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                {loading === "pending" ?
                    <ActivityIndicator /> :
                    <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                value={this.state.note}
                                onChangeText={(e) => {
                                    this.setState({
                                        note: e
                                    })
                                }}
                                style={{
                                    backgroundColor: 'white',
                                    width: '60%'
                                }}
                            />
                            <Button disabled={this.state.note === ""} title="Add" onPress={() => {
                                setContactLoading()
                                addNote(this.props.contact.id, this.state.note)
                                this.setState({ note: '' })
                            }} />
                        </View>
                        <FlatList
                            data={contact_notes}
                            style={{ flex: 1, width: '100%' }}
                            renderItem={({ item }) => {
                                return (
                                    <NoteCards note={item} onRemove={this.onRemoveNote} />
                                )
                            }}
                        />
                    </View>}
            </View>
        )
    }

    renderItems({ item, index }) {
        const { first_name, last_name, phone_no, notes } = this.props.contact
        switch (item.id) {
            case 1:
                return (
                    <View style={styles.underline}>
                        <Text style={styles.nameText}>
                            Mobile
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            Linking.openURL('tel:' + phone_no)
                        }} >
                            <Text style={[styles.nameText, { fontSize: 14, fontWeight: 'bold', color: 'grey', marginTop: 5 }]}>
                                {phone_no}
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                )
            case 2:
                return (
                    <View style={styles.underline}>
                        <TouchableWithoutFeedback onPress={() => {
                            // props.onMessageSelected(props.contact)
                            // this.flatList.scrollToIndex({ index: 1, animated: true })
                            this.props.onMessageClicked(this.props.contact)
                        }}>
                            <Text style={styles.nameText}>
                                Send Message
                    </Text>
                        </TouchableWithoutFeedback>
                    </View>
                )
            case 3:
                return (
                    <Collapse style={styles.underline}>
                            <CollapseHeader>
                                <View bordered>
                                    <Text style={styles.nameText}>Notes</Text>
                                </View>
                            </CollapseHeader>
                            <CollapseBody>
                                {this.renderNotes()}
                            </CollapseBody>
                        </Collapse>
                )
            case 10:
                return (
                    <View style={styles.underline}>
                        <TouchableOpacity onPress={() => {
                            console.log('Entered onClick')
                            this.setState({ notesCollapsed: !this.state.notesCollapsed })
                            // this.forceUpdate()

                        }}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.nameText}>
                                    Notes
                                </Text>
                                {this.state.notesCollapsed ? <Up /> : <Down />}
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginTop: 20 }}>
                            {this.state.notesCollapsed ? this.renderNotes() : null}
                        </View>
                    </View>
                )
            case 4:
                return (
                    <View style={styles.underline}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ notesCollapsed: true })

                        }}>
                            <View>
                                <Text style={styles.nameText}>
                                    Tags
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            case 5:
                return (
                    <View style={styles.underline}>
                        <TouchableWithoutFeedback onPress={() => {
                            Share.open({
                                url: BASE_URL,
                                title: 'Share Contact'
                            })
                        }}>
                            <Text style={styles.nameText}>
                                Share Contact
                    </Text>
                        </TouchableWithoutFeedback>
                    </View>
                )
            default:
                return
        }
    }

    renderContactList() {
        return (
            <View>
                <FlatList
                    data={rows}
                    renderItem={this.renderItems.bind(this)}
                />
            </View>
        )
    }

    renderMainView() {
        const { first_name, last_name, full_name, phone_no, notes } = this.props.contact


        return (
            <View style={styles.listContainer} >

                <View style={styles.innerContainer}>
                    <View style={styles.textHolder} >
                        <Text style={[styles.nameText, { fontWeight: 'bold', fontSize: 20, alignSelf: 'center' }]}>
                            {full_name || ' '}
                        </Text>
                    </View>
                    <View style={styles.underline}>
                        <Text style={styles.nameText}>
                            Mobile
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            Linking.openURL('tel:' + phone_no)
                        }} >
                            <Text style={[styles.nameText, { fontSize: 14, fontWeight: 'bold', color: 'grey', marginTop: 5 }]}>
                                {phone_no}
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    {/* <View style={styles.underline}> */}
                        {/* <TouchableOpacity onPress={() => {
                            this.setState({ notesCollapsed: true })
                            // props.onMessageSelected(props.contact)
                            // this.flatList.scrollToIndex({ index: 1, animated: true })
                        }}>
                            <View>
                                <Text style={styles.nameText}>
                                    Notes
                                </Text>
                            </View>
                        </TouchableOpacity> */}
                        <Collapse>
                            <CollapseHeader>
                                <View bordered>
                                    <Text style={styles.nameText}>Notes</Text>
                                </View>
                            </CollapseHeader>
                            <CollapseBody>
                                {this.renderNotes()}
                            </CollapseBody>
                        </Collapse>
                    {/* </View> */}
                    {/* {this.state.notesCollapsed ? this.renderNotes() : null} */}
                    <View style={styles.underline}>
                        <TouchableWithoutFeedback onPress={() => {
                            // props.onMessageSelected(props.contact)
                            // this.flatList.scrollToIndex({ index: 1, animated: true })
                            this.props.onMessageClicked(this.props.contact)
                        }}>
                            <Text style={styles.nameText}>
                                Send Message
                    </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.underline}>
                        <TouchableWithoutFeedback onPress={() => {
                            Share.open({
                                url: BASE_URL,
                                title: 'Share Contact'
                            })
                        }}>
                            <Text style={styles.nameText}>
                                Share Contact
                    </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.underline}>
                        <Text style={styles.nameText}>
                            Add to Favourites
                    </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderHeader(section) {
        return (
            <View style={styles.underline}>
                <Text style={styles.nameText}>{section.title}</Text>
            </View>
        )
    }

    renderContent(section) {
        return (
            <View style={{ backgroundColor: 'red' }}>
                <Text>{section.title}</Text>
            </View>
        )
    }

    _updateSections = activeSections => {
        this.setState({ activeSections });
    }

    render() {
        const { first_name, full_name, phone_no, notes, photo } = this.props.contact
        const tag = full_name.split('')[0].toUpperCase()
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.name}>
                    <View style={{ borderRadius: 150, width: 150, height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: color.base, overflow: 'hidden' }}>
                        {
                            photo ?
                                <Image
                                    source={{ uri: BASE_URL + photo }}
                                    width={200}
                                    height={200}
                                    style={{ width: 200, height: 200 }}
                                /> :
                                <Text style={styles.thumb}>
                                    {tag}
                                </Text>
                        }
                    </View>
                </View>
                <View style={{ flex: 1, width: '80%' }}>
                    <FlatList 
                        data={this.rows}
                        renderItem={this.renderItems}

                    />
                </View>
            </KeyboardAvoidingView>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        // paddingBottom: 100,
        overflow: 'scroll'


    },
    listContainer: {
        flex: 1,
        // flexGrow:1,
        // marginBottom: 100,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'scroll'
    },
    name: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // width: Dimensions.get('window').width - 50,
        // flexWrap: 'wrap',
        // height: 180
    },
    thumb: {
        fontSize: 120,
        fontWeight: 'bold',
        color: '#FFF'
    },
    nameText: {
        fontSize: 16,
        paddingStart: 10,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular'
    },
    underline: {
        borderBottomWidth: 2,
        borderBottomColor: '#E6E7E8',
        // flex: 1,
        minHeight: 50,
        width: '100%',
        justifyContent: 'center',
        paddingStart: 10
    },
    innerContainer: {
        flex: 1,
        // top: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: Dimensions.get('window').width - 100,
        flexDirection: 'column'
        // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    textHolder: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
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
        paddingStart: 20
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
    }

})

const mapStateToProps = (state) => ({
    contact_notes: state.contacts.notes,
    loading: state.contacts.loading
})

export default connect(mapStateToProps, { fetchNotes, addNote, removeNoteById, setContactLoading })(Content)
