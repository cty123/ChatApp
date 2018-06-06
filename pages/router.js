import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {createSwitchNavigator, createBottomTabNavigator} from 'react-navigation'

import {ChatNavi} from './Chat'
import Home from './Home'
import Contact from './Contact'
import Explore from './Explore'
import Me from './Me'

const color = 'grey';
const AppTabNavigation = createBottomTabNavigator({
  ChatNavi: {
    screen: ChatNavi,
    navigationOptions:({navigation}) => {
      const showTabBar = navigation.state && navigation.state.routes && navigation.state.routes[1]
      && navigation.state.routes[1].params ? navigation.state.routes[1].params.showTabBar : true;
      return {
        title: "Chat",
        tabBarIcon: ({focused}) => (
          <Ionicons
            name={focused ? 'ios-text' : 'ios-text-outline'}
            size={26}
            style={{color: color}}
          />
        ),
        tabBarVisible: showTabBar,
      }
    }
  },
  Contact: {
    screen:  Contact,
    navigationOptions: {
      title: "Contact",
      tabBarIcon: ({focused}) => (
        <Ionicons
          name={focused ? 'ios-contacts' : 'ios-contacts-outline'}
          size={26}
          style={{color: color}}
        />
      )
    }
  },
  Explore: {
    screen: Explore,
    navigationOptions: {
      title: "Explore",
      tabBarIcon: ({focused}) => (
        <Ionicons
          name={focused ? 'ios-compass' : 'ios-compass-outline'}
          size={26}
          style={{color: color}}
        />
      )
    }
  },
  Me: {
    screen: Me,
    navigationOptions: {
      title: "Explore",
      tabBarIcon: ({focused}) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={26}
          style={{color: color}}
        />
      )
    }
  }
});

export const AppSwitchNavigator = createSwitchNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home'
    }
  },
  AppTab: {
    screen: AppTabNavigation,
    navigationOptions: {
      title: 'AppTab'
    }
  }
});
