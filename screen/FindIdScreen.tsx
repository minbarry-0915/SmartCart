import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import UserInfoStyles from "../styles/UserInfoScreenStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import Loading from "../components/animations/loading";
import useGetRequestVerificationForFindingID from "../customHooks/useGetRequestVerificationForFindingID";
import useVerifyCodeForFindingId from "../customHooks/useVerifyCodeForFindingId";

interface Props {
    navigation: NavigationProp<ParamListBase>
}

function FindIdScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isSecondStep, setIsSecondStep] = useState(false); // 두 번째 단계 상태 추가
    const [showResult, setShowResult] = useState(false);
    const [id, setId] = useState('');
    const { getRequestVerification, loading, message, setMessage, error, responseData } = useGetRequestVerificationForFindingID();
    const { postVerifyCode, loading: isLoadingVerifyCode } = useVerifyCodeForFindingId();
    const onVerifyButton = async () => {
        const result = await getRequestVerification(email);
        if (result && result.ok) {
            // 인증 요청이 성공하면 두 번째 단계로 변경
            setIsSecondStep(true);
        }
        console.log(result);
    };

    const onCodeVerifyButton = async () => {
        // 여기에 코드 인증 로직 추가
        const result = await postVerifyCode(email, code);
        if (result && result.ok){
            setId(result.userId);
            setShowResult(true);
        }
        console.log(result);
    };

    const onLoginButton = () => {
        navigation.navigate('Login');
    }

    const renderInitialContent = () => {
        return (
            <>
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
                        style={[GlobalStyles.blackButton, { width: '30%' }]} 
                    >
                        <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>
                            확인
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const renderSecondContent = () => {
        return (
            <>
                <View style={UserInfoStyles.content}>
                    <View style={UserInfoStyles.item}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>
                            이메일로 전송된 인증코드 6자리를 입력해주세요
                        </Text>
                    </View>
                    <View style={UserInfoStyles.item}>
                        <TextInput
                            autoCapitalize="none"
                            keyboardType='default'
                            placeholder="XXXXXX"
                            value={code}
                            onChangeText={setCode}
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
                        onPress={onCodeVerifyButton}
                        activeOpacity={0.7}
                        style={[GlobalStyles.blackButton, { width: '30%' }]} 
                    >
                        <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>
                            인증
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const renderFinalContent = () => {
        return (
            <>
                <View style={UserInfoStyles.content}>
                    <View style={UserInfoStyles.item}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>
                            ID는 다음과 같습니다.
                        </Text>
                        <View style={UserInfoStyles.item}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>
                            {id}
                        </Text>
                    </View>
                    </View>
                </View>
                <View style={[UserInfoStyles.content, { elevation: 0, backgroundColor: 'rgba(0,0,0,0)' }]}>
                    <TouchableOpacity
                        onPress={onLoginButton}
                        activeOpacity={0.7}
                        style={[GlobalStyles.blackButton, { width: '30%' }]} 
                    >
                        <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>
                            로그인하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    return (
        <View style={{ flex: 1 }}>
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
                    contentContainerStyle={GlobalStyles.scrollContainer}
                >
                    {loading ? (
                        <Loading style={{ width: 200, height: 200 }} />
                    ) : (
                        isSecondStep ? renderSecondContent() : renderInitialContent()
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

export default FindIdScreen;
