import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';
import firebase from 'react-native-firebase';

import Toast from 'react-native-simple-toast';

import t from 'tcomb-form-native'; // 0.6.9
import Logo from '../../assets/logo.png';
const Form = t.form.Form;
let options = {
  fields: {
    password: {
      password: true,
      secureTextEntry: true,
    },
  },
};
let User = t.struct({
  user: t.String, // a required string
  password: t.String, // an optional string
});

export default class SignInScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // call getValue() to get the values of the form
    const value = this.refs.form.getValue();
    if (value) {
      // if validation fails, value will be null
      console.log('User is ' + value.user); // value here is an instance of Person
      console.log('Pass is ' + value.password); // value here is an instance of Person

      firebase
        .auth()
        .signInWithEmailAndPassword(value.user, value.password)
        .then(() => Toast.show(`Logged into ${value.user}`))
        .then(() => this.props.navigation.navigate('App'))

        .catch(error => this.setState({ errorMessage: error.message }));
    } else {
      console.log('hi');
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <View>
          <Form ref="form" type={User} options={options} />
          <TouchableHighlight
            style={styles.loginBtn}
            onPress={this.onPress}
            underlayColor="#99d9f4"
          >
            <Text style={styles.btnText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  loginBtn: {
    width: '50%',
    borderColor: 'blue',
    borderWidth: 1,
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50%',
    marginTop: -30,
  },
  logo: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});
