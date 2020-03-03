import React from 'react'
import {
    View,
    Text,
    Button,
    TouchableHighlight,
    ActivityIndicator,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import { connect } from 'react-redux'
import TagInput from '../../components/tagInput'
import Icon from 'react-native-vector-icons/EvilIcons'
import NavBar from '../../components/navBarWeb'
import Drawer from '../../components/drawer'
import { addTags, tagsLoading, tagsLoaded, fetchTags } from '../../actions/tagsAction'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls';

class Settings extends React.Component {

    state = {
        emails: ['yog@gmail.com', 'admin@admin.com'],
        text: '',
        open: false,
        height: '',
        width: '',
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

    componentDidMount() {
        this.props.fetchTags()
        // this.props.tagsLoaded()
        this.setState({
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
        })
    }

    render() {
        const { addTags, tagsLoading, loading, tags, user } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: '#DDD', height: this.state.height  }}>
                <NavBar title="Messages" onClickHandler={() => {
                    this.setState({ open: true })
                }}
                    leftOption=""
                    showSearch={false}
                    onLeftButtonClick={() => { }}
                    handleSearch={()=>{}}
                />
                <Drawer open={this.state.open} onClose={() => {
                    this.setState({ open: false })
                }}
                    user={user}
                    navigate={(path) => {
                        this.props.history.push(path)
                    }}
                />
                <View style={{ margin: 20 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                        Settings
                </Text>
                </View>
                <View style={{ margin: 10, borderRadius: 10, flex: 1, padding: 10, flexWrap: 'wrap', backgroundColor: '#fff', flexDirection: 'column' }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: color.base, fontWeight: 'bold', fontSize: 20, fontFamily: 'Lato-Regular' }}>Tags</Text>
                        {/* {<ActivityIndicator color={color.base} size={10}/>} */}
                    </View>
                    <TagInput disable={loading} />

                </View>
                
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <a href={`${BASE_URL}export/contact/${user.id}`}>
                        <Text style={{
                            fontSize: 20,
                            color: color.base,
                            fontWeight: 'bold'
                        }}>Export All Contacts to CSV</Text>
                    </a>
                </View>
                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight onPress={() => {

                    }}>
                        <Text style={{
                            fontSize: 20,
                            color: 'red',
                            fontWeight: 'bold'
                        }}>Delete All Contacts</Text>
                    </TouchableHighlight>

                </View> */}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    tags: state.tags.tags,
    loading: state.tags.loading,
    user: state.auth,
})

export default connect(mapStateToProps, { addTags, tagsLoading, tagsLoaded, fetchTags })(Settings)