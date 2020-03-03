import React from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import {
    TextField
} from 'react-native-material-textfield'
import Color from '../../styles/color'

export default class TextFieldComp extends React.Component{
    state={
        value: ''
    }
    render(){
        return (
        <View style={styles.container}>
            <TextField 
                label={this.props.label}
                value={this.props.value}
                onChangeText={this.props.onTextChange}
                secureTextEntry={this.props.password}
                labelHeight={20}
                baseColor={this.props.baseColor}
                textColor={this.props.textColor}
            
            />
        </View>
    )}
}

const styles = StyleSheet.create({
    container: {
        flex:0,
        height: 100,
        width: 200
    },
})
TextFieldComp.propTypes = {
    label: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    password: PropTypes.bool,
    baseColor: PropTypes.string,
    textColor: PropTypes.string,
} 

TextFieldComp.defaultProps = {
    password: false,
    baseColor:'#000',
    textColor:'#000'
}