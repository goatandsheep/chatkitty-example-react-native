import React, {useContext, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {kitty} from "../chatkitty";
import Loading from "../components/Loading";
import {AuthContext} from "../navigation/AuthProvider";

export default function ChannelScreen({route}) {
  const {user} = useContext(AuthContext);

  const {channel} = route.params;

  const [messagePaginator, setMessagePaginator] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadEarlier, setLoadEarlier] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);

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
        setMessages(currentMessages => GiftedChat.append(currentMessages,
            [mapMessage(message)]));
      }
    });

    kitty.getMessages({
      channel: channel
    }).then(result => {
      setMessagePaginator(result.paginator);

      setMessages(result.paginator.items.map(mapMessage));

      setLoadEarlier(result.paginator.hasNextPage)

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
    });
  }

  async function handleLoadEarlier() {
    if (!messagePaginator.hasNextPage) {
      setLoadEarlier(false);

      return;
    }

    setIsLoadingEarlier(true);

    console.log('loading earlier');

    const nextPaginator = await messagePaginator.nextPage();

    setMessagePaginator(nextPaginator);

    setMessages(currentMessages => GiftedChat.prepend(currentMessages,
        nextPaginator.items.map(mapMessage)));

    setIsLoadingEarlier(false);
  }

  return (
      <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={user}
          loadEarlier={loadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          onLoadEarlier={handleLoadEarlier}
      />
  );
}
