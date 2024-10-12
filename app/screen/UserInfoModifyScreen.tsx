import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import UserInfoStyles from "../styles/UserInfoScreenStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import usePostUserVerify from "../customHooks/usePostUserVerify";
import Loading from "../components/animations/loading";


function UserInfoModifyScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [password, setPassword] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const [messege, setMessege] = useState<string | null>();

    const { loading, error, status, postUserVerify } = usePostUserVerify();

    const onVerifyButton = async () => {
        if (userId !== null) {
            const { status, error } = await postUserVerify({ userId, password });
    
            // 로그인 성공 여부에 따라 분기 처리
            if (status === 200) {
                navigation.navigate("UserInfoModifyDetail");
            } else if (status === 401) {
                console.log('비밀번호가 일치하지 않습니다.');
                setMessege('비밀번호가 일치하지 않습니다.');
                setCount(prevCount => prevCount + 1); // 카운트를 증가시킴
            } else {
                setCount(prevCount => prevCount + 1); // 잘못된 접근 시 카운트 증가
                console.log('잘못된 접근입니다. 다시 시도하세요.');
                setMessege('비밀번호를 입력해 주세요.');
            }
        }
    };

    useEffect(() => {
        setCount(0);
    }, [])

    useEffect(() => {
        console.log(count);
        if (count == 5) {
            console.log('비밀번호를 5회 틀렸습니다. 마이페이지로 돌아갑니다.');
            Alert.alert('비밀번호를 5회 틀렸습니다. 마이페이지로 돌아갑니다.');
            navigation.goBack();
        }
    }, [count])

    return (
        <View
            style={{ flex: 1 }}
        >
            <LinearGradient colors={['#000000', '#666666']} style={{ flex: 1 }}>
                <TopNavigator
                    title="개인정보관리"
                    navigation={navigation}
                    mode='black'
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={GlobalStyles.scrollContainer}>

                    {loading ? (
                        <Loading style={{ width: 200, height: 200 }} />
                    ) : (
                        <>
                            <View style={UserInfoStyles.content}>
                                <View style={UserInfoStyles.item}>
                                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>본인확인을 위해 비밀번호를 입력해주세요</Text>
                                </View>
                                <View style={UserInfoStyles.item}>
                                    <TextInput
                                        secureTextEntry={true}
                                        placeholder="PASSWORD"
                                        value={password}
                                        onChangeText={setPassword}
                                        style={LoginStyles.textInput}
                                        onFocus={()=>{setMessege('')}}
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
                        </>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

export default UserInfoModifyScreen;