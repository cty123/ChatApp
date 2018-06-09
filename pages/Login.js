import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Button, StyleSheet
} from 'react-native';

export default class Login extends Component {

  render() {
    return (
      <ScrollView style={{padding: 20}}>
        <Text
          style={{fontSize: 27}}>
          Login
        </Text>
        <TextInput style={styles.username} placeholder='Username' />
        <TextInput style={styles.password} placeholder='Password' />
        <View style={{margin:7}} />
        <Button
          onPress={this.props.onLoginPress}
          title="Login"
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  username: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'gray'
  },
  password: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 30,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'gray'
  }
});