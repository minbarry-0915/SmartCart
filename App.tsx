// In App.js in a new project

import React,{useCallback, useEffect, useState} from 'react';
import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screen/HomeScreen';
import JoinScreen from './Screen/JoinScreen';
import SearchScreen from './Screen/SearchScreen';
import SearchResultScreen from './Screen/SearchResultScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';
import CartScreen from './Screen/CartScreen';
import MyPageScreen from './Screen/MyPageScreen';
import { PermissionsAndroid, Platform } from 'react-native';
import OrderListScreen from './Screen/OrderListScreen';
import OrderListDetailScreen from './Screen/OrderListDetailScreen';


const Stack = createNativeStackNavigator();

const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};

function App() {
  useEffect(()=>{
    requestCameraPermission();
  },[]);
  
  //화면들을 담는 컨테이너 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Join" component={JoinScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false,}}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false,animation:'fade'}} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} options={{ headerShown: false, animation:'fade'}}/>
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false ,animation:'fade'}}/>
        <Stack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: false ,animation:'fade'}}/>
        <Stack.Screen name="OrderList" component={OrderListScreen} options={{ headerShown: false}} />
        <Stack.Screen name="OrderListDetail" component={OrderListDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


