import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import firebase from "react-native-firebase";

import t from "tcomb-form-native"; // 0.6.9
const Form = t.form.Form;

let User = t.struct({
  user: t.String, // a required string
  password: t.String // an optional string
});

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
      console.log("User is test@gmail.com" + value.user); // value here is an instance of Person
      console.log("Pass is test123" + value.password); // value here is an instance of Person

      firebase
        .auth()
        .signInWithEmailAndPassword("test@gmail.com", "test123")
        .then(() =>
          console.log("I FUCKING LOGGED INTO FIREBASE!!!!!!!!!!!!!!!!!")
        )
        //this.props.navigation.navigate("Main"))
        .catch(error => this.setState({ errorMessage: error.message }));
    } else {
      console.log("hi");
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/* display */}
        <Form ref="form" type={User} />
        <TouchableHighlight
          style={styles.loginBtn}
          onPress={this.onPress}
          underlayColor="#99d9f4"
        >
          <Text style={styles.btnText}>Login</Text>
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
  },
  loginBtn: {
    width: "50%",
    borderColor: "blue",
    borderWidth: 1
  },
  btnText: {
    fontSize: 20,
    textAlign: "center"
  }
});
