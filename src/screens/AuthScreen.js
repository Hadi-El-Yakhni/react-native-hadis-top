import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  TextInput
} from 'react-native'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import { userSignin, userSignup, userAuthenticateWithFacebook, dsimissAuthError } from '../actions'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Navigation } from 'react-native-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class AuthScreen extends Component {
  constructor() {
    super()
    this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this.state = {
      screen: 'login',
      email: '',
      password: '',
      isPasswordSecure: true,
      isKeyboardOpened: false
    }
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
  }
  onSign = () => {
    const { screen, email, password } = this.state
    if (screen === 'login')
      return this.props.userSignin(email, password)
    this.props.userSignup(email, password)
  }
  renderSignButton() {
    if (!this.props.loading)
      return (
        <MyButton
          style={{ marginTop: 15, marginBottom: 10 }}
          color='#008ee0'
          disabledColor='#355973'
          disabled={!this.state.email || !this.state.password}
          onPress={this.onSign.bind(this)}
        >
          {this.state.screen === 'login' ? 'Log In' : 'Sign Up'}
        </MyButton>
      )
    return (
      <View style={styles.loadingContainer}>
        <Spinner color='#fff' size={33} />
      </View>
    )
  }
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', paddingBottom: Dimensions.get('window').height / 10 }}
        >
          <Text style={styles.title}>Hadi's Top</Text>
          <View style={{ paddingHorizontal: 33 }}>
            <MyInput
              keyboardType='email-address'
              value={this.state.email}
              style={{ paddingHorizontal: 15 }}
              isSecure={false}
              placeHolder='Email'
              isAutoCorrect={true}
              onChangeText={email => this.setState({ email })}
            />
            <View style={[styles.inputContainer, this.props.inputContainerStyle]}>
              {this.props.leftIcon && <Icon name={this.props.leftIcon} style={[styles.iconLeft, this.props.leftIconStyle]} />}
              <TextInput
                value={this.state.password}
                secureTextEntry={this.state.isPasswordSecure}
                style={styles.InputStyle}
                placeholder="Password"
                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                autoCapitalize='none'
                onChangeText={password => this.setState({ password })}
              />
              {
                this.state.password ?
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.rightIconContainer}
                    onPress={() => {
                      this.setState(state => ({ isPasswordSecure: !state.isPasswordSecure }))
                    }}
                  >
                    <MaterialIcons
                      name={this.state.isPasswordSecure ? "visibility-off" : "visibility"}
                      style={{ paddingRight: 10 }}
                      size={21.5}
                      color={this.state.isPasswordSecure ? "#bbb" : "#008ee0"}
                    />
                  </TouchableOpacity>
                  :
                  null
              }
            </View>
            {this.renderSignButton()}
            {this.state.screen === 'login' ?
              <View style={{ flexDirection: 'row', marginBottom: 16, marginTop: 6, alignItems: 'center' }}>
                <View style={{ height: 0, flex: 1, borderColor: '#fff', borderWidth: 0.3 }}></View>
                <Text
                  onPress={() => Navigation.push(this.props.componentId, { component: { name: 'forgetPassword' } })}
                  style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', marginHorizontal: 12 }}
                >
                  Forgot Password?
                  </Text>
                <View style={{ height: 0, flex: 1, borderColor: '#fff', borderWidth: 0.3 }}></View>
              </View>
              :
              null}
            <MyButton
              disabledColor='#355973'
              disabled={this.props.facebookButtonDisabled}
              onPress={this.props.userAuthenticateWithFacebook}
              color='#008ee0'
            >
              <FontAwesome size={22} name="facebook-square" color="#fff" />
              {""}   Continue With Facebook
            </MyButton>
          </View>
          <View style={[styles.switchMethodeOption, { bottom: this.state.isKeyboardOpened ? 30 : 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.switchMethodeText}>
                {this.state.screen === 'login' ? "Don't have an account?" : "Already a member?"}
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  LayoutAnimation.configureNext({
                    update: {
                      duration: 100,
                      type: LayoutAnimation.Types.linear,
                      property: LayoutAnimation.Properties.opacity
                    }
                  })
                  // this.setState({ email: '', password: '', isPasswordSecure: true })
                  this.setState(({ screen }) => {
                    if (screen === 'login')
                      return { screen: 'signup' }
                    return { screen: 'login' }
                  })
                }}
              >
                <Text style={styles.switchMethodeLink}>
                  {this.state.screen === 'login' ? 'Sign up.' : 'Log in.'}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!this.props.error}>
          <View style={styles.errorModalContainer} >
            <View style={styles.errorModal}>
              <View style={styles.upperModalPart}>
                <Text style={{ color: '#eef', fontSize: 20, fontWeight: 'bold' }}>Error</Text>
                <Text style={{
                  textAlign: 'center',
                  color: '#bbb',
                  fontSize: 12,
                  marginTop: 12
                }}>{this.props.error}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.lowerModalPart}
                onPress={() => this.props.dsimissAuthError()}
              >
                <Text style={{ color: '#008ee0', fontSize: 16 }}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center'
  },
  title: {
    marginBottom: 25,
    color: '#fff',
    fontSize: 44,
    alignSelf: 'center',
    fontFamily: 'PermanentMarker-Regular'
  },
  switchMethodeOption: {
    position: 'absolute',
    height: 50,
    width: Dimensions.get('window').width,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchMethodeText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4
  },
  switchMethodeLink: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: 'bold'
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#008ee0',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center'
  },
  errorModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorModal: {
    borderRadius: 6,
    backgroundColor: '#272727',
    width: 250,
    paddingTop: 7,
    justifyContent: 'center'
  },
  upperModalPart: {
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#363636'
  },
  lowerModalPart: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2
  },
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  InputStyle: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 15
  },
  rightIconContainer: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapActionsToProps = dispatch => ({
  userSignin: (email, password) => dispatch(userSignin(email, password)),
  userSignup: (email, password) => dispatch(userSignup(email, password)),
  userAuthenticateWithFacebook: () => dispatch(userAuthenticateWithFacebook()),
  dsimissAuthError: () => dispatch(dsimissAuthError())
})

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading,
    facebookButtonDisabled: state.auth.facebookButtonDisabled
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AuthScreen)