import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import {withStyles} from '@material-ui/core/styles'
import TextInput from '@material-ui/core/TextField'

const materialStyles = {
    textInput: {
        minWidth: 100,
        height: 40
    }
}

class TextFieldComp extends React.Component {
    state = {
        value: ''
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {this.props.label}
                </Text>
                <TextInput
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onTextChange}
                    

                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: 100,
        width: 200,
        marginBottom: 50
    },
    
})

export default withStyles(materialStyles)(TextFieldComp)