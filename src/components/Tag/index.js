import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import Cross from '@material-ui/icons/CloseOutlined'

export default (props) => 
    <View style={styles.container}>
        <Text style={{ color: 'white' }}>{props.tag.tag}</Text>
        <a href="#" onClick={()=>{props.handleClose(props.tag.id)}}>
        <Cross size={2} color="#FFF"  />
        </a>
    </View>

const styles = StyleSheet.create({
    container: {
        height: 30,
        borderRadius:5,
        margin:5,
        padding: 5,
        backgroundColor: '#999',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})