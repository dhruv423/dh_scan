"use strict";

import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";

export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ""
    };
  }
  onSuccess(e) {
    switch (this.state.action) {
      case "register":
        console.log("registering " + e.data);
        this.scanner.reactivate();
        break;
      case "meal":
        console.log("giving meal to " + e.data);
        this.scanner.reactivate();
        break;
      case "checkin":
        console.log("checking in " + e.data);
        this.scanner.reactivate();
        break;
      case "checkout":
        console.log("checking out " + e.data);
        this.scanner.reactivate();
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
        cameraStyle={{ height: "80%" }}
        topContent={<Text style={styles.centerText}>DeltaHacks</Text>}
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
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleMeal()}
              style={
                this.state.action == "meal"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text style={styles.buttonText}>Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleCheckin()}
              style={
                this.state.action == "checkin"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text style={styles.buttonText}>Check-In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleCheckout()}
              style={
                this.state.action == "checkout"
                  ? styles.activeBtn
                  : styles.buttonTouchable
              }
            >
              <Text style={styles.buttonText}>Check-Out</Text>
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
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});
