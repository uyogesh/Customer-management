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
import { submitContact } from '../../../actions/contactsActions'
import Cross from '@material-ui/icons/CloseOutlined'
import ImageUpload from '../../../components/imageUpload'
import Icon from '../../../assets/download.jpeg'
import color from '../../../styles/color'

const dim = Dimensions.get('window')

class CreateContact extends React.Component {
    state = {
        date: '2016-05-03',
        first_name: '',
        last_name: '',
        phone_no_1: '',
        phone_no_2: '',
        phone_no_3: '',
        address: '',
        gender: 1,
        tags: '',
        file: '',
        fileLink:'',
        formFieldError: "Cannot be empty."
    }

    isFormValid() {
        let data = this.state
        if (!data.first_name||
            !data.last_name ||
            !this.isValidPhoneNumber() ||
            !data.address)
        {
            return false

        } else {
            return true
        }
    }
    
    isValidPhoneNumber() {
        let data = this.state
        const phone_1_is_valid = data.phone_no_1 && data.phone_no_1.length === 3
        const phone_2_is_valid = data.phone_no_2 && data.phone_no_2.length === 3
        const phone_3_is_valid = data.phone_no_3 && data.phone_no_3.length === 4
        return phone_1_is_valid && phone_2_is_valid && phone_3_is_valid
    }

    handleImage(event) {

        this.setState({ fileLink: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
        })
    }

    render() {
        const { first_name, last_name, gender, date, phone_no_1, phone_no_2, phone_no_3, address, tag } = this.state
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '5%', alignSelf: 'center', width: dim.width * 0.6 }}>
                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "#57008E", width: '40%', height: 200, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ color: '#FFD829', fontWeight: 'bold', fontFamily: 'Lato', fontSize: 30 }}>Add New Contact</Text>
                </View>
                <View style={{ backgroundColor: 'white', width: '90%', marginTop: -40, zIndex: -10, borderRadius: 10, paddingTop: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{alignSelf:'flex-end', marginTop: -40, marginRight: 15}}><Cross onClick={()=>{
                        this.props.close()
                    }} /></View>
                    <View style={{ marginBottom: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.imgHolder}>
                            <img src={ this.state.fileLink || Icon} width={250} />
                        </View>
                        <input type="file" onChange={this.handleImage.bind(this)} ref={(ref) => this.picInput = ref} hidden />
                        <Button title="Select Image" onPress={() => {
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
                                <View style={{flexDirection: 'row', flex:1, width: '100%', alignItems:'center'}}>
                                    <Text style={{marginRight: 10, fontSize:20}}>+1</Text>
                                    <TextField
                                        value={phone_no_1}
                                        style={{ fontSize: 20, width: 40 }}
                                        inputProps={{maxLength:3}}
                                        type="number"
                                        onChange={(event) => {
                                            this.setState({ phone_no_1: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                        }}

                                    />
                                    <Text style={{marginRight: 10, marginLeft: 10, fontSize: 20}}>-</Text>
                                    <TextField
                                        value={phone_no_2}
                                        style={{ fontSize: 20, width: 40 }}
                                        type="number"
                                        inputProps={{maxLength:3}}
                                        onChange={(event) => {
                                            this.setState({ phone_no_2: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                        }}

                                    />
                                    <Text style={{marginRight: 10,marginLeft: 10, fontSize: 20}}>-</Text>
                                    <TextField
                                        value={phone_no_3}
                                        style={{ fontSize: 20, width: 60 }}
                                        type="number"
                                        inputProps={{maxLength:4}}
                                        maxLength={4}
                                        onChange={(event) => {
                                            this.setState({ phone_no_3: event.target.value })
                                        }}
                                        baseColor={color.base}
                                        textColor="#000"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,4)
                                        }}

                                    />
                                </View>
                                <div>
                                    {(() => {
                                        if ((this.state.phone_no_1 + this.state.phone_no_2 + this.state.phone_no_3).length < 10) {
                                            return (
                                                <span style={{color: "red"}}>Please enter 10 digit number</span>
                                            )
                                        }
                                    })()}
                                </div>
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
                                    const phone_no = '+1'+phone_no_1+phone_no_2+phone_no_3
                                    console.log(phone_no)
                                    this.props.submitContact({ first_name, last_name, gender, date, phone_no, address, tag },this.state.file, this.props.close, "web")
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
        // justifyContent: 'center',
        // alignItems: 'center'
    }
})

const mapStateToProps = (state) => ({
    loading: state.contacts.loading,

})


export default connect(mapStateToProps, { submitContact })(CreateContact)
