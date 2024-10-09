import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import UserInfoStyles from "../styles/UserInfoScreenStyles";
import LoginStyles from "../styles/LoginScreenStyles";

interface Props {
    navigation: NavigationProp<ParamListBase>
}

function FindIdScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [messege, setMessege] = useState('');

    const onVerifyButton = async () => {
        if(checkEmailType()){
            console.log('correct email type');
        }else{
            console.log('wrong email type');
            setMessege('잘못된 이메일 형식입니다.');
        }
    };

    const checkEmailType = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
        return emailPattern.test(email);
    };

    const Item = (title: string, children: ReactNode) => (
        <>
            <View style={UserInfoStyles.subItem}>
                <Text style={GlobalStyles.BoldText}>{title}</Text>
            </View>
            <View style={[UserInfoStyles.subItem, { alignItems: 'flex-end' }]}>{children}</View>
        </>
    );

    return (
        <View>
            <LinearGradient
                colors={['#FFFFFF', '#D9D9D9', '#000000']}
                style={{ width: '100%', height: '100%' }}
            >
                <TopNavigator
                    title="아이디 찾기"
                    navigation={navigation}
                    showCartButton={false}
                    showMyPageButton={false}
                    showSearchButton={false}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={GlobalStyles.scrollContainer}>
                    <View style={UserInfoStyles.content}>
                        <View style={UserInfoStyles.item}>
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>본인확인을 위해 이메일을 입력해주세요</Text>
                        </View>
                        <View style={UserInfoStyles.item}>
                            <TextInput
                                autoCapitalize='none'
                                keyboardType='email-address'
                                secureTextEntry={true}
                                placeholder="EMAIL"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={()=>{setMessege('')}} //다시 입력시에 초기화
                                style={LoginStyles.textInput}
                            />
                        </View>
                        {messege && (
                            <View style={UserInfoStyles.item}>
                                <Text style={[GlobalStyles.mediumText, { color: '#E33434' }]}>{messege}</Text>
                            </View>
                        )}
                    </View>

                    <View style={[UserInfoStyles.content, { elevation: 0, backgroundColor: 'rgba(0,0,0,0)' }]}>
                        <TouchableOpacity
                            onPress={onVerifyButton}
                            activeOpacity={0.7}
                            style={[GlobalStyles.blackButton, { width: '30%' }]}>
                            <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>
                                확인
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}
export default FindIdScreen;