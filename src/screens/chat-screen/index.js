import { View } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

export const ChatScreen = () => (
  <View style={{ flex: 1 }}>
    <WebView source={{
      uri: 'https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=maz1119.zendesk.com',
    }}
    />
  </View>
);
