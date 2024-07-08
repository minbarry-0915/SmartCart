import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { logout } from "../Redux/authSlice";
import axios from "axios";


function UserInfoModifyDetailScreen({navigation}:{navigation:NavigationProp<ParamListBase>}){
    const {isLoggedIn, userId} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string>();
    const [prePW, setPrePW] = useState<string>();
    const [newPw, setNewPW] = useState<string>();
    const [newPWConfirm, setNewPWConfirm] = useState<string>();
    const [correct, setCorrect] = useState<boolean>(false);
    const [PhoneNum, setPhoneNum] = useState<string>();
    const [email, setEmail] = useState<string>();

    const getInfo = async() =>{
        try{
            const response = await axios.get(`https://api.example.com/user/${userId}`);
            const userInfo = response.data;

            setName(userInfo.name);
            setPrePW(userInfo.pw);
            setPhoneNum(userInfo.PhoneNum);
            setEmail(userInfo.Email);
        }
        catch(error){
            console.error('Failed to fetch user info:', error);
        }
    };

    useEffect(()=>{
        getInfo();
    },[])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            {isLoggedIn ? (
                <View style = {{flex : 1}}>
                    {/* header */}
                    <Header 
                    showBackButton={false} 
                    title="개인정보수정" 
                    showSearchButton={false}
                    showCartButton={false}
                    showMyPageButton={false}
                    showSearchContainer={false} 
                    navigation={navigation}/>      
                    {/* body */}
                    <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                        <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                            <View style={styles.ModifyInfoInputContainer}>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>성명</Text>
                                    <View>
                                        <TextInput
                                        placeholder={name}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200, backgroundColor:'#FFECEC'}]}
                                        value={name}
                                        onChangeText={setName}
                                        textAlign='right'
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.ModifyInfoInputContainer}>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>기존 비밀번호</Text>
                                    <View>
                                        <TextInput
                                        placeholder={prePW}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200}]}
                                        value={prePW}
                                        onChangeText={setPrePW}
                                        textAlign='right'
                                        readOnly={true}
                                        />
                                    </View>
                                </View>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>신규 비밀번호</Text>
                                    <View>
                                        <TextInput
                                        placeholder={newPw}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200, backgroundColor:'#FFECEC'}]}
                                        value={newPw}
                                        onChangeText={setNewPW}
                                        textAlign='right'
                                        />
                                    </View>
                                </View>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>신규 비밀번호 확인</Text>
                                    <View>
                                        <TextInput
                                        placeholder={newPWConfirm}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200, backgroundColor:'#FFECEC'}]}
                                        value={newPWConfirm}
                                        onChangeText={setNewPWConfirm}
                                        textAlign='right'
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.ModifyInfoInputContainer}>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>전화번호</Text>
                                    <View>
                                        <TextInput
                                        placeholder={PhoneNum}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200, backgroundColor:'#FFECEC'}]}
                                        value={PhoneNum}
                                        onChangeText={setPhoneNum}
                                        textAlign='right'
                                        keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={styles.ModifyInfoInputContent}>
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>이메일</Text>
                                    <View>
                                        <TextInput
                                        placeholder={email}
                                        placeholderTextColor={"#696969"}
                                        style={[styles.MainText,{padding: 4, width:200, backgroundColor:'#FFECEC'}]}
                                        value={email}
                                        onChangeText={setEmail}
                                        textAlign='right'
                                        keyboardType='email-address'
                                        />
                                    </View>
                                </View>
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

export default UserInfoModifyDetailScreen;