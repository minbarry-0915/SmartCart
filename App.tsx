// In App.js in a new project

import React,{useCallback, useState} from 'react';
import { Text, TouchableOpacity, TextInput, KeyboardAvoidingView, View, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraKit, {CameraScreen, CameraType} from 'react-native-camera-kit';
import BarcodeScanner from './Components/BarcodeScanner'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Screen/HomeScreen';
import JoinScreen from './Screen/JoinScreen';
import MainScreen from './Screen/MainScreen';
import SearchScreen from './Screen/SearchScreen';
const Stack = createNativeStackNavigator();

function App() {

  //화면들을 담는 컨테이너 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


