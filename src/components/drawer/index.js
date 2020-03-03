import React from 'react'
import {
    View,
    Text,
    Image
} from 'react-native'
import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card'
import VoiceChat from '@material-ui/icons/Voicemail'
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Message from '@material-ui/icons/Message';
import Setting from '@material-ui/icons/Settings';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { connect } from 'react-redux'
import { logOut } from '../../actions/authAction'
import { BASE_URL } from '../../Utils/urls';
import color from '../../styles/color'



const useStyles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    card: {
        flex: 1
    }
};


class DrawerComp extends React.Component {

    state = {
        left: false
    }

    toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ [side]: open });

    };

    sideList = side => (
        <div
            className={this.props.classes.list}
            role="presentation"
            onClick={this.toggleDrawer(side, false)}
            onKeyDown={this.toggleDrawer(side, false)}
        >
            <Card className="card">
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                    <img src={BASE_URL + this.props.user.avatar} width={150 * 1.3} height={83 * 1.3} style={{ borderRadius: 150 }} />

                </View>
                <View style={{
                    flex: 1, alignItems: 'center', marginTop: 20,
                    marginBottom: 20
                }}>
                    <Text style={{ fontSize: 20, color: color.base, alignSelf: 'center' }}>
                        {this.props.user.first_name}
                    </Text>
                </View>

            </Card>
            <List>
                <ListItem button key="Contact" onClick={() => {
                    this.props.navigate('contacts')
                }}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contacts" />
                </ListItem>
                <ListItem button key="Message" onClick={() => {
                    this.props.navigate('message')
                }}>
                    <ListItemIcon >
                        <Message />
                    </ListItemIcon>
                    <ListItemText primary="Message" />
                </ListItem>
                <ListItem button key="voice-mail" onClick={() => {
                    this.props.navigate('voice-mails')
                }}>
                    <ListItemIcon >
                        <VoiceChat />
                    </ListItemIcon>
                    <ListItemText primary="Voice Mail" />
                </ListItem>
                <ListItem button key="custom-message" onClick={() => {
                    this.props.navigate('custom-message')
                }}>
                    <ListItemIcon >
                        <Message />
                    </ListItemIcon>
                    <ListItemText primary="Custom Messages" />
                </ListItem>
                <ListItem button key="Setting" onClick={() => {
                    this.props.navigate('settings')
                }}>
                    <ListItemIcon >
                        <Setting />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key="Log Out" onClick={()=>{
                    this.props.logOut()
                }}>
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
        </div>
    );

    fullList = side => (
        <div
            className={this.props.classes.fullList}
            role="presentation"
            onClick={this.toggleDrawer(side, false)}
            onKeyDown={this.toggleDrawer(side, false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );


    render() {
        return (
            <Drawer open={this.props.open} onClose={() => this.props.onClose()}>
                {this.sideList('left')}
            </Drawer>
        )
    }
}

const styledComponent = withStyles(useStyles)(DrawerComp)
export default connect(null, { logOut })(styledComponent)