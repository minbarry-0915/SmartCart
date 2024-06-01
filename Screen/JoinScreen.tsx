import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import Header from "../Components/Header";
import SelectDropdown from "react-native-select-dropdown";
import SelectDropDown from "../Components/SelectDropDown";

function JoinScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
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

    const onJoinButton = () => {
      console.log(phoneNum);
      console.log(email);
      //서버에 작성한거 넘겨줘야됨
      navigation.navigate('Login');
    };
    const handleSelectedNum = (selectedItem: { title: string }, index: number) =>{
      setSelectedInitNum(selectedItem.title);
      console.log(selectedItem.title);
    };
    const handleSelectedEmailDomain = (selectedItem: {title: string}, index: number)=>{
      setEmailDomain(selectedItem.title);
      console.log(selectedItem.title);
    };
    const handleSelectedGenderOption = (selectedItem: {title: string}, index: number)=>{
      setGender(selectedItem.title);
      console.log(selectedItem.title);
    };
    const phoneNumList = [
      {title: '010'},
      {title: '011'},
      {title: '016'},
      {title: '017'},
      {title: '018'},
      {title: '019'}
    ]

    const emailDomains = [
      { title: 'naver.com' },
      { title: 'daum.net' },
      { title: 'gmail.com' },
      { title: 'hanmail.net' },
      { title: 'nate.com' },
      // 기타 이동 통신사의 도메인 추가 가능
    ];

    const genderOptions = [
      { title: 'Male'},
      { title: 'Felmale'}
    ]

    useEffect(() => {
      const newPhoneNum = selectedInitNum+phoneMidNum+phoneEndNum;
      const newEmail = initEmail+'@'+emailDomain;
      setPhoneNum(newPhoneNum);
      setEmail(newEmail);
    }, [phoneMidNum,phoneEndNum,initEmail,emailDomain]);

    return(
      <SafeAreaView style={{
        flex:1,
        backgroundColor:'white',
      }}>
        <Header
        showBackButton={true}
        showCartButton={false}
        showMyPageButton={false}
        showSearchButton={false}
        showSearchContainer={false}
        title='회원가입'
        navigation={navigation}
        />
        {/* body */}
        <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
          <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
            {/* Id */}
            <View style={styles.JoinContent}>
              <Text style={[styles.MainText,{width:'32%'}]}>ID</Text>
              <TextInput 
              placeholder="ID"
              placeholderTextColor={'#696969'}
              value={id}
              onChangeText={setId}
              style={[styles.inputText, {flex: 1,marginBottom: 0}]}
              />  
            </View>
            
            {/* password */}
            <View style={styles.JoinContent}>
              <Text style={[styles.MainText,{width:'32%'}]}>Password</Text>
              <TextInput 
              placeholder="Password"
              placeholderTextColor={'#696969'}
              value={password}
              onChangeText={setPassword}
              style={[styles.inputText, {flex: 1,marginBottom: 0}]}
              />
            </View>
            
            {/* birthdate */}
            <View style={styles.JoinContent}>
              <Text style={[styles.MainText,{width:'32%'}]}>BirthDate</Text>
              <TextInput 
              placeholder="ex) 1998-09-15"
              placeholderTextColor={'#696969'}
              keyboardType='numeric'
              value={birthDate}
              onChangeText={setBirthDate}
              style={[styles.inputText, {flex: 1,marginBottom: 0}]}
              />
            </View>
            
            {/* gender */}
            <View style={styles.JoinContent}>
              <Text style={[styles.MainText,{width:'32%'}]}>Gender</Text>
              <SelectDropDown
              data={genderOptions}
              onSelect={handleSelectedGenderOption}
              initData="Gender"
              />
            </View>

            {/* phonenum */}
            <View style={styles.JoinContent}>
            <Text style={[styles.MainText,{width:'32%'}]}>PhoneNumber</Text>
              <View style={{flexDirection:'row',flex:1}}>
                <View style={{marginRight: 12}}>
                  <SelectDropDown
                  data={phoneNumList}
                  onSelect={handleSelectedNum}
                  initData="010"
                  />
                </View>
                <TextInput 
                placeholder="0000"
                placeholderTextColor={'#696969'}
                keyboardType='numeric'
                value={phoneMidNum}
                onChangeText={setPhoneMidNum}
                maxLength={4}
                style={[styles.inputText, {flex:1,textAlign:'center',marginBottom: 0, marginRight: 12}]}
                />
                <TextInput 
                placeholder="0000"
                placeholderTextColor={'#696969'}
                keyboardType='numeric'
                value={phoneEndNum}
                onChangeText={setPhoneEndNum}
                maxLength={4}
                style={[styles.inputText, {flex:1,textAlign:'center',marginBottom: 0}]}
                />
              </View>
              
            </View>
            
            {/* email */}
            <View style={[styles.JoinContent,{marginBottom: 24}]}>
              <Text style={[styles.MainText,{width:'32%'}]}>Email</Text>
              <View style={{flexDirection:'row',flex: 1 }}>
                <TextInput 
                placeholder="xxxxxxxxxxxxxx"
                placeholderTextColor={'#696969'}
                value={initEmail}
                onChangeText={setInitEmail}
                style={[styles.inputText, {flex: 1,marginBottom: 0, marginRight: 12}]}
                />
                <View style={{justifyContent:'center', marginRight: 12,}}>
                  <Text style={[styles.MainText,]}>@</Text>
                </View>
                <SelectDropDown 
                data={emailDomains} 
                onSelect={handleSelectedEmailDomain}
                initData="naver.com"/>
              </View>
              
            </View>
            
            <TouchableOpacity
            onPress={onJoinButton}
            style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>가입하기</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
  
  export default JoinScreen;
  