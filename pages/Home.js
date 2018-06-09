/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from 'react-native';
import Login from './Login'

type Props = {};
export default class Home extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return <Login
      onLoginPress={() => {
        navigation.navigate('AppTab');
      }}
    />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
