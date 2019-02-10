import React from 'react';
import { Platform, StatusBar, StyleSheet, View, WebView, ActivityIndicator, BackHandler } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import {BlurView} from 'expo'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    url: 'http://moojmaro.com/'
  };

  webView = {
    canGoBack: false,
    ref: null,
  }

  componentDidMount(){
    const self = this
    BackHandler.addEventListener('hardwareBackPress', function() {
      // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
      if (self.webView.canGoBack && self.webView.ref) {
        self.webView.ref.goBack()
        return true
      }
    })
  }

  render() {
    return (
      <View style = {styles.container}>
        {!this.state.isLoadingComplete &&
          <BlurView tint = 'dark' style={styles.loading}>
            <ActivityIndicator size='large' color="#FB8725"  />
          </BlurView>
        }
        <WebView
          ref={webView => this.webView.ref = webView }
          onNavigationStateChange={navState => this.webView.canGoBack = navState.canGoBack }
          onLoad={() => this.setState({isLoadingComplete:true}) }
          onLoadStart={() => this.setState({isLoadingComplete:false})}
          source={{uri: this.state.url}}
          style={{marginTop: 25}}
        />
      </View>
    )
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:1
  }
})