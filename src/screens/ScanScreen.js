"use strict";

import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Button,
  Image,
  ToastAndroid,
  PermissionsAndroid
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import firebase from "react-native-firebase";

import Logo from "../../assets/logo.png";

export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "meal",
      location: ""
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          title="Sign out"
          onPress={navigation.getParam("signOut")}
          color="red"
        />
      ),
      headerTitle: (
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <Text style={{ fontSize: 30 }}>DeltaHacks V</Text>
          <Image source={Logo} style={{ width: 40, height: 40 }} />
        </View>
      )
    };
  };
  componentDidMount() {
    this.props.navigation.setParams({ signOut: () => this.signOut() });
  }

  signOut() {
    console.log("signing out..");

    try {
      firebase.auth().signOut();
      this.props.navigation.navigate("Load");
    } catch (e) {
      console.log(e);
    }
  }

  onSuccess(e) {
    switch (this.state.action) {
      case "register":
        console.log("registering " + e.data);
        ToastAndroid.show(`Beaming attendee info! ${e.data.length >= 37 ? e.data.slice(37) : 'Invalid QR Code'}`, ToastAndroid.SHORT);
        //this.scanner.reactivate();
        break;
      case "meal":
        console.log("giving meal to " + e.data);
        ToastAndroid.show(`Adding a meal for ${e.data.length >= 37 ? e.data.slice(37) : 'Invalid QR Code'}`, ToastAndroid.LONG);

/*         const ref = firebase
          .firestore()
          .collection("meals")
          .doc(e.data);
        firebase.firestore().runTransaction(async transaction => {
          const doc = await transaction.get(ref);

          if (!doc.exists) {
            transaction.set(ref, { mealnum: 3 });
            // return the new value so we know what the new population is
            console.log(e.data + " now has " + mealnum + " meals");
          }

          // exists already so lets increment it + 1
          const newNumMeals = doc.data().mealnum - 1;

          transaction.update(ref, {
            mealnum: newNumMeals
          });

          // return the new value so we know what the new population is

          console.log(e.data + " now has " + newNumMeals + " meals");
        }); */
        //this.scanner.reactivate();
        break;
      case "checkin":
        console.log("checking in " + e.data);
        navigator.geolocation.getCurrentPosition(
          position => {
            const location = JSON.stringify(position);
            ToastAndroid.show(`Checking in ${e.data.length >= 37 ? e.data.slice(37) : 'Invalid QR Code'} at ${location}`, ToastAndroid.LONG);
          },
          error => alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        break;

        //this.scanner.reactivate();
      case "checkout":
        console.log("checking out " + e.data);
        ToastAndroid.show(`Checking out ${e.data.length >= 37 ? e.data.slice(37) : 'Invalid QR Code'}`,  ToastAndroid.SHORT);

        //this.scanner.reactivate();
        break;

      default:
        Linking.openURL(e.data).catch(err =>
          console.error("An error occured", err)
        );
        break;
    }
  }
  handleRegister() {
    console.log("Registered");
    this.setState({
      action: "register"
    });
  }
  handleMeal() {
    console.log("Meal");
    this.setState({
      action: "meal"
    });
  }
  handleCheckin() {
    console.log("Checked in");
    this.setState({
      action: "checkin"
    });
  }
  handleCheckout() {
    console.log("handle Checkout");
    this.setState({
      action: "checkout"
    });
  }
  render() {
    return (
      <QRCodeScanner
        ref={node => {
          this.scanner = node;
        }}
        onRead={this.onSuccess.bind(this)}
        reactivate={true}
        reactivateTimeout={3000}
        cameraStyle={{ height: "80%" }}
        bottomContent={
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => this.handleRegister()}
              style={
                this.state.action == "register"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text
                style={
                  this.state.action == "register"
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleMeal()}
              style={
                this.state.action == "meal"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text
                style={
                  this.state.action == "meal"
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                Meal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleCheckin()}
              style={
                this.state.action == "checkin"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text
                style={
                  this.state.action == "checkin"
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                Check-In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleCheckout()}
              style={
                this.state.action == "checkout"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text
                style={
                  this.state.action == "checkout"
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                Check-Out
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    color: "#777",
    fontWeight: "500"
  },
  buttonText: {
    fontSize: 22,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 5,
    margin: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5
  },
  activeBtn: {
    padding: 5,
    margin: 0,
    backgroundColor: "blue",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5
  },
  activeButtonText: {
    fontSize: 22,
    color: "rgb(255,255,255)"
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});
