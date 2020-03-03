import React from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet
} from 'react-native'
import { Cross } from '../Icons/icon'
import color from '../../styles/color';

export default (props) => (
    <View style={styles.container}>
        <View style={{ flexDirection: 'column', flexWrap:'wrap', flex:1  }}>
            <Text style={{ color: 'black', fontFamily: 'Lato', fontSize: 12,flex:1  }}>{props.note.note}</Text>
            <Text style={{ fontSize: 12, color: 'grey', alignSelf: 'flex-start', flex:0 }}>{props.note.created_at}</Text>
        </View>
        <TouchableHighlight >
            <View>
            <Cross color="white" onClick={() => {
                props.onRemove(props.note.id)
            }}
                size={20}
            />
            </View>
        </TouchableHighlight>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexWrap: 'wrap',
        padding: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 10,
        margin: 5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: color.noteBG

    }
})