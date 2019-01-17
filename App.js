import React, { Component } from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";

import QRCodeScanner from "./src/screens/QRCodeScanner";
import SignInScreen from "./src/screens/SignInScreen";
import Loading from "./src/screens/Loading";

const AppStack = createStackNavigator({ Home: QRCodeScanner });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
      Load: Loading
    },
    {
      initialRouteName: "App"
    }
  )
);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
