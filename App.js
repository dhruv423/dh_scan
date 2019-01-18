import React, { Component } from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";

import ScanScreen from "./src/screens/ScanScreen";
import SignInScreen from "./src/screens/SignInScreen";
import Loading from "./src/screens/Loading";

const AppStack = createStackNavigator({ Home: ScanScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
      Load: Loading
    },
    {
      initialRouteName: "Load"
    }
  )
);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
