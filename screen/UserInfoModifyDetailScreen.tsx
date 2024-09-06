import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import axios from "axios";


function UserInfoModifyDetailScreen({navigation}:{navigation:NavigationProp<ParamListBase>}){
    const {isLoggedIn, userId} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string>('');
    const [prePW, setPrePW] = useState<string>('');
    const [newPw, setNewPW] = useState<string>('');
    const [newPWConfirm, setNewPWConfirm] = useState<string>('');
    const [correct, setCorrect] = useState<boolean>(false);
    const [changed,setChanged] = useState<boolean>(false);
    const [PhoneNum, setPhoneNum] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);


    const getInfo = async() =>{
        try{
            const response = await axios.get(`https://api.example.com/user/${userId}`);
            const userInfo = response.data;

            setName(userInfo.name);
            setPrePW(userInfo.pw);
            setPhoneNum(userInfo.PhoneNum);
            setEmail(userInfo.Email);
            setInitialLoading(false)
        }
        catch(error){
            console.error('Failed to fetch user info:', error);
            setInitialLoading(false);
        }
    };

    const onCancelButton = () =>{
        console.log('onCancelButton called, changed:', changed);
        if(changed === false){
            navigation.goBack();
        }
        toggleWarningModal();
    }

    const onSaveButton = async() => {
        const res = await handleModifiedInfo();
        if(res === 'success'){
            navigation.goBack();
        }
    }

    const handleModifiedInfo = async() => {
        try{
            const response = await axios.post(`https://api.example.com/user/${userId}`);

            if(response.data === 'success')
                return 'success'
            else{
                return 'success'
                //return 'fail'
            }

        }catch(error){
            return 'success'
            //return 'error'
            console.error('Failed to fetch user info:', error);
        }
    }

    const toggleWarningModal = () =>{
        setWarningModalVisible(!warningModalVisible)
    }

    const onExitButton = () =>{
        toggleWarningModal();
        navigation.navigate('MyPage')
    }
    const onContinueButton = () =>{
        toggleWarningModal();
    }

    useEffect(()=>{
        getInfo();
    },[])

    useEffect(() => {
        if (!initialLoading) {
            setChanged(true);
            console.log('Changed state updated:', true);
        } 
    }, [name, newPw, PhoneNum, email]);

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
                            {/* 성명 */}
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
                            {/* 비밀번호 */}
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
                            {/* 전화번호 이메일 */}
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

                            <View style={styles.ModifyInfoButtonContainer}>
                                {/* 취소 */}
                                <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.ModifyInfoCancelButton, {marginRight: 8,}]}
                                onPress={onCancelButton}
                                >
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>취소</Text>
                                </TouchableOpacity>
                                {/* 저장 */}
                                <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.ModifyInfoCancelButton,{backgroundColor: '#9AB4F5'}]}
                                onPress={onSaveButton}
                                >
                                    <Text style={[styles.SemiBoldText,{fontSize: 24}]}>저장</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    
                    </View>

                    <Modal
                    animationType="fade"
                    transparent={true}
                    visible={warningModalVisible}
                    onRequestClose={toggleWarningModal}
                    >
                        <TouchableOpacity
                        activeOpacity={1}
                        style={styles.ProductLocationModalContainer}
                        // onPress={toggleWarningModal}
                        >
                            <View style={styles.WarningModalContent}>
                                <Text style={[styles.MainText,{fontSize: 16}]}>변경된 내용이 저장되지 않았습니다. </Text>
                                <Text style={[styles.MainText,{fontSize: 16}]}>계속하시겠습니까? </Text>
                                <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.WaringModalButton,{marginRight: 8}]}
                                    onPress={onContinueButton}
                                    >
                                        <Text style={[styles.SemiBoldText,{fontSize: 18}]}>계속</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.WaringModalButton,{backgroundColor:'#FFB0B0'}]}
                                    onPress={onExitButton}
                                    >
                                        <Text style={[styles.SemiBoldText,{fontSize: 18}]}>종료</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </Modal>
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