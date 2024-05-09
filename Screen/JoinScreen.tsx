import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, {useState} from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";

function JoinScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const [id, setId] = useState('');
    const [password, setPW] = useState('');
  
    const onJoinButton = () => {
      navigation.navigate('Home');
    };
    return(
      <KeyboardAvoidingView style = {styles.container}>
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
        <View style={styles.subButtonGroup}>
          <TextInput
            placeholder='010'
            style={styles.inputText}
          />
          <TextInput
            placeholder='XXXX'
            style={styles.inputText}
          />
          <TextInput
            placeholder='XXXX'
            style={styles.inputText}
          />
        </View>
        <TextInput
            placeholder='example@naver.com'
            style={styles.inputText}
        />
        <TouchableOpacity onPress={onJoinButton} activeOpacity={0.8} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>회원가입</Text>
        </TouchableOpacity>
        
      </KeyboardAvoidingView>
    )
  }
  
  export default JoinScreen;
  