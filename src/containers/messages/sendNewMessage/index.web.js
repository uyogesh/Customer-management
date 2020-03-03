import React from 'react'
import {
    View,
    Dimensions,
    Text,
    StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { submitContact } from '../../../actions/contactsActions'
import Cross from '@material-ui/icons/CloseOutlined'
import color from '../../../styles/color'
import AlphaScrollFlatList from "../../../components/alphabetScrollList";
import ContactRow from "../../../components/contactRow";
import {fetchChat, selectCurrentlyChattingContact} from '../../../actions/messageActions'
import { addAdditionalContacts } from '../../../actions/contactsActions'

const dim = Dimensions.get('window')

class SendNewMessage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            height: Dimensions.get('window').height
        }
    }

    handleMessageClick(contact) {
        this.props.close()
        this.props.navigation.push('/message', { newMessageForContact: contact })
        this.props.fetchChat(contact.phone_no)
        this.props.selectCurrentlyChattingContact(contact)
    }

    render() {
        const { contact } = this.props
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '5%', alignSelf: 'center', width: dim.width * 0.5 }}>
                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#57008E", width: '40%', height: 200, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ color: '#FFD829', fontWeight: 'bold', fontFamily: 'Lato', fontSize: 30 }}> Send Message </Text>
                </View>
                <View style={{ backgroundColor: 'white', width: '90%', marginTop: -40, zIndex: -10, borderRadius: 10, paddingTop: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{alignSelf:'flex-end', marginTop: -40, marginRight: 15}}><Cross onClick={()=>{
                        this.props.close()

                    }} /></View>
                    {contact.length === 0 ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '30%' }}>
                            <Text style={{ fontSize: 24, color: 'grey', fontWeight: 'bold'}}>
                                No Contacts Yet, Add Contacts From Option from top left Corner!!
                            </Text>
                        </View> :
                        <AlphaScrollFlatList
                            renderItem={({ item, index }) =>
                                <ContactRow
                                    contact={item}
                                    last={false}
                                    key={item.first_name || index}
                                    navigation={this.props.history}
                                    onContactSelected={this.handleMessageClick.bind(this)}
                                    onMessageClicked={this.handleMessageClick.bind(this)}
                                />}
                            data={contact.data}
                            style={{ flex: 1,
                                maxHeight: this.state.height * 0.59,
                                // margin: 20,
                                paddingTop: 15,
                                width: '120%',
                            }}
                            scrollBarColor={color.base}
                            scrollBarFontSizeMultiplier={1.5}
                            itemHeight={dim.height - 65}
                            scrollBarContainerStyle={{ position: 'fixed', height: dim.height - 65, marginTop: 65, marginRight: 20, zIndex: 1000 }}
                            onEndReachedThreshold={0.9}
                            onEndReached={() => {
                                if (contact.links.next) {
                                    this.props.addAdditionalContacts(contact.links.next)
                                }
                            }}
                            keyExtractor={(item, index) => {
                                return item + String(index)
                            }}
                        />}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contactForm: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 50
    },
    imgHolder: {
        width: 250,
        height: 250,
        borderRadius: 250,
        marginBottom: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        alignSelf: 'flex-start',
        fontSize: 20,
        marginRight: 30
    },
    textContainer: {
        flex: 1,

    },
    textInputContainer: {
        flex: 2,
    }
})

const mapStateToProps = (state) => ({
    loading: state.contacts.loading,

})


export default connect(mapStateToProps, { submitContact, selectCurrentlyChattingContact, fetchChat, addAdditionalContacts })(SendNewMessage)
