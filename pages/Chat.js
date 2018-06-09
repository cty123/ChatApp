/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {createStackNavigator} from 'react-navigation'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableHighlight,
  AsyncStorage

} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIOClient from 'socket.io-client'

type Props = {};
let mysocket;

let msgs = [];
class ChatPage extends Component<Props> {
  state={
    messages: [],
  };

  componentWillMount() {
    AsyncStorage.getItem("Messages:" + this.props.navigation.state.params._id)
      .then(req => JSON.parse(req))
      .then(json => {
        if (json) {
          msgs = json;
          this.setState({messages: msgs});
        }
      })
  }

  componentDidMount(){
    mysocket.on('update_conversation', messages => {
      if (msgs && messages.length !== msgs.length ){
        msgs = messages;
        AsyncStorage.setItem("Messages:" + this.props.navigation.state.params._id, JSON.stringify(msgs));
        this.setState({
          messages: msgs
        })
      }
    });

    mysocket.emit('update_conversation', JSON.stringify({
      'user_id': 1,
      'client_id': this.props.navigation.state.params._id
    }));
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    mysocket.emit('send', JSON.stringify({
      'messages': messages,
      'receiver': 0
    }));
  }

  render(){
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}

let conversations =[];
class Chat extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: conversations,
      isLoading: false,
    }
  }

  componentWillMount(){
    AsyncStorage.getItem('Notifications')
      .then(req => JSON.parse(req))
      .then(json => {
        if (json) {
          conversations = json;
          this.setState({dataArray: conversations});
        }
      })
  }

  componentDidMount(){
    // Establish connection
    mysocket = SocketIOClient('http://localhost:3000');

    // Set up listener
    mysocket.on('new_message', message => {
      let id = message.Sender._id;
      conversations[id] = {
        id: id,
        name: message.Sender.name,
        text: message.Sender.MessageText,
      };
      AsyncStorage.setItem('Notifications', JSON.stringify(conversations));
      this.setState({
        dataArray: conversations
      });
    });

    // Set up listener
    mysocket.on('pull_notifications', messages=>{
      for(let i = 0; i<messages.length; i++){
        let id = messages[i].Sender._id;
        conversations[id] = {
          id: id,
          name: messages[i].Sender.name,
          text: messages[i].MessageText,
        };
      }

      AsyncStorage.setItem('Notifications', JSON.stringify(conversations));
      this.setState({
        dataArray: conversations
      });
    });

    // Request update
    mysocket.emit('pull_notifications', JSON.stringify({user_id:1}));
  }

  _renderItem(data) {
    const {navigation} = this.props;
    return (
    <TouchableHighlight
      onPress={()=>{
        navigation.navigate('ChatPage', {_id: data.item.id, client_name: data.item.name, showTabBar:false});
      }}
    >
    <View style={styles.item}>
      <Image
        source={require('../res/if_32_171485.png')}
        style={styles.image}
      />
      <View style={styles.itemMeta}>
        <Text style={{
          fontSize: 20
        }}
        >{data.item.name}</Text>
        <Text style={{fontSize: 14,
          color: "#111"}}>
          {data.item.text}
        </Text>
      </View>
    </View>
    </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          extraData={this.state}
          data={this.state.dataArray}
          renderItem={(data)=>this._renderItem(data)}
        />
      </View>
    );
  }
}

export const ChatNavi = createStackNavigator({
  Home: {
    screen: Chat,
    navigationOptions: {
      title: 'ChatApp',
    }
  },
  ChatPage: {
    screen: ChatPage,
    navigationOptions: ({navigation})=> ({
      title: navigation.state.params.client_name
    })
  }
},{
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'grey',
    },
    headerTintColor: '#fff',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  item: {
    flex: 1,
    backgroundColor: '#FFF',
    height:60,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    paddingBottom: 5,
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10
  },
  itemMeta: {
    marginLeft: 10,
    justifyContent: 'center',
  },
});
