import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { logout } from "../Redux/authSlice";


function UserInfoModifyScreen({navigation}:{navigation: NavigationProp<ParamListBase>}){
    const {isLoggedIn, userId} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [password, setPassword] = useState<string>('');
    const [count, setCount] = useState<number>(0);

    const onVerifyButton = async() =>{
        const res = await verifyPassword();

        if (res === 'success') {
            navigation.navigate("UserInfoModifyDetail");
        } 
        else if(res === 'wrong') {
            // 실패 처리 로직 추가
            console.log('비밀번호가 일치하지 않습니다.');
            if(count == 3){
                console.log('비밀번호를 3회 틀렸습니다. 마이페이지로 돌아갑니다.');
                navigation.goBack();
            } 
        }
        else{
            console.log('잘못된 접근입니다. 다시 시도하세요');
        }
    }
    
    const verifyPassword = async() => {
        //서버에 비번일치여부확인
        try{
            const response = await fetch('URL_TO_VERIFY_PASSWORD', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // 비밀번호 관련 정보 전송 (예: 사용자 입력 정보)
                }),
            });

            const jsonResponse = await response.json();

            if (jsonResponse === 'success') {
                return 'success';
            } else {
                //임시
                const newCount = count + 1;
                setCount(newCount);
                //return 'success';
                return 'wrong';
            }
        }catch(error){
            console.error('비밀번호 확인 중 오류 발생: ',error);
            //임시
            //지워야 될꺼
            // const newCount = count + 1;
            // setCount(newCount);
            // return 'wrong';
            //임시 2
            return 'success';
            //return 'error';
        }
    }

    useEffect(()=>{
        setCount(0);
    },[])
    
    useEffect(()=>{
        console.log(count);
    },[count])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            {isLoggedIn ? (
                <View style = {{flex : 1}}>
                    <Header 
                    showBackButton={true} 
                    title="개인정보수정" 
                    showSearchButton={false}
                    showCartButton={false}
                    showMyPageButton={false}
                    showSearchContainer={false} 
                    navigation={navigation}/>  

                    {/* body */}
                    <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                        <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                            <View style={styles.ModifyPagePasswordInputContainer}>
                                <View style={styles.ModifyPagePasswordInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>본인확인을 위해 비밀번호를 입력해주세요</Text>
                                </View>
                                <View style={styles.ModifyPagePasswordInputContent}>
                                    <TextInput
                                        placeholder="비밀번호"
                                        placeholderTextColor={"#696969"}
                                        value={password}
                                        onChangeText={setPassword}
                                        style={[styles.MainText, {fontSize: 18, backgroundColor: '#FFECEC'}]}
                                    />
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity 
                                activeOpacity={0.7}
                                style={[styles.loginButton, {width: 154}]}
                                onPress={onVerifyButton}
                                >
                                    <Text style={styles.loginButtonText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            ):(
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.MainText}>Login Again</Text>
                </View>
            )}

        </SafeAreaView>   
    );
}

export default UserInfoModifyScreen;