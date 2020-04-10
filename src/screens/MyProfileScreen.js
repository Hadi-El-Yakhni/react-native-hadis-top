import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Linking, Modal, Dimensions, ScrollView } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import AsyncStorage from '@react-native-community/async-storage'
import { Navigation } from 'react-native-navigation'
import { goToAuth } from '../navigation/navigation'
import { connect } from 'react-redux'
import { incrementExitCount, resetExitCount } from '../actions'
import { Spinner } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

class MyProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { modalVisible: false, loggingout: false }
    const storedData = ['uid', 'email', 'provider']
    AsyncStorage.multiGet(storedData).then(data => {
      this.setState({
        uid: data[0][1],
        email: data[1][1],
        provider: data[2][1]
      })
    })
  }
  checkExit() {
    if (this.props.exitCount === 0)
      return null
    if (this.props.exitCount === 1) {
      return <View style={{
        borderRadius: 16,
        height: 38,
        width: 190,
        backgroundColor: '#555',
        position: 'absolute',
        zIndex: 1,
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>Press again to exit...</Text>
      </View>
    }
    else if (this.props.exitCount === 2)
      BackHandler.exitApp()
  }
  render() {
    return (
      <View style={styles.container}>
        {this.checkExit()}
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor: this.state.modalVisible ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,1)',
          zIndex: this.state.modalVisible ? 1 : 0
        }]}>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={styles.modal}>
              <View style={styles.upperModal}>
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                  Log out of Boss Dashboard?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false, loggingout: true })
                  LoginManager.logOut()
                  GoogleSignin.signOut()
                  AsyncStorage.clear()
                  this.props.resetTasks()
                  this.props.resetEmployees()
                  this.props.resetAccounts()
                  setTimeout(() => {
                    goToAuth()
                  }, 600);
                }}
                activeOpacity={0.6}
                style={styles.centerModal}
              >
                <Text style={{ color: '#008ee0', fontSize: 18, fontFamily: 'SourceSansPro-SemiBold' }}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                activeOpacity={0.6}
                style={styles.lowerModal}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loggingout}>
          <View style={styles.loadingModalContainer} >
            <View style={styles.loadingModal}>
              <Spinner color='#cccccc' size={26} style={{ marginRight: 15 }} />
              <Text style={{ color: '#eeeeee', fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                logging out...
              </Text>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              Settings
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            activeOpacity={this.state.provider === 'email' ? 0.9 : 1}
            onPress={() => {
              if (this.state.provider === 'email')
                Navigation.push(this.props.componentId, {
                  component: {
                    name: 'forgetPassword',
                    passProps: {
                      email: this.state.email
                    }
                  }
                })
            }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                {
                  this.state.provider === 'email' ?
                    <MaterialIcons name="email" color="#fff" size={24.5} />
                    :
                    this.state.provider === 'facebook' ?
                      <FontAwesome name="facebook-square" color="#1d9de2" size={24.5} />
                      :
                      this.state.provider === 'google' ?
                        <FontAwesome name="google" color="#E53935" size={24.5} />
                        :
                        null
                }
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={{
                    paddingRight: 5,
                    width: Dimensions.get('window').width - 125,
                    color: '#fff',
                    fontSize: 19,
                    fontFamily: 'SourceSansPro-SemiBold',
                    marginLeft: 20
                  }}
                >
                  {this.state.email}
                </Text>
              </View>
              {
                this.state.provider === 'email' ?
                  <View style={{ marginHorizontal: 7 }}>
                    <MaterialIcons name="chevron-right" color="#fff" size={30} />
                  </View>
                  :
                  null
              }
            </View>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, marginBottom: 6, marginTop: 24, color: '#5f5f5f', fontSize: 16, fontFamily: 'SourceSansPro-Regular' }}>
            Settings
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <Entypo name="language" color="#fff" size={24.5} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Language
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <Text style={{ color: '#999', fontSize: 17, fontFamily: 'SourceSansPro-Regular', marginRight: 10 }}>
                  English
              </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="theme-light-dark" color="#fff" size={24.5} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Theme
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <Text style={{ color: '#999', fontSize: 17, fontFamily: 'SourceSansPro-Regular', marginRight: 10 }}>
                  System
              </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, marginBottom: 6, marginTop: 24, color: '#5f5f5f', fontSize: 16, fontFamily: 'SourceSansPro-Regular' }}>
            Developer
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
            onPress={() => Linking.openURL(`mailto:boss.dashboard@gmail.com`)}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="help-circle-outline" color="#fff" size={25} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Help Center
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name="chevron-right" color="#999" size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="message-text" color="#fff" size={24.5} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Feedback
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name="chevron-right" color="#999" size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="coffee-outline" color="#fff" size={25} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Buy Me A Coffee
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name="chevron-right" color="#999" size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, marginBottom: 6, marginTop: 24, color: '#5f5f5f', fontSize: 16, fontFamily: 'SourceSansPro-Regular' }}>
            Privacy
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="lock-outline" color="#fff" size={25} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Privacy Policy
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name="chevron-right" color="#999" size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginBottom: 5 }}
          >
            <View style={{ backgroundColor: '#0b0b0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <Ionicons name="md-paper" color="#fff" size={24} />
                <Text style={{ marginLeft: 20, color: '#fff', fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Terms Of Use
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name="chevron-right" color="#999" size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.logoutButton}
            onPress={() => {
              this.setState({ modalVisible: true })
            }}
          >
            <Text style={styles.logoutText}>
              LOGOUT
          </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal:
      Dimensions.get('window').width > 800 ? 62
        :
        Dimensions.get('window').width > 700 ? 48
          :
          Dimensions.get('window').width > 600 ? 36
            :
            Dimensions.get('window').width > 500 ? 10
              :
              0
  },
  header: {
    marginTop:
      Dimensions.get('window').width > 800 ? 40
        :
        Dimensions.get('window').width > 700 ? 32
          :
          Dimensions.get('window').width > 600 ? 28
            :
            Dimensions.get('window').width > 500 ? 26
              :
              20,
    marginBottom:
      Dimensions.get('window').width > 800 ? 25
        :
        Dimensions.get('window').width > 700 ? 10
          :
          Dimensions.get('window').width > 600 ? 15
            :
            Dimensions.get('window').width > 500 ? 15
              :
              15,
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  logoutButton: {
    backgroundColor: '#0b0b0b',
    height: 56,
    borderBottomWidth: 0.7,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    justifyContent: 'center'
  },
  logoutText: {
    color: '#008ee0',
    fontSize: 19,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  modal: {
    backgroundColor: '#171717',
    height: 168,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 70,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  centerModal: {
    height: 49,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: '#282828',
    borderTopWidth: 0.6,
    borderTopColor: '#282828'
  },
  lowerModal: {
    height: 49,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4
  },
  loadingModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    backgroundColor: '#171717',
    width: 170,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  }
})

const mapStateToProps = ({ exit }) => ({
  exitCount: exit.exitCount
})

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
  incrementExitCount: () => dispatch(incrementExitCount()),
  resetExitCount: () => dispatch(resetExitCount())
})

export default connect(mapStateToProps, mapDiaptchToProps)(MyProfileScreen)