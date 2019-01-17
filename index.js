/** @format */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

console.disableYellowBox = true; //get rid of pesky warnings
AppRegistry.registerComponent(appName, () => App);
