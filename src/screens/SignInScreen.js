import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

import t from "tcomb-form-native"; // 0.6.9
const Form = t.form.Form;

let User = t.struct({
  user: t.String, // a required string
  password: t.String // an optional string
});

const dummyData = [{ id: 1, name: "meagan" }, { id: 2, name: "sam" }, { id: 3, name: "lauren" }];
export default class SignInScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      array: []
    };

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // call getValue() to get the values of the form
    const value = this.refs.form.getValue();
    if (value) {
      // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    } else {
      console.log("hi");
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/* display */}
        <Form ref="form" type={User} />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffffff"
  }
});
