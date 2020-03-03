import React from 'react'
import {
    View,
    Picker,
    TextInput,
    Button,
    Dimensions,
    Text,
    StyleSheet,
} from 'react-native'
// import TextInput from '../../../components/textInputwLabel/TextInput'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import { editContact } from '../../actions/contactsActions'
import Cross from '@material-ui/icons/CloseOutlined'
// import ImageUpload from '../../../components/imageUpload'
import Icon from '../../assets/download.jpeg'
import color from '../../styles/color'
import { BASE_URL } from '../../Utils/urls';

const dim = Dimensions.get('window')

class EditContact extends React.Component {
    state = {
        date: '2016-05-03',
        first_name: '',
        last_name: '',
        id: '',
        phone_no_1: '',
        phone_no_2: '',
        phone_no_3: '',
        address: '',
        gender: 1,
        tag: '',
        file: '',
        fileLink: '',
        formFieldError: "Cannot be empty."
    }
    
    isFormValid() {
        let data = this.state
        if (!data.first_name||
            !data.last_name ||
            !data.phone_no_1 ||
            !data.phone_no_2 ||
            !data.phone_no_3 ||
            !data.address)
        {
            return false

        } else {
            return true
        }
    }

    handleImage(event) {

        this.setState({
            fileLink: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
        })
    }

    componentDidMount() {
        let gender
        if (this.props.contact.gender === "Male") {
            gender = 1
        } else if (this.props.contact.gender === "Female") {
            gender = 2
        } else {
            gender = 3
        }
        this.setState({
            ...this.props.contact,
            gender,
            phone_no_1: this.props.contact.phone_no.split('').splice(0, 3).join(''),
            phone_no_2: this.props.contact.phone_no.split('').splice(3, 3).join(''),
            phone_no_3: this.props.contact.phone_no.split('').splice(6, 4).join(''),
            fileLink: BASE_URL + this.props.contact.photo
        })
    }

    render() {
        console.log(this.props.contact)
        const { first_name, last_name, gender, date, phone_no_1, phone_no_2, phone_no_3, address, tag, id } = this.state
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '5%', alignSelf: 'center', width: dim.width * 0.6 }}>
                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#57008E", width: '40%', height: 200, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ color: '#FFD829', fontWeight: 'bold', fontFamily: 'Lato', fontSize: 30 }}>Edit Contact</Text>
                </View>
                <View style={{ backgroundColor: 'white', width: '90%', marginTop: -40, zIndex: -10, borderRadius: 10, paddingTop: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ alignSelf: 'flex-end', marginTop: -40, marginRight: 15 }}><Cross onClick={() => {
                        this.props.onClose()
                    }} /></View>
                    <View style={{ marginBottom: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.imgHolder}>
                            <img src={this.state.fileLink || Icon} width={250} />
                        </View>
                        <input type="file" onChange={this.handleImage.bind(this)} ref={(ref) => this.picInput = ref} hidden />
                        <Button
                            title="Select Image"
                            color={color.base}
                            onPress={() => {
                                this.picInput.click()
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, width: '50%' }}>
                        <View style={styles.contactForm}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>First Name</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextField
                                    placeholder="First Name"
                                    labelStyle={{ color: color.base }}
                                    value={first_name}
                                    style={{ fontSize: 20, borderWidth: 1, }}
                                    onChange={(event) => {
                                        this.setState({ first_name: event.target.value })
                                    }}

                                />
                                <div>
                                    {(() => {
                                        if (!this.state.first_name) {
                                            return (
                                                <span style={{color: "red"}}>{this.state.formFieldError}</span>
                                            )
                                        }
                                    })()}
                                </div>

                            </View>
                        </View>
                        <View style={styles.contactForm}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Last Name</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextField
                                    placeholder="Last Name"
                                    value={last_name}
                                    style={{ fontSize: 20 }}
                                    onChange={(event) => {
                                        this.setState({ last_name: event.target.value })
                                    }}
                                    baseColor={color.base}
                                    textColor="#000"

                                />
                                <div>
                                    {(() => {
                                        if (!this.state.last_name) {
                                            return (
                                                <span style={{color: "red"}}>{this.state.formFieldError}</span>
                                            )
                                        }
                                    })()}
                                </div>
                            </View>
                        </View>
                        <View style={styles.contactForm}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Phone</Text>
                            </View>
                            <View style={styles.textInputContainer} >
                                <View style={{ flexDirection: 'row', flex: 1, width: '100%', alignItems: 'center' }}>
                                    <Text style={{ marginRight: 10, fontSize: 20 }}>+1</Text>
                                    <TextField
                                        value={phone_no_1}
                                        style={{ fontSize: 20, width: 40 }}
                                        inputProps={{ maxLength: 3 }}
                                        disabled
                                        onChange={(event) => {
                                            this.setState({ phone_no_1: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"


                                    />
                                    <Text style={{ marginRight: 10, marginLeft: 10, fontSize: 20 }}>-</Text>
                                    <TextField
                                        value={phone_no_2}
                                        style={{ fontSize: 20, width: 40 }}
                                        inputProps={{ maxLength: 3 }}
                                        disabled
                                        onChange={(event) => {
                                            this.setState({ phone_no_2: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"


                                    />
                                    <Text style={{ marginRight: 10, marginLeft: 10, fontSize: 20 }}>-</Text>
                                    <TextField
                                        value={phone_no_3}
                                        style={{ fontSize: 20, width: 60 }}
                                        inputProps={{ maxLength: 4 }}
                                        disabled
                                        onChange={(event) => {
                                            this.setState({ phone_no_3: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"


                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.contactForm}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Address</Text>
                            </View>
                            <View style={styles.textInputContainer} >
                                <TextField
                                    placeholder="Address"
                                    value={address}
                                    style={{ fontSize: 20 }}
                                    onChange={(event) => {
                                        this.setState({ address: event.target.value })
                                    }}
                                    baseColor={color.base}
                                    textColor="#000"
                                />
                                <div>
                                    {(() => {
                                        if (!this.state.address) {
                                            return (
                                                <span style={{color: "red"}}>{this.state.formFieldError}</span>
                                            )
                                        }
                                    })()}
                                </div>
                            </View>
                        </View>

                        <View style={[styles.contactForm, { flexDirection: 'row' }]}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Gender</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <Picker
                                    label="Gender"
                                    mode="dropdown"
                                    baseColor={color.orange}
                                    selectedValue={gender}
                                    textColor="#000"
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
                        <View style={[styles.contactForm]}>
                            <Button
                                title="submit"
                                disabled={!this.isFormValid()}
                                style={{ flex: 1 }}
                                onPress={() => {
                                    const phone_no = phone_no_1 + phone_no_2 + phone_no_3
                                    let genderNumber
                                    switch (gender) {
                                        case "Male":
                                            genderNumber = 1
                                            break
                                        case "Female":
                                            genderNumber = 2
                                            break
                                        case "Others":
                                            genderNumber = 3
                                            break
                                        default:
                                            genderNumber = gender
                                    }
                                    this.props.editContact({ first_name, last_name, gender: genderNumber, date, phone_no, address, tag, id }, this.state.file, this.props.onClose, "web")
                                }}
                            />

                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contactForm: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 50

        // borderWidth: 1,
        // minHeight: 100,
        // borderColor: '#0F0'
    },
    imgHolder: {
        width: 250,
        height: 250,
        borderRadius: 250,
        marginBottom: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        alignSelf: 'flex-start',
        fontSize: 20,
        marginRight: 30
    },
    textContainer: {
        flex: 1,

    },
    textInputContainer: {
        flex: 2,
    }
})

const mapStateToProps = (state) => ({
    loading: state.contacts.loading,

})


export default connect(mapStateToProps, { editContact })(EditContact)
