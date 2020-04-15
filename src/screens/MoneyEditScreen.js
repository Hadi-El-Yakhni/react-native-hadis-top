import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { editAccountInfo } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'


class MoneyEditScreen extends React.PureComponent {
  state = {
    name: this.props.name,
    phone: this.props.phone,
    isKeyboardOpened: false
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.container,
          backgroundColor: this.useTheme('#fbfbfb', '#161616')
        }}>
        <View style={{
          ...styles.header,
          backgroundColor: this.useTheme('#fbfbfb', '#161616')
        }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Navigation.pop(this.props.componentId)}
            style={{
              ...styles.backIconContainer,
              backgroundColor: this.useTheme('#fbfbfb', '#161616')
            }}
          >
            <Ionicons name="md-arrow-back" size={26} color={this.useTheme('#303030', '#fbfbfb')} />
          </TouchableOpacity>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#fbfbfb', '#161616')
          }}>
            <Text
              numberOfLines={1}
              style={{
                color: this.useTheme('#303030', '#fbfbfb'),
                fontSize: 25,
                fontFamily: 'SourceSansPro-SemiBold',
                textAlign: 'left'
              }}>
              Edit Info
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <MyInput
            theme={this.props.theme}
            placeHolder="Name"
            leftIcon='ios-person'
            style={{ fontSize: 17, paddingRight: 15 }}
            inputContainerStyle={{ marginTop: 15 }}
            value={this.state.name}
            autoCapitalize="words"
            onChangeText={name => this.setState({ name })}
          />
          <MyInput
            theme={this.props.theme}
            keyboardType="number-pad"
            placeHolder="Phone number (optional)"
            inputContainerStyle={{ marginTop: 10 }}
            leftIcon='ios-call'
            style={{ fontSize: 17, paddingRight: 15 }}
            value={this.state.phone}
            onChangeText={phone => this.setState({ phone })}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.updateButton, {
            marginBottom: this.state.isKeyboardOpened ? 60 : 25
          }]}
          onPress={() => {
            const { accountId, componentId } = this.props
            const { name, phone } = this.state
            this.props.editAccountInfo(accountId, name.trim(), phone, componentId)
          }}
        >
          <Text style={{
            color: '#fbfbfb',
            fontSize: 20,
            fontFamily: 'SourceSansPro-SemiBold'
          }}>
            Save
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 4,
    height: 56,
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    paddingHorizontal: 12,
    marginTop: 10,
    flex: 1
  },
  updateButton: {
    height: 56,
    marginHorizontal: 10,
    backgroundColor: '#008ee0',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 15
  }
})

export default connect(
  ({ app }) => ({ theme: app.theme }),
  { editAccountInfo }
)(MoneyEditScreen)