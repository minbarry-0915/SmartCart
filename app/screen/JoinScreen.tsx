import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import styles from "./StyleSheet";
import SelectDropDown from "../components/SelectDropDown";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import JoinStyles from "../styles/JoinScreenStyles";
import usePostUserInfo from "../customHooks/usePostUserInfo";
//
function JoinScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Male');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInitNum, setSelectedInitNum] = useState('010');
  const [phoneMidNum, setPhoneMidNum] = useState('');
  const [phoneEndNum, setPhoneEndNum] = useState('');
  const [initEmail, setInitEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [isMatchPassword, setIsMatchPassword] = useState<boolean>(false);

  const idInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);
  const birthdateInputRef = useRef<TextInput>(null);
  const phonenumInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const { postUserInfo } = usePostUserInfo();


  const onJoinButton = async () => {
    const missingFields = [];

    // 각 필드를 확인하여 비어있으면 배열에 추가
    if (!id) missingFields.push('ID');
    if (!password) missingFields.push('Password');
    if (!passwordConfirm) missingFields.push('Password Confirmation');
    if (!name) missingFields.push('Name');
    if (!birthDate) missingFields.push('Birthdate');
    if (!gender) missingFields.push('Gender');
    if (!phoneNum) missingFields.push('Phone Number');
    if (!email) missingFields.push('Email');

    // 비어있는 필드가 있는 경우 경고 메시지 출력
    if (missingFields.length > 0) {
      Alert.alert('입력 오류', `${missingFields.join(', ')}을(를) 입력해주세요.`);
      return;
    }

    //사용자 정보 객체 생성
    const userInfo = {
      Userid: id,
      Password: password,
      Name: name,
      Birthdate: new Date(birthDate),
      Gender: gender,
      Phone_num: phoneNum,
      Email: email,
    };

    //서버 요청 시도
    try {
      const isSuccess = await postUserInfo(userInfo);

      if (isSuccess)
        navigation.navigate('Login');
      else {
        console.error('Failed to post user info');
      }
    } catch (error) {
      console.error('Error during user info posting:', error);
    }
  };

  const handleSelectedEmailDomain = (selectedItem: { title: string }, index: number) => {
    setEmailDomain(selectedItem.title);
    console.log(selectedItem.title);
  };

  const handleSelectedGenderOption = (selectedItem: { title: string }, index: number) => {
    setGender(selectedItem.title);
    console.log(selectedItem.title);
  };

  const handlePhoneNumberChange = (text: string) => {
    console.log(phoneNum)
    // 숫자만 필터링
    const numbersOnly = text.replace(/\D/g, '');

    // 하이픈 추가
    let formattedNumber = '';
    if (numbersOnly.length > 0) {
      formattedNumber += numbersOnly.substring(0, 3); // 첫 3자리
    }
    if (numbersOnly.length >= 4) {
      formattedNumber += '-' + numbersOnly.substring(3, 7); // 다음 4자리
    }
    if (numbersOnly.length >= 8) {
      formattedNumber += '-' + numbersOnly.substring(7, 11); // 마지막 4자리
    }
    setPhoneNum(formattedNumber);
  };

  const handleBirthDateChange = (text: string) => {
    console.log(birthDate)
    // 숫자만 필터링
    const numbersOnly = text.replace(/\D/g, '');

    // 하이픈 추가
    let formattedNumber = '';
    if (numbersOnly.length > 0) {
      formattedNumber += numbersOnly.substring(0, 4); // 첫 3자리
    }
    if (numbersOnly.length >= 5) {
      formattedNumber += '-' + numbersOnly.substring(4, 6); // 다음 4자리
    }
    if (numbersOnly.length >= 7) {
      formattedNumber += '-' + numbersOnly.substring(6, 8); // 마지막 4자리
    }

    setBirthDate(formattedNumber);
  };





  const emailDomains = [
    { title: 'naver.com' },
    { title: 'daum.net' },
    { title: 'gmail.com' },
    { title: 'hanmail.net' },
    { title: 'nate.com' },
    // 기타 이동 통신사의 도메인 추가 가능
  ];

  const genderOptions = [
    { title: 'Male' },
    { title: 'Female' }
  ]

  useEffect(() => {
    const newEmail = initEmail + '@' + emailDomain;
    setEmail(newEmail);
  }, [initEmail, emailDomain]);

  useEffect(() => {
    console.log(isMatchPassword);
    setIsMatchPassword(false);
    if (password === passwordConfirm) {
      console.log('password is match')
      setIsMatchPassword(true);
    }
  }, [password, passwordConfirm])

  const RenderErrorMessege = () => {
    return (
      <View style={[JoinStyles.content, { justifyContent: 'flex-end' }]}>
        {isMatchPassword ? (
          <Text style={[GlobalStyles.regularText, { fontSize: 18, color: '#6E91EB' }]}>비밀번호가 일치합니다.</Text>
        ) : (
          <Text style={[GlobalStyles.regularText, { fontSize: 18, color: '#ED7272' }]}>비밀번호가 일치하지 않습니다.</Text>
        )}
      </View>
    )
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'white',
    }}>
      <TopNavigator
        title="회원가입"
        mode="white"
        navigation={navigation}
        showSearchButton={false}
        showMyPageButton={false}
        showCartButton={false}
      />
      {/* body */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={GlobalStyles.scrollContainer}>
        {/* Id */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>ID</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              autoCapitalize="none"  // 대문자 자동 활성화 비활성화
              keyboardType="default"
              value={id}
              onChangeText={setId}
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current?.focus()} //다음 버튼 누르면 password로 이동 
              blurOnSubmit={false} //키보드 자동으로 닫히지 않게 설정
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />
          </View>
        </View>
        {/* password */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>PASSWORD</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              ref={passwordInputRef}
              keyboardType="default"
              autoCapitalize="none"  // 대문자 자동 활성화 비활성화
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              returnKeyType='next'
              onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
              blurOnSubmit={false}
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />
          </View>
        </View>
        {/* passwordConfirm */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>PASSWORD CONFIRM</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              ref={passwordConfirmInputRef}
              keyboardType="default"
              autoCapitalize="none"  // 대문자 자동 활성화 비활성화
              secureTextEntry={true}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              returnKeyType='next'
              onSubmitEditing={() => { nameInputRef.current?.focus() }}
              blurOnSubmit={false}
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />
          </View>
        </View>
        <RenderErrorMessege />

        {/* name */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>NAME</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              ref={nameInputRef}
              value={name}
              autoCapitalize="none"  // 대문자 자동 활성화 비활성화
              onChangeText={setName}
              returnKeyType='next'
              onSubmitEditing={() => { phonenumInputRef.current?.focus() }}
              blurOnSubmit={false}
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />
          </View>
        </View>

        {/* phonenumber */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>PHONE NUMBER</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              ref={phonenumInputRef}
              placeholder="010-0000-0000"
              placeholderTextColor={'#696969'}
              value={phoneNum}
              onChangeText={handlePhoneNumberChange}
              keyboardType='numeric'
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />
          </View>
        </View>

        {/* email */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>EMAIL</Text>
          </View>
          <View style={[JoinStyles.item, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
            <TextInput
              ref={emailInputRef}
              autoCapitalize="none"  // 대문자 자동 활성화 비활성화
              placeholder="smartcart"
              placeholderTextColor={'#696969'}
              value={initEmail}
              onChangeText={setInitEmail}
              returnKeyType="next"
              onSubmitEditing={() => birthdateInputRef.current?.focus()}
              keyboardType='email-address'
              style={[JoinStyles.textInput, { width: '40%' }]}
            />
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>
              @
            </Text>
            <SelectDropDown
              data={emailDomains}
              onSelect={handleSelectedEmailDomain}
              initData="naver.com"
            />
          </View>
        </View>

        {/* birthdate */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>BIRTHDATE</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              ref={birthdateInputRef}
              placeholder="2000-00-00"
              placeholderTextColor={'#696969'}
              value={birthDate}
              onChangeText={handleBirthDateChange}
              keyboardType='numeric' // 'numeric' 대신 'default'
              returnKeyType="next"
              style={[JoinStyles.textInput, { textAlign: 'right' }]}
            />

          </View>
        </View>


        {/* gender */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>GENDER</Text>
          </View>
          <View style={[JoinStyles.item, { alignItems: 'flex-end' }]}>
            <SelectDropDown
              data={genderOptions}
              onSelect={handleSelectedGenderOption}
              initData="Male"
            />
          </View>

        </View>

        <View style={[JoinStyles.content, { marginTop: 12, }]}>
          <TouchableOpacity
            onPress={onJoinButton}
            style={GlobalStyles.blackButton}
          >
            <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>가입하기</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  )
}

export default JoinScreen;
