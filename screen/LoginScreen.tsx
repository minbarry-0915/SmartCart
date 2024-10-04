import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { login } from "../redux/authSlice";
import GlobalStyles from "../styles/GlobalStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import usePostUserVerify from "../customHooks/usePostUserVerify";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";
//
function LoginScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) { //navigation의 타입을 정의를 해주어야함 
  //redux
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  //state
  const [id, setId] = useState('');
  const [password, setPW] = useState('');
  const { loading, error, postUserVerify } = usePostUserVerify();


  const onLoginButton = async () => {
    //서버요청 작성 필요
    const isSuccess = await postUserVerify({ userId: id, password });
    if (isSuccess) {
      dispatch(login(id));
      navigation.navigate('Cart');
    }
    else {
      console.error('Login Failed');
    }
  };

  const onSignUPButton = () => {
    navigation.navigate('Join')
  };

  const onFindIDButton = () => {

  };

  const onFindPWButton = () => {

  };

  // useEffect(() => {
  //   console.log('loginStatus:', isLoggedIn);
  // }, [isLoggedIn])
  useEffect(() => {
    console.log('loading:', loading);
  }, [loading]);

  const RenderLoading = () => {
    return (
      <View>
        <Loading style={[AnimationStyles.loading, { width: 200, height: 200 }]} />
      </View>
    )
  };

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.container}
      behavior='height'>
      <View style={[LoginStyles.logo, { flexDirection: 'row' }]}>
        <Text style={[GlobalStyles.ExtraBoldText, { color: '#FFC700' }]}>S</Text>
        <Text style={[GlobalStyles.ExtraBoldText]}>MARTCART</Text>
      </View>
      {loading ? (
        <RenderLoading />
      ) : (
        <>
        {/* id */}
        <View style={LoginStyles.content}>
          <TextInput
            placeholder="ID"
            placeholderTextColor={'#696969'}
            onChangeText={setId}
            value={id}
            style={LoginStyles.textInput}
          />

        </View>
        {/* pw */}
        <View style={LoginStyles.content}>
          <TextInput
            secureTextEntry={true}
            placeholder="PASSWORD"
            placeholderTextColor={'#696969'}
            onChangeText={setPW}
            value={password}
            style={LoginStyles.textInput}
          />
        </View>

        <View style={LoginStyles.content}>
          <TouchableOpacity
            onPress={onLoginButton}
            activeOpacity={0.7}
            style={GlobalStyles.blackButton}>
            <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입/아이디찾기/비밀번호찾기 */}
        <View style={LoginStyles.optionContainer}>
          <TouchableOpacity
            onPress={onSignUPButton}
            style={LoginStyles.optionContent}>
            <Text style={[GlobalStyles.regularText, { color: '#696969' }]}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFindIDButton}
            style={LoginStyles.optionContent}>
            <Text style={[GlobalStyles.regularText, { color: '#696969' }]}>아이디찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFindPWButton}
            style={LoginStyles.optionContent}>
            <Text style={[GlobalStyles.regularText, { color: '#696969' }]}>비밀번호찾기</Text>
          </TouchableOpacity>
        </View>
      </>
      )}

    </KeyboardAvoidingView>
  );
};

export default LoginScreen;