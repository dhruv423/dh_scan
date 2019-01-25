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
      location: "",
      checkInDetails: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          title="Sign out"
          onPress={navigation.getParam("signOut")}
          color="#EC4E53"
          style={{ marginRight: 10 }}
        />
      ),
      headerTitle: (
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <Image
            source={Logo}
            style={{ marginLeft: 10, marginRight: 10, width: 40, height: 40 }}
          />
          <Text style={{ fontSize: 30 }}>DeltaHacks V</Text>
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

  async getAttendeeData(email) {
    return firebase
      .firestore()
      .collection("hackathon")
      .doc("DH5")
      .collection("Checked In")
      .doc(email)
      .get();
  }

  async onSuccess(e) {
    let attendeeEmailAddress = e.data.length >= 37 ? e.data.slice(37) : "";
    let attendee = await this.getAttendeeData(attendeeEmailAddress);

    switch (this.state.action) {
      case "register":
        console.log("registering " + e.data);
        firebase
          .firestore()
          .collection("hackathon")
          .doc("DH5")
          .collection("FrontDesk")
          .doc(firebase.auth().currentUser.email)
          .set(
            { scanned: e.data.length >= 37 ? e.data.slice(37) : "" },
            { merge: true }
          )
          .then(() => {
            ToastAndroid.show(
              `Beaming attendee info! ${
                e.data.length >= 37 ? e.data.slice(37) : "Invalid QR Code"
              }`,
              ToastAndroid.LONG
            );
          })
          .catch(err => {
            ToastAndroid.show(
              "Error connecting to the databse, contact kumail",
              ToastAndroid.LONG
            );
          });

        break;
      case "meal":
        console.log("giving meal to " + e.data);

        console.log("DATA", attendee.data());

        firebase
          .firestore()
          .collection("hackathon")
          .doc("DH5")
          .collection("Checked In")
          .doc(attendeeEmailAddress)
          .set({ meals: attendee.data().meals + 1 }, { merge: true })
          .then(() => {
            ToastAndroid.show(
              `Updated meal for ${attendeeEmailAddress}`,
              ToastAndroid.LONG
            );
          })
          .catch(err => {
            ToastAndroid.show(
              "Error connecting to the databse (meal), contact kumail",
              ToastAndroid.LONG
            );
          });
        ToastAndroid.show(
          `Adding a meal for ${
            e.data.length >= 37 ? e.data.slice(37) : "Invalid QR Code"
          } ${firebase.auth().currentUser.email}`,
          ToastAndroid.LONG
        );

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

            let updatedWhereabouts = attendee.data().whereabouts;
            updatedWhereabouts.push({
              building: "Thode",
              by: firebase.auth().currentUser.email,
              initialCheckin: true,
              time: new Date().toLocaleString(),
              type: "incoming",
              position: {
                speed: position.coords.speed,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
              }
            });

            firebase
              .firestore()
              .collection("hackathon")
              .doc("DH5")
              .collection("Checked In")
              .doc(attendeeEmailAddress)
              .set({ whereabouts: updatedWhereabouts }, { merge: true })
              .then(() => {
                ToastAndroid.show(
                  `Updated whereabouts for ${attendeeEmailAddress}`,
                  ToastAndroid.LONG
                );
              })
              .catch(err => {
                ToastAndroid.show(
                  "Error connecting to the databse (meal), contact kumail",
                  ToastAndroid.LONG
                );
              });
            ToastAndroid.show(
              `Checking in ${
                e.data.length >= 37 ? e.data.slice(37) : "Invalid QR Code"
              } at ${location}`,
              ToastAndroid.LONG
            );
          },
          error => {
            console.log("Error with locaation ", error);
            ToastAndroid.show(
              "Error checking in person (firestore or location), check with Kumail",
              ToastAndroid.LONG
            );
            alert(error.message);
          },
          { enableHighAccuracy: true, timeout: 20000 }
        );
        break;
      case "checkout":
        console.log("checking out " + e.data);
        navigator.geolocation.getCurrentPosition(
          position => {
            const location = JSON.stringify(position);

            let updatedWhereabouts = attendee.data().whereabouts;
            updatedWhereabouts.push({
              building: "Thode",
              by: firebase.auth().currentUser.email,
              initialCheckin: true,
              time: new Date().toLocaleString(),
              type: "outbound",
              position: {
                speed: position.coords.speed,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
              }
            });

            firebase
              .firestore()
              .collection("hackathon")
              .doc("DH5")
              .collection("Checked In")
              .doc(attendeeEmailAddress)
              .set({ whereabouts: updatedWhereabouts }, { merge: true })
              .then(() => {
                ToastAndroid.show(
                  `Updated whereabouts for ${attendeeEmailAddress}`,
                  ToastAndroid.LONG
                );
              })
              .catch(err => {
                ToastAndroid.show(
                  "Error connecting to the databse (meal), contact kumail",
                  ToastAndroid.LONG
                );
              });
            ToastAndroid.show(
              `Checking out ${
                e.data.length >= 37 ? e.data.slice(37) : "Invalid QR Code"
              } at ${location}`,
              ToastAndroid.LONG
            );
          },
          error => {
            console.log("Error with locaation ", error);
            ToastAndroid.show(
              "Error checking out person (firestore or location), check with Kumail",
              ToastAndroid.LONG
            );
            alert(error.message);
          },
          { enableHighAccuracy: true, timeout: 20000 }
        );
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
            <Button
              title="Register"
              onPress={() => this.handleRegister()}
              color={this.state.action === "register" ? "#FCDA66" : "#2DAFCF"}
            />
            <Button
              title="Meal"
              onPress={() => this.handleMeal()}
              color={this.state.action === "meal" ? "#FCDA66" : "#2DAFCF"}
            />
            <Button
              title="Check In"
              onPress={() => this.handleCheckin()}
              onLongPress={() => this.setState({ checkInDetails: true })}
              color={this.state.action === "checkin" ? "#FCDA66" : "#2DAFCF"}
            />
            <Button
              title="Check Out"
              onPress={() => this.handleCheckout()}
              color={this.state.action === "checkout" ? "#FCDA66" : "#2DAFCF"}
            />
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
    color: "blue",
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
    borderRadius: 5,

    //backgroundColor: 'blue',
    //borderColor: 'white',
    //borderWidth: 1,
    //borderRadius: 12,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    //padding: 12,
    textAlign: "center"
  },
  activeBtn: {
    padding: 5,
    margin: 0,
    backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "lightblue",
    borderRadius: 5
  },
  activeButtonText: {
    fontSize: 22,
    color: "rgb(255,255,255)"
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  }
});
