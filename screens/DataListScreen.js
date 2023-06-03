// ******************JustApp*****************
// A Custom Messenger App for kids 5 to 16 years old.
// Using React Native, an Expo
//
// Author: Hernan Clarke
// Using Reach Native to build once and deploy on the web - android - ios
// Databse: Goggle Firebase
// Auth:  Google Authenticator
// Storage: Google Storage

import React, { useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';

const DataListScreen = (props) => {
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const messagesData = useSelector((state) => state.messages.messagesData);

  const { title, data, type, chatId } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({ headerTitle: title });
  }, [title]);

  return (
    <PageContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item.messageId || item}
        renderItem={(itemData) => {
          let key, onPress, image, title, subTitle, itemType;

          if (type === 'users') {
            const uid = itemData.item;
            const currentUser = storedUsers[uid];

            if (!currentUser) return;

            const isLoggedInUser = uid === userData.userId;

            key = uid;
            image = currentUser.profilePicture;
            title = `${currentUser.firstName} ${currentUser.lastName}`;
            subTitle = currentUser.about;
            itemType = isLoggedInUser ? undefined : 'link';
            onPress = isLoggedInUser
              ? undefined
              : () => props.navigation.navigate('Contact', { uid, chatId });
          } else if (type === 'messages') {
            const starData = itemData.item;
            const { chatId, messageId } = starData;
            const messagesForChat = messagesData[chatId];

            if (!messagesForChat) {
              return;
            }

            const messageData = messagesForChat[messageId];
            const sender =
              messageData.sentBy && storedUsers[messageData.sentBy];
            const name = sender && `${sender.firstName} ${sender.lastName}`;

            key = messageId;
            title = name;
            subTitle = messageData.text;
            itemType = '';
            onPress = () => {};
          }

          return (
            <DataItem
              key={key}
              onPress={onPress}
              image={image}
              title={title}
              subTitle={subTitle}
              type={itemType}
            />
          );
        }}
      />
    </PageContainer>
  );
};

export default DataListScreen;
