import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, {useState} from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";

function HomeScreen({navigation}: {navigation: NavigationProp<ParamListBase>}) { //navigation의 타입을 정의를 해주어야함 
    const [id, setId] = useState('');
    const [password, setPW] = useState('');
    const onLoginButton = () => {
      navigation.navigate('Main')
    };
  
    const onJoinButton = () => {
      navigation.navigate('Join')
    };
  
    const onFindIDButton = () => {
  
    };
  
    const onFindPWButton = () => {
  
    };
  
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, {color: '#FFC700', paddingLeft: 24, }]}>S</Text>
          <Text style={[styles.logoText, {paddingRight: 24}]}>MARTCART</Text>
        </View>
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
  
        <TouchableOpacity onPress={onLoginButton} activeOpacity={0.8} style={styles.loginButton}>
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

  export default HomeScreen;