import React, {useContext, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {kitty} from "../chatkitty";
import Loading from "../components/Loading";
import {AuthContext} from "../navigation/AuthProvider";

export default function ChannelScreen({route}) {
  const {user} = useContext(AuthContext);

  const {channel} = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  function mapMessage(message) {
    return {
      _id: message.id,
      text: message.body,
      createdAt: new Date(message.createdTime),
      user: {
        _id: message.user.name,
        name: message.user.displayName,
        avatar: message.user.displayPictureUrl
      }
    }
  }

  useEffect(() => {
    let result = kitty.startChannelSession({
      channel: channel,
      onReceivedMessage: message => {
        setMessages(previousMessages => GiftedChat.append(previousMessages,
            [mapMessage(message)]));
      }
    });

    kitty.getMessages({
      channel: channel
    }).then(result => {
      setMessages(result.paginator.items.map(mapMessage));

      setLoading(false);
    })

    return result.session.unsubscribe;
  }, [])

  if (loading) {
    return <Loading/>;
  }

  async function handleSend(messages) {
    await kitty.createMessage({
      channel: channel,
      body: messages[0].text
    })
  }

  return (
      <GiftedChat
          messages={messages}
          onSend={newMessage => handleSend(newMessage)}
          user={user}
      />
  );
}
