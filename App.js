import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
// import RegionPicker from './components/RegionPicker';
import RegionButtons from './components/RegionButtons'; // 지역 버튼
import MapView, { Marker } from 'react-native-maps'; // 지도
import AsyncStorage from '@react-native-async-storage/async-storage'; // 저장
import { SafeAreaView } from 'react-native-safe-area-context'; // 상단/하단 여백 추가(휴대폰 화면 네비게이션바 등등.. 대처)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './styles/styles';
import MainScreen from './screens/MainScreen';
import WishlistScreen from './screens/WishlistScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false, title: '여행지 추천' }}
        />

        <Stack.Screen
          name='Wishlist'
          component={WishlistScreen}
          options={{title: '찜 목록'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}