import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { login } from "../redux/authSlice";
import GlobalStyles from "../styles/GlobalStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import usePostUserVerify from "../customHooks/usePostUserVerify";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";
import useGetRecommendProductList from "../customHooks/useGetRecommendProductList";
//
function LoginScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) { //navigation의 타입을 정의를 해주어야함 
  //redux
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  //state
  const [id, setId] = useState('');
  const [password, setPW] = useState('');
  const [errorMessege, setErrorMessege] = useState('');

  const { loading, error, postUserVerify } = usePostUserVerify();
  const { error: fetchError, getRecommendProductList } = useGetRecommendProductList();

  const onLoginButton = async () => {
    const { status, error, } = await postUserVerify({ userId: id, password });

    // 로그인 성공 여부 확인
    if (status === 200) {
      dispatch(login(id));
      // 추천 제품 가져오기
      getRecommendProductList(id);
      // 추천 제품 로딩 또는 오류 처리
      if (fetchError) {
        console.error('추천 제품 가져오기 실패:', fetchError);
        setErrorMessege('추천 제품을 가져오는 데 실패했습니다.');
      }
      // 화면 이동
      navigation.navigate('Cart');
    } else if (status == 401) {
      console.error('Login Failed:', error); // 에러 메시지 출력
      setErrorMessege('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const onSignUPButton = () => {
    navigation.navigate('Join')
  };

  const onFindIDButton = () => {
    navigation.navigate('FindId')
  };

  const onFindPWButton = () => {
    navigation.navigate('FindPassword')
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setId('');
      setPW('');
      setErrorMessege('');
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return unsubscribe;
  }, [navigation]);

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
              autoCapitalize="none"
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
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="PASSWORD"
              placeholderTextColor={'#696969'}
              onChangeText={setPW}
              value={password}
              style={LoginStyles.textInput}
            />
          </View>
          {errorMessege && (
            <View style={LoginStyles.content}>
              <Text style={[GlobalStyles.mediumText, { color: '#E33434' }]}>{errorMessege}</Text>
            </View>
          )}
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