import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInitNum, setSelectedInitNum] = useState('010');
  const [phoneMidNum, setPhoneMidNum] = useState('');
  const [phoneEndNum, setPhoneEndNum] = useState('');
  const [initEmail, setInitEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isMatchPassword, setIsMatchPassword] = useState<boolean>(false);

  const { postUserInfo } = usePostUserInfo();
  
  const onJoinButton = async () => {
    // 사용자 정보를 데이터 객체로 만듭니다
    const userInfo = {
      Userid: id,
      Password: password,
      Name: name,
      BirthDate: new Date(birthDate),
      Gender: gender,
      Phone_Num: phoneNum,
      Email: email,
    };
  
    try {
      await postUserInfo(userInfo);
    } catch (error) {
      console.error('Error during user info posting:', error);
    } finally {
      // 데이터 전송 후 항상 로그인 화면으로 이동
      navigation.navigate('Login');
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={GlobalStyles.scrollContainer}>
        {/* Id */}
        <View style={[JoinStyles.content]}>
          <View style={JoinStyles.item}>
            <Text style={[GlobalStyles.semiBoldText, { fontSize: 22, color: '#696969' }]}>ID</Text>
          </View>

          <View style={JoinStyles.item}>
            <TextInput
              keyboardType="default"
              value={id}
              onChangeText={setId}
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
              keyboardType="default"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
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
              keyboardType="default"
              secureTextEntry={true}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
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
              value={name}
              onChangeText={setName}
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
              placeholder="010-0000-0000"
              placeholderTextColor={'#696969'}
              value={phoneNum}
              onChangeText={handlePhoneNumberChange}
              keyboardType='numeric'
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
              placeholder="smartcart"
              placeholderTextColor={'#696969'}
              value={initEmail}
              onChangeText={setInitEmail}
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
              placeholder="2000-00-00"
              placeholderTextColor={'#696969'}
              value={birthDate}
              onChangeText={handleBirthDateChange}
              keyboardType='numeric' // 'numeric' 대신 'default'
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
