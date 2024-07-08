import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { login } from "../Redux/authSlice";
//
function LoginScreen({navigation}: {navigation: NavigationProp<ParamListBase>}) { //navigation의 타입을 정의를 해주어야함 
  //redux
  const {isLoggedIn} = useSelector((state: RootState)=> state.auth);
  const dispatch = useDispatch<AppDispatch>();

  //state
  const [id, setId] = useState('');
  const [password, setPW] = useState('');
  
  const onLoginButton = () => {
    //서버요청 작성 필요
    dispatch(login(id));  
    //navigation.navigate('CartStack');
    navigation.navigate('Cart');
  };

  const onJoinButton = () => {
    navigation.navigate('Join')
  };

  const onFindIDButton = () => {

  };

  const onFindPWButton = () => {

  };

  useEffect(()=>{
    console.log('loginStatus:', isLoggedIn);
  },[isLoggedIn])

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, {color: '#FFC700', paddingLeft: 24, }]}>S</Text>
        <Text style={[styles.logoText, {paddingRight: 24}]}>MARTCART</Text>
      </View>
      <View style={styles.TextInputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="ID"
          onChangeText={newId => setId(newId)}
          defaultValue={id}
        />
        <TextInput
          style={styles.inputText}
          placeholder="PASSWORD"
          onChangeText={newPW => setPW(newPW)}
          defaultValue={password}
        />
      </View>
      <TouchableOpacity 
      onPress={onLoginButton} 
      activeOpacity={0.8} 
      style={styles.loginButton}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={styles.subButtonGroup}>
        <TouchableOpacity onPress={onJoinButton} activeOpacity={0.8} style={styles.subButton}>
          <Text style={styles.subButtonText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFindIDButton} activeOpacity={0.8} style={styles.subButton}>
          <Text style={styles.subButtonText}>아이디찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFindPWButton} activeOpacity={0.8} style={styles.subButton}>
          <Text style={styles.subButtonText}>비밀번호찾기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;