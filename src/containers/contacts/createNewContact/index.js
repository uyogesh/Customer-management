import React from 'react'
import {
    View,
    Picker,
    Button,
    Image,
    TextInput,
    // KeyboardAvoidingView,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import { submitContact } from '../../../actions/contactsActions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/EvilIcons'
import color from '../../../styles/color'
// import TextInput from '../../../components/textInputwLabel/TextInput'

const dim = Dimensions.get('window')

class CreateContact extends React.Component {
    state = {
        date: '2016-05-03',
        first_name: '',
        last_name: '',
        phone_no: '',
        address: '',
        gender: 1,
        tags: '',
        photo: '',
        avatarSource: ''
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Create Contact",
        headerTitleStyle: {
            color: "#000",
            flex: 1
        },
        headerStyle: {
            backgroundColor: '#FFF',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS,
            tintColor: "#E6E7E8",
        },
        headerLeft: <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            navigation.goBack()
        }}>
            <Icon name="chevron-left" size={50} color={color.base} />
        </TouchableWithoutFeedback>

    })

    render() {
        const { first_name, last_name, gender, date, phone_no, address, tag } = this.state
        return (
            <KeyboardAwareScrollView style={{ flex: 1 }} >
                <View style={{ flex: 1, marginTop: 20, height: dim.height, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                    <View style={{ flex: 2 }}>
                        <View style={{ width: 200, height: 200, borderRadius: 200, overflow: 'hidden' }}>
                            <Image source={this.state.avatarSource || require('../../../assets/download.jpeg')} style={{ width: 200, height: 200 }} />
                        </View>
                        <TouchableWithoutFeedback
                            style={{ alignSelf: 'flex-end', backgroundColor: 'red' }}
                            onPress={() => {
                                ImagePicker.showImagePicker({
                                    title: 'Choose Profile Pic',

                                }, (response) => {
                                    console.log('Response = ', response);

                                    if (response.didCancel) {
                                        console.log('User cancelled image picker');
                                    } else if (response.error) {
                                        console.log('ImagePicker Error: ', response.error);
                                    } else if (response.customButton) {
                                        console.log('User tapped custom button: ', response.customButton);
                                    } else {
                                        const source = { uri: response.uri };
                                        this.setState({ photo: response })
                                        this.setState({
                                            avatarSource: source
                                        });
                                    }
                                })
                            }}
                            title="Select Photo"
                        >
                            <Text style={{ alignSelf: 'center' }}>Upload Picture</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.contactForm, { flexDirection: 'row' }]}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                placeholder="First Name"
                                value={first_name}
                                style={{ width: '100%', marginRight: 20, paddingLeft: 5 }}
                                onChangeText={(text) => {

                                    this.setState({ first_name: text })
                                }}
                                baseColor={color.base}

                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 5 }}>
                            <TextInput
                                placeholder="Last Name"
                                value={last_name}
                                style={{ width: '100%' }}
                                onChangeText={(text) => {

                                    this.setState({ last_name: text })
                                }}
                                baseColor={color.base}

                            />
                        </View>
                    </View>
                    <View style={styles.contactForm}>
                        <TextInput
                            placeholder="Phone"
                            value={phone_no}
                            onChangeText={(text) => {
                                this.setState({ phone_no: text })
                            }}

                        />
                    </View>
                    <View style={styles.contactForm}>
                        <TextInput
                            placeholder="Address"
                            value={address}
                            onChangeText={(text) => {
                                this.setState({ address: text })
                            }}
                            baseColor={color.base}
                        />
                    </View>

                    <View style={styles.contactForm}>
                        <Text style={{ color: color.base, }}>Gender</Text>
                        <Picker
                            label="Gender"
                            mode="dropdown"
                            selectedValue={gender}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ gender: itemValue })
                            }}
                        >
                            <Picker.Item label="Male" value={1} />
                            <Picker.Item label="Female" value={2} />
                            <Picker.Item label="Others" value={3} />
                        </Picker>
                    </View>
                </View>
                <Button
                    title="submit"
                    onPress={() => {
                        this.props.submitContact({ first_name, last_name, gender, phone_no, address }, this.state.photo, this.props.navigation, "native")
                    }}
                />
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    contactForm: {
        flex: 1,
        justifyContent: 'center',

        // minHeight: 100,
        width: dim.width - 100,
        // borderColor: '#0F0'
    }
})

const mapStateToProps = (state) => ({
    loading: state.contacts.loading,

})


export default connect(mapStateToProps, { submitContact })(CreateContact)