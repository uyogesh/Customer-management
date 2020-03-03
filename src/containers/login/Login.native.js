import React from 'react'
import {
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Button,
    StyleSheet,
    Dimensions,

} from 'react-native'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAuthToken } from '../../actions/authAction'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LabeledInputText from '../../components/textInputwLabel/TextInput'
import Logo from '../../assets/logo-colored.png'
import color from '../../styles/color'




const dim = Dimensions.get('screen')


const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    email: state.auth.email || 'empty'

})

const mapDispatchToProps = (dispatch) => ({
    getAuth: (username, password) => dispatch(getAuthToken(username, password))
})


class Login extends React.Component {
    state = {
        username: 'admin@admin.com',
        password: 'password'
    }

    static navigationOptions = {
        header: null
    }

    render() {
        const { navigation, error, email, loading } = this.props
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView style={{flex:1, flexDirection: 'column'}}>
                    <View style={styles.imgContainer}>
                        <Image source={Logo} width={50} height={50} />
                    </View>
                    <View style={styles.login}>
                        <LabeledInputText
                            label="Username"
                            value={this.state.username}
                            placeholder="Username"
                            labelShow={false}
                            baseColor={color.base}
                            textColor={"#000"}
                            onTextChange={(text) => {
                                this.setState({ username: text })
                            }} password={false} />
                        <LabeledInputText
                            label="Password"
                            value={this.state.password}
                            placeholder="Password"
                            labelShow={false}
                            baseColor={color.base}
                            textColor={"#000"}
                            onTextChange={(text) => {
                                this.setState({ password: text })
                            }} password={true} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Login" onPress={() => {
                            alert('ClickWorked')
                            this.props.getAuthToken(this.state.username, this.state.password, navigation, "native")
                        }} disabled={loading} />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 100,
        backgroundColor: color.primary
    },
    loginView: {
        // width: dim.width - 150,
        // height: dim.height - 300,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',

    },
    imgContainer: {
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 100,

    },
    login: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        // height: 100,
        width: dim.width - 180,
    },
    button: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        // paddingTop: 20,
        alignItems: 'center',
        height: 100,
        width: dim.width - 180,
    }
})

Login.propTypes = {
    loading: propTypes.bool,
    error: propTypes.bool,
    getAuthToken: propTypes.func
}

Login.defaultProps = {
    loading: false,
    error: false,
}

export default connect(mapStateToProps, { getAuthToken })(Login)