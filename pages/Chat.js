/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {createStackNavigator, NavigationActions} from 'react-navigation'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIOClient from 'socket.io-client'

type Props = {};

class ChatPage extends Component<Props> {
  state={
    messages: [],
  };

  componentWillMount() {
    Chat.mysocket.emit('load_conversation', JSON.stringify({
      '_id': 1,
      'user_id': 1,
      'client_id': 0
    }));

    this.setState({
      messages: [],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    Chat.mysocket.emit('send', JSON.stringify({
      'messages': messages,
      'receiver': 0
    }));
  }

  constructor(props){
    super(props);

    console.log("testing");
    Chat.mysocket.on('update_conversation', messages => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));
      console.debug(messages);
    });
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

const conversations =[];
class Chat extends Component<Props> {
  static mysocket = ScketIOClient('http://localhost:3000');

  constructor(props){
    super(props);
    Chat.mysocket.emit('pull_notifications', JSON.stringify({
      user_id: 1
    }));
    Chat.mysocket.on('pull_notifications', messages=>{
      for(let i = 0; i<messages.length; i++){
        let id = messages[i].Sender._id;
        let name = messages[i].Sender.name;
        let text = messages[i].MessageText;
        conversations[id] = {
          id: id,
          name: name,
          text: text
        }
      }
      this.setState({
        dataArray: conversations
      });
    });

    this.state={
      isLoading: false,
      dataArray: conversations
    };
  }

  loadData() {
    this.setState({
      isLoading: true
    });
    setTimeout(()=>{
      Chat.mysocket.emit('pull_notifications', JSON.stringify({
        user_id: 1
      }));
      this.setState({
        dataArray: conversations,
        isLoading:false
      });
    }, 2000);
  }

  _renderItem(data) {
    const {navigation} = this.props;
    return (
    <TouchableHighlight
      onPress={()=>{
        navigation.navigate('ChatPage', {client_name: data.item.name, showTabBar:false});
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
          data={this.state.dataArray}
          renderItem={(data)=>this._renderItem(data)}
          refreshControl={
            <RefreshControl
              title={"Loading"}
              tintColor={'red'}
              titleColor={'red'}
              refreshing={this.state.isLoading}
              onRefresh={()=>{
                this.loadData()
              }}
            />
          }
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
