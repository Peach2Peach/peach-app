// This code originated from https://github.com/moaazsidat/react-native-qrcode-scanner
// It is included here, because relying on this library broke the implementation.

import { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
  Easing,
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'

import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { RNCamera as Camera } from 'react-native-camera'

const CAMERA_FLASH_MODE = Camera.Constants.FlashMode

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
})


export default class QRCodeScanner extends Component {
  static propTypes = {
    cameraStyle: PropTypes.any,
    onRead: PropTypes.func.isRequired,
    customMarker: PropTypes.element,
    notAuthorizedView: PropTypes.element,
    cameraTimeoutView: PropTypes.element,
  }

  static defaultProps = {
    onRead: () => null,
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          Camera not authorized
        </Text>
      </View>
    ),
    pendingAuthorizationView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          ...
        </Text>
      </View>
    ),
    cameraTimeoutView: (
      <View
        style={{
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          backgroundColor: 'black',
        }}
      >
        <Text style={{ color: 'white' }}>Tap to activate camera</Text>
      </View>
    ),
  }

  constructor (props) {
    super(props)
    this.state = {
      scanning: false,
      isCameraActivated: true,
      fadeInOpacity: new Animated.Value(0),
      isAuthorized: false,
      isAuthorizationChecked: false,
      disableVibrationByUser: false,
    }
    this.timer = null
    this._scannerTimeout = null
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
  }

  componentDidMount () {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then((cameraStatus) => {
        this.setState({
          isAuthorized: cameraStatus === RESULTS.GRANTED,
          isAuthorizationChecked: true,
        })
      })
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true })
    }

    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(this.state.fadeInOpacity, {
        toValue: 1,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start()

  }

  componentWillUnmount () {
    if (this._scannerTimeout !== null) {
      clearTimeout(this._scannerTimeout)
    }
    if (this.timer !== null) {
      clearTimeout(this.timer)
    }
    this.timer = null
    this._scannerTimeout = null
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  _setCamera (value) {
    this.setState(
      {
        isCameraActivated: value,
        scanning: false,
        fadeInOpacity: new Animated.Value(0),
      },
      () => {
        if (value) {
          Animated.sequence([
            Animated.delay(10),
            Animated.timing(this.state.fadeInOpacity, {
              toValue: 1,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start()
        }
      },
    )
  }

  _handleBarCodeRead (e) {
    if (!this.state.scanning && !this.state.disableVibrationByUser) {
      Vibration.vibrate()
      this._setScanning(true)
      this.props.onRead(e)
    }
  }

  _renderCameraMarker () {
    return this.props.customMarker
  }

  _renderCameraComponent () {
    return (
      <Camera
        androidCameraPermissionOptions={{
          title: 'Info',
          message: 'Need camera permission',
          buttonPositive: 'OK',
        }}
        style={[styles.camera, this.props.cameraStyle]}
        onBarCodeRead={this._handleBarCodeRead.bind(this)}
        type={'back'}
        flashMode={CAMERA_FLASH_MODE.auto}
        captureAudio={false}
      >
        {this._renderCameraMarker()}
      </Camera>
    )
  }

  _renderCamera () {
    const {
      notAuthorizedView,
      pendingAuthorizationView,
      cameraTimeoutView,
    } = this.props

    if (!this.state.isCameraActivated) {
      return (
        <TouchableWithoutFeedback onPress={() => this._setCamera(true)}>
          {cameraTimeoutView}
        </TouchableWithoutFeedback>
      )
    }

    const { isAuthorized, isAuthorizationChecked } = this.state
    if (isAuthorized) {
      return (
        <Animated.View
          style={{
            opacity: this.state.fadeInOpacity,
            backgroundColor: 'transparent',
            height:
              (this.props.cameraStyle && this.props.cameraStyle.height)
              || styles.camera.height,
          }}
        >
          {this._renderCameraComponent()}
        </Animated.View>
      )
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView
    }
    return notAuthorizedView

  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.infoView} />
        <View>
          {this._renderCamera()}
        </View>
        <View style={styles.infoView} />
      </View>
    )
  }
}
