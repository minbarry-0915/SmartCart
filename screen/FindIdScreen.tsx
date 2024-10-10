import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { ReactNode, useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import UserInfoStyles from "../styles/UserInfoScreenStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import useGetRequestVerification from "../customHooks/useGetRequestVerification";

interface Props {
    navigation: NavigationProp<ParamListBase>
}

function FindIdScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const { getRequestVerification, loading, error, responseData } = useGetRequestVerification();
    const onVerifyButton = async () => {
        if (checkEmailType()) {
            console.log('correct email type');
            await getRequestVerification(email);
            console.log(responseData);
        } else {
            console.log('wrong email type');
            setMessage('잘못된 이메일 형식입니다.');
        }
    };

    const checkEmailType = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
        return emailPattern.test(email);
    };


    return (
        <View
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={['#FFFFFF', '#D9D9D9', '#000000']}
                style={{ flex: 1 }}
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
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>
                                본인확인을 위해 이메일을 입력해주세요
                            </Text>
                        </View>
                        <View style={UserInfoStyles.item}>
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="EMAIL"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => { setMessage(''); }} // 다시 입력 시 초기화
                                style={LoginStyles.textInput}
                            />
                        </View>

                        {message && (
                            <View style={UserInfoStyles.item}>
                                <Text style={[GlobalStyles.mediumText, { color: '#E33434' }]}>{message}</Text>
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
        </View >
    );
}

export default FindIdScreen;
