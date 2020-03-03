
import React from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    Animated,
    StyleSheet,
    Dimensions,

} from 'react-native'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getAuthToken, clearLoginError } from '../../actions/authAction'
import Logo from '../../assets/logo-colored.png'



const dim = Dimensions.get('screen')
class Login extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            moveAnim: new Animated.Value(0),
           
        }

    }
    

    navigateToMainBody(){
        this.props.history.go('/contacts')
    }

    componentDidMount(){
        Animated.spring(this.state.moveAnim,{
            toValue:1,
            duration: 2000,
        }).start()
    }

    render() {
        const { getUserInfo, error, loading } = this.props
        const { username, password } = this.state
        return (
            <View style={styles.container}>
                {loading ? <CircularProgress color="secondary" style={{position: 'absolute', marginTop: dim.height/2-10, zIndex:100}} /> : null}
                <View style={styles.imgContainer}>
                    <Animated.Image source={Logo} style={{height: 100, width: 100, transform:[{translateX:this.state.moveAnim.interpolate({
                        inputRange:[0,1],
                        outputRange:[-1000, 0]
                    })}]}} />
                </View>
                <View style={{flex:1}}>
                    <Text style={{color: 'red', alignSelf:'center', fontSize: 12}}>{error?"Either Username or Password is incorrect":null}</Text>
                </View>
                <Animated.View style={[styles.login, {transform:[{translateX:this.state.moveAnim.interpolate({
                    inputRange:[0,1],
                    outputRange:[1000,0]
                })}]}]}>
                    <TextField error={error} label="Username" style={{ marginBottom: 10 }} onChange={(e) => {
                        this.setState({ username: e.target.value })
                    }} />
                    <TextField error={error} label="Password" type="password" 
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            this.loginRef.click()
                        }
                    }}
                    onChange={(e) => {
                        this.setState({ password: e.target.value })
                    }} />

                </Animated.View>
                <Animated.View style={{ marginTop: 25, transform:[{translateY: this.state.moveAnim.interpolate({
                    inputRange:[0,1],
                    outputRange:[1000, 0]
                })}] }}>
                    <Button title="Log In" onClick={() => {
                        this.props.clearLoginError()
                        this.props.getAuthToken(username, password, this.props.history, "web")
                        
                        }}
                        buttonRef={ref => this.loginRef=ref}
                        >
                        Log In
                        </Button>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
    },
    imgContainer: {
        flex: 4,
        minHeight: '400px',
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',


    },
    login: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',


    },
    textBox: {
        borderBottomColor: '#23F8A8',
        height: 29,
        marginTop: 20,
        borderBottomWidth: 1,
        outline: 'none'
    }
})
const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    error: state.auth.error
})

const mapDispatchToProps = (dispatch) => ({
    getAuth: (username, password) => getAuthToken(username, password)
})

export default connect(mapStateToProps, { getAuthToken, clearLoginError })(Login)