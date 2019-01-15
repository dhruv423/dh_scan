/** @format */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import QRCodeScanner from "./src/screens/QRCodeScanner";

AppRegistry.registerComponent(appName, () => App);
