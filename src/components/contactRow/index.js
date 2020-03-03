import React from 'react'
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    Linking,
    Platform,
    StyleSheet
} from 'react-native'
import { Message, Call } from '../Icons/icon'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls'

export default class ContactRow extends React.Component {
    state={
        highlight: false
    }

    render() {
        const name = this.props.contact.first_name || "Add"
        const tag = name.split('')[0].toUpperCase()
        const { photo } = this.props.contact

        return (

            <TouchableOpacity
                onPress={() => {
                    this.props.onContactSelected(this.props.contact, this.props.animKey)
                }} 
                style={[styles.row, styles.contactHolder, this.state.highlight?{backgroundColor:'rgba(0,0,0,0.1)'}:null]}
                disabled={this.props.disabled}
                onMouseEnter={()=>{
                    this.setState({highlight: true})
                }}
                onMouseLeave={()=>{
                    this.setState({highlight: false})
                }}    
            >

                <View style={[styles.row, styles.first]}>
                    <View style={[styles.circularImageHolder]}>

                        <View style={[styles.circularImage, { borderColor: "#9900E0", borderWidth: 2 }]} >
                            {
                                photo ?
                                    <Image
                                        source={{ uri: BASE_URL + photo }}
                                        width={100}
                                        height={100}
                                        style={{ width: 100, height: 100, zIndex: 100 }}
                                    /> :
                                    <Text style={styles.thumbnail}>
                                        {tag}
                                    </Text>
                            }
                        </View>
                    </View>
                    <View style={[styles.textHolder]}>
                        <Text style={styles.text}>
                            {this.props.contact.first_name || this.props.contact.full_name}
                        </Text>
                        <Text style={styles.miniText}>
                            {this.props.contact.phone_no}
                        </Text>
                    </View>
                </View>
                <View style={[styles.row, styles.bottom]}>
                    <TouchableOpacity onPress={() => {

                        this.props.onMessageClicked(this.props.contact)
                    }}>
                        <Message size={20} color={color.base} style={{ marginRight: 10 }}  {...this.props} />
                    </TouchableOpacity>
                    {   //No need for call button on web
                        Platform.select({
                            web: null,
                            default:
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL('tel:' + this.props.contact.phone_no)
                                }}>
                                    <Call size={20} color={color.base} style={{ marginRight: 10 }} {...this.props} />
                                </TouchableOpacity>
                        })}
                </View>
            </TouchableOpacity>
        )
    }
}

// ()=> props.push('Contact',{user:{name:props.name}})
const styles = StyleSheet.create({
    contactHolder: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        // paddingStart: 20,
        // marginStart: -20
        paddingStart: 20

    },
    first: {
        // justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 4,


    },
    row: {

        flexDirection: 'row'
    },
    bottom: {
        flex: 1,
        marginRight: 20

    },
    contactHolderLast: {
        flex: 1,
        // width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 20,
        // paddingStart: 20,
    },
    textHolder: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingStart: 20
    },
    text: {
        fontSize: 20,
        color: "#000",
        // fontWeight:'bold',
        fontFamily: 'Lato-Regular, Lato'
    },
    circularImage: {

        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: 50,
        height: 50,
        borderRadius: 50
    },
    circularImageHolder: {
        // flex: 1,
        justifyContent: 'center',

    },
    thumbnail: {
        fontSize: 26,
        // fontWeight:'bold',
        fontFamily: 'Lato-Regular',
        alignSelf: 'center',
        color: color.base
    },
    miniText: {
        fontFamily: 'Lato-Regular',
        color: "#777",
        fontSize: 16
    },
    spaceBetween: {
        justifyContent: 'space-between',

    }
})


{/* <View style={{flexDirection: 'row', alignItems: 'space-around'}}> */ }
