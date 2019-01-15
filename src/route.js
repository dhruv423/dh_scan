import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";

import React, { Component } from "react";
import QRCodeScanner from "./screens/QRCodeScanner";
import SignInScreen from "./screens/SignInScreen";

const AppStack = createStackNavigator({ Home: QRCodeScanner });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Auth"
    }
  )
);

export default class route extends Component {
  render() {
    return <AppContainer />;
  }
}
