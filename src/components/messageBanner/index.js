import React from 'react'
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import Contact from '@material-ui/icons/Person'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { contains } from 'ramda'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls';

const materialStyles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});

const dim = Dimensions.get('window')
class MessageBanner extends React.Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    state = {
        open: false,
    };

    handleClick = () => {
        this.setState({ open: true });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes, contact_info } = this.props
        const { photo, full_name, phone_number, contact_id } = contact_info
        let id
        if(contains('contact_id', Object.keys(contact_info))){
            id=contact_info.contact_id
        } else {
            id = contact_info.id
        }
        return (
            <View style={styles.container}>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Selected contact not in Contacts list.</span>}
                    action={[
                        <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                            CLOSE
                                </Button>,
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 100 }}>
                    <View style={styles.circularImageHolder}>
                        <TouchableOpacity to={{ pathname: id ? `/contact/${id}` : '#', state: { contact: contact_info } }} onPress={() => {
                            if (!id) {
                                this.handleClick()
                            } else {
                                this.props.navigation.push(`/contact/${id}`, {contact: contact_id})
                            }

                        }}
                        style={{textDecorationLine: 'none'}}>
                            {photo?<Image source={BASE_URL+photo || require('../../assets/download.jpeg')} style={{ width: '10vh', height: '9vh', maxHeight: '10vh' }} />:
                            <Text
                                adjustsFontSizeToFit={true} 
                            style={{fontSize: '2vh', fontWeight: 'bold', color: 'white'}}>{full_name?full_name.split('')[0].toUpperCase():"#"}</Text>
                        }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.textHolder}>
                    <Text style={styles.text}>{full_name||''}</Text>
                    <Text style={styles.phone}>{phone_number||this.props.contact_info.phone_no}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%',
        // maxHeight: 70,
        // minWidth: dim.width*3/4-70,
        // marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'space-around',
        elevation: 5,
    },
    circularImageHolder: {
        flex: 1,
        width: '10vh',
        minHeight: '10vh',
        borderRadius: '10vh',
        justifyContent: 'center',
        alignItems:'center',
        borderColor: color.base,
        backgroundColor: color.base,
        borderWidth: 2,
        overflow: 'hidden',
    },
    text: {
        fontSize: '4vh',
        color: "#000",
        // alignSelf: 'center'
        // fontWeight: 'bold'
    },
    phone: {
        fontSize: 24,
        fontSize: '1.8vh',
        // alignSelf: 'flex-end',
        marginLeft: 5,
        color: 'grey'
    },
    textHolder: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    }
})


MessageBanner.defaultProps = {
    photo: require('../../assets/download.jpeg'),
    full_name: 'User'
}

export default withStyles(materialStyles)(MessageBanner)
