import React, { Component } from 'react'
import {NavigationActions} from 'react-navigation'
import { Text, View, Image, StyleSheet, ImageBackground } from 'react-native'
import Logo from '../../assets/logo-colored.png'
import color from '../../styles/color'

export default class drawerContentComponents extends Component {

    navigateToScreen = ( route ) =>(
        () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    })

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{flex: 1, width: 280, justifyContent: 'center'}} >
                    <Image source={Logo} width={50} height={50}/>
                </View>
            </View>
            <View style={styles.screenContainer}>
                <View style={[styles.screenStyle, (this.props.activeItemKey=='contactsStack') ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (this.props.activeItemKey=='contactsStack') ? styles.selectedTextStyle : null]} onPress={this.navigateToScreen('contactsStack')}>Contacts</Text>
                </View>
                <View style={[styles.screenStyle, (this.props.activeItemKey=='messageStack') ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (this.props.activeItemKey=='messageStack') ? styles.selectedTextStyle : null]} onPress={this.navigateToScreen('messageStack')}>Message</Text>
                </View>
                <View style={[styles.screenStyle, (this.props.activeItemKey=='voiceMail') ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (this.props.activeItemKey=='voiceMail') ? styles.selectedTextStyle : null]} onPress={this.navigateToScreen('voiceMail')}>VoiceMail</Text>
                </View>
                <View style={[styles.screenStyle, (this.props.activeItemKey=='customMessageStack') ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (this.props.activeItemKey=='customMessageStack') ? styles.selectedTextStyle : null]} onPress={this.navigateToScreen('customMessageStack')}>Custom Message</Text>
                </View>
                <View style={[styles.screenStyle, (this.props.activeItemKey=='settingsStack') ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (this.props.activeItemKey=='settingsStack') ? styles.selectedTextStyle : null]} onPress={this.navigateToScreen('settingsStack')}>Settings</Text>
                </View>
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(112,0,165,0.2)'
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: { 
        paddingTop: 20,
        width: '100%',
    },
    screenStyle: {
        height: 30,
        marginTop: 50,

        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20, 
        textAlign: 'center',
        color: color.base,
        fontFamily: 'MyriadPro-Light'
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'MYRIADPRO-BOLD'
    },
    activeBackgroundColor: {
        backgroundColor: 'transparent'
    }
});