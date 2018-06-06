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
  Button
} from 'react-native';

type Props = {};
export default class Home extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text>Home Page</Text>
        <Button
          title={"Go to main page"}
          onPress={()=>{
            navigation.navigate('AppTab')
          }}
        />
      </View>
    );
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
