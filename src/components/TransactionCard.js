import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, LayoutAnimation, UIManager, Animated } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { translate } from '../utils/i18n'
import getNumber from '../utils/getNumber'

class TransactionCard extends React.PureComponent {
  constructor(props) {
    super(props)
    const { transAmount, status, date } = this.props.data[1]
    this.transAmount = transAmount
    this.status = status
    this.date = date
    this._animated = new Animated.Value(0)
  }
  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start()
  }
  getDateFormatted = date => {
    const d = new Date(date)
    return ("0" + d.getDate()).slice(-2) + " - " + ("0" + (d.getMonth() + 1)).slice(-2) + " - " +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  render() {
    return (
      <Animated.View style={{
        ...styles.container,
        transform: [
          {
            rotateX: this._animated.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['120deg', '36deg', '0deg'],
              extrapolate: 'clamp',
            })
          }
        ],
        opacity: this._animated.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.4, 1]
        }),
        backgroundColor: this.props.theme === 'light' ? '#f9f9f9' : '#242424',
        borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
        borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
        borderWidth: this.props.theme === 'light' ? 1.05 : 0,
        borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
        borderColor: this.props.theme === 'light' ? '#eee' : null,
      }}>
        <View style={[styles.arrowIconContainer, {
          backgroundColor: this.status === 'Sent' ?
            this.props.theme === 'light' ? '#f6f6f6' : '#363536'
            :
            this.props.theme === 'light' ? '#f6f6f6' : '#2e3b47'
        }]}>
          <FontAwesome
            name={this.status === 'Sent' ? 'arrow-up' : 'arrow-down'}
            color={this.status === 'Sent' ? "#de3b5b" : "#008ee0"}
            size={22}
            style={{ opacity: 0.75 }}
          />
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.upperDataContainer}>
            <Text style={{
              fontSize: 20,
              color: this.props.theme === 'light' ? '#303030' : '#fbfbfb',
              fontFamily: 'SourceSansPro-SemiBold'
            }}>
              {translate('components.transactionCard.' + this.status.toLowerCase())}
            </Text>
            <Text ellipsizeMode="middle" numberOfLines={1} style={{
              flex: 1,
              textAlign: 'right',
              marginLeft: 24,
              fontSize: 19.5,
              fontFamily: 'SourceSansPro-Bold',
              color: this.status === 'Sent' ? "#de3b5b" : "#008ee0"
            }}>
              {" " + getNumber(this.transAmount.toString()) + " "}
            </Text>
            <View style={{ justifyContent: 'flex-end', marginLeft: 2 }}>
              <FontAwesome5 name="coins" color={this.status === 'Sent' ? "#de3b5b" : "#008ee0"} size={13} />
            </View>
          </View>
          <View style={styles.lowerDataContainer}>
            <Text style={{
              ...styles.lowerDataContainerText,
              color: this.props.theme === 'light' ? '#000' : '#aaa'
            }}>
              {this.props.data[0]}
            </Text>
            <Text style={{
              ...styles.lowerDataContainerText,
              color: this.props.theme === 'light' ? '#000' : '#aaa'
            }}>
              <Text style={{ fontSize: 0 }}>dsf</Text>
              {getNumber(this.getDateFormatted(this.date))}
            </Text>
          </View>
        </View>
      </Animated.View>
    )
  }
}

export default TransactionCard

const styles = StyleSheet.create({
  container: {
    height: 75,
    marginVertical: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dimensions.get('window').width / 28
  },
  arrowIconContainer: {
    height: 38,
    width: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginRight: 8
  },
  dataContainer: {
    height: 48,
    paddingLeft: 4,
    flex: 1
  },
  upperDataContainer: {
    height: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lowerDataContainer: {
    height: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lowerDataContainerText: {
    fontSize: 13,
    fontFamily: 'SourceSansPro-Light'
  }
})
