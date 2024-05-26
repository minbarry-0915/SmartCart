// In App.js in a new project

import React,{useCallback, useState} from 'react';
import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screen/HomeScreen';
import JoinScreen from './Screen/JoinScreen';
import SearchScreen from './Screen/SearchScreen';
import SearchResultScreen from './Screen/SearchResultScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';
import CartScreen from './Screen/CartScreen';
import MyPageScreen from './Screen/MyPageScreen';


const Stack = createNativeStackNavigator();
function App() {

  //화면들을 담는 컨테이너 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Join" component={JoinScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


