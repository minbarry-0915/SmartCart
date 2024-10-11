import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';

// screen import from index.js
import {
  JoinScreen,
  SearchScreen,
  SearchResultScreen,
  ProductDetailScreen,
  CartScreen,
  MyPageScreen,
  OrderListScreen,
  OrderListDetailScreen,
  LoginScreen,
  UserInfoModifyScreen,
  UserInfoModifyDetailScreen,
  FindIdScreen,
  FindPasswordScreen
} from './screen/index';
import { REACT_NATIVE_BACKEND_IP } from '@env';

const Stack = createNativeStackNavigator();

//카메라 권한 요청
const requestPermission = async () => {
  try {

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        //BLE 권한 
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        //카메라 권한
        PermissionsAndroid.PERMISSIONS.CAMERA
      ]).then((result) => {
        if (result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
          result['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
          result['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
          result['android.permission.CAMERA'] === 'granted'
        ) {
          console.log('All permissions granted');
        } else {
          console.log('permissions denied');
        }
      });
    }
  } catch (err) {
    console.warn(err);
  }
};

function App() {
  useEffect(() => {
    requestPermission();
    console.log('BACKEND SERVER IP:', REACT_NATIVE_BACKEND_IP);
  }, []);

  //화면들을 담는 컨테이너 
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FindId" component={FindIdScreen} options={{
            headerShown: false, animation: 'slide_from_right'
          }} />
          <Stack.Screen name="FindPassword" component={FindPasswordScreen} options={{
            headerShown: false, animation: 'none'
          }} />
          <Stack.Screen name="Join" component={JoinScreen} options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="SearchResult" component={SearchResultScreen} options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="OrderList" component={OrderListScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="OrderListDetail" component={OrderListDetailScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="UserInfoModify" component={UserInfoModifyScreen} options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="UserInfoModifyDetail" component={UserInfoModifyDetailScreen} options={{ headerShown: false, animation: 'none' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}

export default App;


