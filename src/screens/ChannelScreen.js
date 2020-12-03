import React, {useContext, useEffect, useState} from 'react';
import {Actions, Bubble, GiftedChat} from 'react-native-gifted-chat';
import {kitty} from '../chatkitty';
import Loading from '../components/Loading';
import {AuthContext} from '../navigation/AuthProvider';
import * as DocumentPicker from 'expo-document-picker';
import {Video} from 'expo-av';
import {View} from "react-native-web";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ChannelScreen({route}) {
  const {user} = useContext(AuthContext);

  const chatUser = mapUser(user);

  const {channel} = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadEarlier, setLoadEarlier] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [messagePaginator, setMessagePaginator] = useState(null);

  function mapUser(user) {
    return {
      _id: user.name,
      name: user.displayName,
      avatar: user.displayPictureUrl,
    };
  }

  function mapMessage(message) {
    let giftedMessage = {
      _id: message.id,
      text: message.body,
      createdAt: new Date(message.createdTime),
      user: mapUser(message.user),
    };

    let file = message.file

    if (file) {
      if (/image\/*/.test(file.contentType)) {
        giftedMessage.image = file.url;
      }

      if (/video\/*/.test(file.contentType)) {
        giftedMessage.video = file.url;
      }
    }

    return giftedMessage;
  }

  function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#d3d3d3'
              }
            }}
        />
    )
  }

  useEffect(() => {
    let result = kitty.startChatSession({
      channel: channel,
      onReceivedMessage: (message) => {
        setMessages((currentMessages) =>
            GiftedChat.append(currentMessages, [mapMessage(message)])
        );
      },
    });

    kitty
    .getMessages({
      channel: channel,
    })
    .then((result) => {
      setMessages(result.paginator.items.map(mapMessage));

      setMessagePaginator(result.paginator);
      setLoadEarlier(result.paginator.hasNextPage)

      setLoading(false);
    });

    return result.session.end;
  }, []);

  if (loading) {
    return <Loading/>;
  }

  async function handleSend(messages) {
    await kitty.sendMessage({
      channel: channel,
      body: messages[0].text,
    });
  }

  async function handleLoadEarlier() {
    if (!messagePaginator.hasNextPage) {
      setLoadEarlier(false);

      return;
    }

    setIsLoadingEarlier(true);

    const nextPaginator = await messagePaginator.nextPage();

    setMessagePaginator(nextPaginator);

    setMessages(currentMessages => GiftedChat.prepend(currentMessages,
        nextPaginator.items.map(mapMessage)));

    setIsLoadingEarlier(false);
  }

  const renderActions = (props) => (
      <Actions
          {...props}
          containerStyle={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 4,
            marginRight: 4,
            marginBottom: 0,
          }}
          icon={() => (
              <Ionicons name="ios-attach" size={24} color="black"/>
          )}
          options={{
            'Choose From Library': async () => {
              const fileResult = await DocumentPicker.getDocumentAsync({
                type: "image/*;video/*"
              });

              if (fileResult.type === 'success') {
                await kitty.sendMessage({
                  channel: channel,
                  file: fileResult.file,
                  progressListener: {
                    onStarted: () => {
                      setLoading(true);
                    },

                    onProgress: (progress) => {
                      console.log("Upload progress: " + progress * 100 + "%")
                    },

                    onCompleted: (result) => {
                      setLoading(false);
                    }
                  }
                });
              }
            },
            Cancel: () => {
              console.log('Cancel');
            },
          }}
          optionTintColor="#222B45"
      />
  );

  const renderMessageVideo = (props) => {
    const {currentMessage} = props;
    return (
        <View style={{padding: 20}}>
          <Video
              resizeMode="contain"
              shouldPlay={true}
              source={{uri: currentMessage.video}}
          />
        </View>
    );
  };

  return (
      <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={chatUser}
          loadEarlier={loadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          onLoadEarlier={handleLoadEarlier}
          renderBubble={renderBubble}
          renderActions={renderActions}
          renderMessageVideo={renderMessageVideo}
      />
  );
}
