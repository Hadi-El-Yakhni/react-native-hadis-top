import React, { Component } from 'react'
import { Text, StyleSheet, View, Linking, InteractionManager, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { updateEmployeeInfo, deleteEmployee } from '../actions'
import { Spinner } from 'native-base'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeDetailsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false, modalVisible: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.uid = this.props.uid
      const { data: { name, role, salary, phone, email } } = this.props
      this.setState({ canRender: true, name, role, salary, phone, email })
    })
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false })
            }}>
            <View
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center' }}
            >
              <View style={styles.modal}>
                <View style={styles.upperModal}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 7, textAlign: 'center', color: '#eeeeee', fontSize: 17 }}>
                    Delete this employee?
                  </Text>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#eeeeee', fontSize: 15 }}>
                    This action cannot be undo.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                    }}
                    style={[styles.modalButton, { borderBottomLeftRadius: 4 }]}>
                    <Text style={{ color: '#eeeeee', fontSize: 18, fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                      this.props.deleteEmployee(this.props.componentId, { uid: this.uid })
                    }}
                    style={[styles.modalButton, { borderBottomRightRadius: 4 }]}>
                    <Text style={{ color: '#e65100', fontSize: 18, fontWeight: 'bold' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.updatingEmployee}>
            <View style={styles.loadingModalContainer} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Updating...</Text>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.deletingEmployee}>
            <View style={[styles.loadingModalContainer]} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Deleting...</Text>
              </View>
            </View>
          </Modal>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => Navigation.pop(this.props.componentId)} style={styles.backIconContainer}>
              <Ionicons name="md-arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={{ color: '#fff', fontSize: 22.5, fontWeight: 'bold' }}>
                Task Details
            </Text>
            </View>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <MyInput
              leftIcon='ios-person'
              value={this.state.name}
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Name'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ name: value })}
            />
            <MyInput
              value={this.state.role}
              leftIcon='ios-briefcase'
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Role'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ role: value })}
            />
            <MyInput
              keyboardType="decimal-pad"
              value={this.state.salary}
              leftIcon='ios-cash'
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Salary'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ salary: value })}
            />
            <MyInput
              keyboardType="number-pad"
              value={this.state.phone}
              leftIcon='ios-call'
              rightIcon='ios-arrow-forward'
              rightIconStyle={{ color: '#c5c5c5' }}
              onRightIconPress={() => Linking.openURL(`tel:${this.state.phone}`)}
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Phone'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ phone: value })}
            />
            <MyInput
              keyboardType="email-address"
              value={this.state.email}
              leftIcon='ios-mail'
              rightIcon='ios-arrow-forward'
              rightIconStyle={{ color: '#c5c5c5' }}
              onRightIconPress={() => { Linking.openURL(`mailto:${this.state.email}`) }}
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Email'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ email: value })}
            />
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <MyButton
                style={{ marginBottom: 10, height: 50 }}
                color='#008ee0'
                textStyle={{ fontSize: 20 }}
                onPress={() => {
                  const { name, role, salary, phone, email } = this.state
                  this.props.updateEmployeeInfo(this.props.componentId, { name, role, salary, phone, email, uid: this.uid })
                }}
              >Save</MyButton>
              <MyButton
                style={{ marginBottom: 20, height: 50 }}
                color='#e65100'
                textStyle={{ fontSize: 20 }}
                onPress={() => this.setState({ modalVisible: true })}
              >Delete</MyButton>
            </View>
          </View>
        </View>
        :
        <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#008ee0" size={38} />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000',
    marginBottom: 15,
    paddingHorizontal: 4
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  backIconContainer: {
    width: 42,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#171717',
    width: 250,
    height: 135,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 90,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center'
  },
  modalButton: {
    height: 45,
    width: 125,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.6,
    borderTopColor: '#282828'
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
    width: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  }
})

const mapDispatchToProps = dispatch => ({
  updateEmployeeInfo: (componentId, { name, role, salary, phone, email, uid }) => dispatch(updateEmployeeInfo(componentId, { name, role, salary, phone, email, uid })),
  deleteEmployee: (componentId, { uid }) => dispatch(deleteEmployee(componentId, { uid }))
})

const mapStateToProps = state => ({
  updatingEmployee: state.employees.updatingEmployee,
  deletingEmployee: state.employees.deletingEmployee
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetailsScreen)