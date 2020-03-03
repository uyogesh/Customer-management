import React from 'react'
import {
    View,
    Text,
    Button,
    TouchableHighlight,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native'
import { connect } from 'react-redux'
import TagInput from 'react-native-tag-input'
import Icon from 'react-native-vector-icons/EvilIcons'
import { addTags, tagsLoading } from '../../actions/tagsAction'
import color from '../../styles/color'

class Settings extends React.Component {

    state = {
        emails: ['yog@gmail.com', 'admin@admin.com'],
        text: ''
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Settings",
        headerTitleStyle: {
            color: color.black,
            flex: 1
        },
        headerStyle: {
            // backgroundColor: '#383A42',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS,
            // tintColor: "#E6E7E8",
        },
        headerLeft: <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            console.log(navigation)
            // navigation.navigateToScreen('contactsStack')
            navigation.toggleDrawer()
        }}>
            <Icon name="chevron-left" size={50} color={color.black} />
        </TouchableWithoutFeedback>,
        headerRight: <TouchableWithoutFeedback style={{ paddingLeft: 10 }} onPress={() => {

        }}>
            <Icon name="gear" size={30} />
        </TouchableWithoutFeedback>

    })

    render() {
        const { addTags, tagsLoading } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: '#DDD' }}>
                <View style={{ margin: 10, borderRadius: 10, flex: 1, padding: 10, flexWrap: 'wrap', backgroundColor: '#fff', flexDirection: 'column' }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: color.base, fontWeight: 'bold', fontSize: 20, fontFamily: 'Lato-Regular' }}>Tags</Text>
                        {<ActivityIndicator color={color.base} size={10}/>}
                    </View>
                    <TagInput
                        value={this.state.emails}
                        onChange={(emails) => this.setState({ emails })}
                        labelExtractor={(email) => email}
                        text={this.state.text}
                        tagContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }}
                        onChangeText={(text) => {
                            if (text.split('')[text.length - 1] === " ") {
                                this.setState({ emails: [...this.state.emails, this.state.text] })
                                this.setState({ text: '' })
                                tagsLoading()
                                addTags(text)
                            } else {
                                this.setState({ text })
                            }
                        }}
                        inputProps={{ style: { justifyContent: 'center', alignItems: 'flex-start' } }}
                    />
                    
                </View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableHighlight onPress={()=>{

                    }}>
                        <Text style={{
                            fontSize: 20,
                            color: color.base,
                            fontWeight: 'bold'
                        }}>Export All Contacts to CSV</Text>
                    </TouchableHighlight>

                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    tags: state.tags
})

export default connect(mapStateToProps, { addTags, tagsLoading })(Settings)