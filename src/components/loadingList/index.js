import React from 'react'
import {
    View,
    FlatList,
    StyleSheet,
} from 'react-native'

const dummy = [{}, {}, {}, {}, {}, {}, {}, {}, {}]
export default (props) => {
    return (
        <FlatList 
            data={dummy}
            renderItem={({item})=>{
                return (
                        <View style={styles.container}>
                            <View style={styles.round}>

                            </View>
                            <View style={styles.body}>
                                
                            </View>
                        </View>
                )
            }}

        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    round: {
        width:20,
        borderRadius: 20,
        backgroundColor: "#999"
    },
    body: {
        padding: 10,
        backgroundColor: '#BBB'
    }
}) 