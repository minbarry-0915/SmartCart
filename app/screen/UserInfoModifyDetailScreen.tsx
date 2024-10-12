import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, { ReactNode, useEffect, useState } from "react";
import { BackHandler, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import UserInfoStyles from "../styles/UserInfoScreenStyles";
import LoginStyles from "../styles/LoginScreenStyles";
import useGetUserInfo from "../customHooks/useGetUserInfo";
import SelectDropDown from "../components/SelectDropDown";
import { User } from "../types";
import usePatchUserInfo from "../customHooks/usePatchUserInfo";
import WarningModal from "../components/WarningModal";
import Loading from "../components/animations/loading";

function UserInfoModifyDetailScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [userData, setUserData] = useState<User>({
        Userid: '',
        Password: '',
        Name: '',
        Birthdate: new Date(), // 기본값으로 현재 날짜 사용
        Gender: '',
        Phone_num: '',
        Email: '',
    });
    const [formattedPhoneNum, setFormattedPhoneNum] = useState<string>('');
    const [formattedBirthDate, setFormattedBirthDate] = useState<string>('');
    const { userInfo } = useGetUserInfo();
    const { loading, patchUserInfo } = usePatchUserInfo();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [messege, setMessege] = useState<string | null>(null);
    const [color, setColor] = useState<string>('#0262F1'); // 에러 메세지 색상

    const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(false);

    const genderOptions = [
        { title: 'Male' },
        { title: 'Female' }
    ];

    useEffect(() => { //userinfo 가져와서 세팅
        if (userInfo) {
            setUserData(userInfo);
        }
    }, [userInfo]);

    useEffect(()=>{
        if (userInfo !== userData){
            setChanged(true);
            console.log('Data changed:', changed);
        }
    },[userData]);


    useEffect(() => {
        if (newPassword !== confirmNewPassword) {
            setColor('#E33434');
            setMessege('비밀번호가 일치하지 않습니다. 확인해주세요.')
        } else {
            setColor('#0262F1')
            setMessege('비밀번호가 일치합니다.')
        }
    }, [newPassword, confirmNewPassword]); // 상태가 바뀔 때마다 color 업데이트

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                toggleWarningModal()
                return true; // 이벤트가 소비되었음을 나타냄
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );


    const onCancelButton = () => {
        if (!changed) {
            console.log('Data has not changed: ', changed);
            navigation.goBack();
        } else {
            console.log('Data has changed, rendering Modal... :', changed);
            toggleWarningModal();
        }
    };


    const onSaveButton = async () => {
        if (newPassword !== confirmNewPassword) {
            console.log("Password is not match");
            setMessege('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
            return;
        }

        // 비밀번호가 일치하면 userData를 업데이트
        if (newPassword) {
            setUserData({ ...userData, Password: newPassword });
        }
        if (userId) {
            const isSuccess = await patchUserInfo(userData);
            if (isSuccess) {
                dispatch(logout());
                navigation.navigate('Login');
            } else {
                console.log("Failed to update user info");
            }
        }
    };

    const handleBirthDateChange = (text: string) => {
        // 숫자만 필터링
        const numbersOnly = text.replace(/\D/g, '');

        // 하이픈 추가
        let formattedNumber = '';
        if (numbersOnly.length > 0) {
            formattedNumber += numbersOnly.substring(0, 4); // 연도
        }
        if (numbersOnly.length >= 5) {
            formattedNumber += '-' + numbersOnly.substring(4, 6); // 월
        }
        if (numbersOnly.length >= 7) {
            formattedNumber += '-' + numbersOnly.substring(6, 8); // 일
        }

        setFormattedBirthDate(formattedNumber);
        // Date 객체로 변환
        if (formattedNumber.length === 10) { // YYYY-MM-DD 형식일 때만
            const [year, month, day] = formattedNumber.split('-').map(Number);
            setUserData({ ...userData, Birthdate: new Date(year, month - 1, day) }); // month는 0부터 시작
        }
    };

    const handlePhoneNumberChange = (text: string) => {
        // 숫자만 필터링
        const numbersOnly = text.replace(/\D/g, '');

        // 하이픈 추가
        let formattedNumber = '';
        if (numbersOnly.length > 0) {
            formattedNumber += numbersOnly.substring(0, 3); // 첫 번째 부분 (예: 010)
        }
        if (numbersOnly.length >= 4) {
            formattedNumber += '-' + numbersOnly.substring(3, 7); // 두 번째 부분 (예: 5547)
        }
        if (numbersOnly.length >= 8) {
            formattedNumber += '-' + numbersOnly.substring(7, 11); // 세 번째 부분 (예: 1405)
        }

        setFormattedPhoneNum(formattedNumber);
        // phone number를 userData에 업데이트
        setUserData({ ...userData, Phone_num: formattedNumber });
    };


    const toggleWarningModal = () => {
        setWarningModalVisible(!warningModalVisible);
    };

    const handleSelectedGenderOption = (selectedItem: { title: string }) => {
        setUserData({ ...userData, Gender: selectedItem.title });
    };

    const Item = (title: string, children: ReactNode) => (
        <>
            <View style={UserInfoStyles.subItem}>
                <Text style={GlobalStyles.BoldText}>{title}</Text>
            </View>
            <View style={[UserInfoStyles.subItem, { alignItems: 'flex-end' }]}>{children}</View>
        </>
    );



    const RenderErrorMessege = () => {
        return (
            <>
                {messege && (
                    <View style={{ width: '100%', marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={[GlobalStyles.mediumText, { color: color }]}>
                            {messege}
                        </Text>
                    </View>
                )}
            </>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#000000', '#666666']} style={{ flex: 1 }}>
                <TopNavigator title="개인정보관리" navigation={navigation} mode='black' showBackButton={false} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={GlobalStyles.scrollContainer}>
                    {loading ? (
                        <Loading style={{ width: 200, height: 200 }} />
                    ) : (
                        <>
                            <View style={[UserInfoStyles.content, { backgroundColor: 'rgba(0,0,0,0)', elevation: 0 }]}>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('ID',
                                        <TextInput
                                            editable={false}
                                            placeholder={userInfo?.Userid}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('PASSWORD',
                                        <TextInput
                                            editable={false}
                                            placeholder={userInfo?.Password}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                                <View style={[UserInfoStyles.detailScreenItem, { flexDirection: 'column', paddingVertical: 18 }]}>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        {Item('NEW PASSWORD',
                                            <TextInput
                                                secureTextEntry={true}
                                                placeholderTextColor='#696969'
                                                style={[LoginStyles.textInput]}
                                                value={newPassword}
                                                onChangeText={setNewPassword}
                                                textAlign='right'
                                            />
                                        )}
                                    </View>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {Item('CONFIRM PASSWORD',
                                            <TextInput
                                                secureTextEntry={true}
                                                placeholderTextColor='#696969'
                                                style={[LoginStyles.textInput]}
                                                value={confirmNewPassword}
                                                onChangeText={setConfirmNewPassword}
                                                textAlign='right'
                                            />
                                        )}
                                    </View>
                                    <RenderErrorMessege />
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('NAME',
                                        <TextInput
                                            placeholder={userData.Name}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            value={userData.Name}
                                            onChangeText={(text) => setUserData({ ...userData, Name: text })}
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('GENDER',
                                        <SelectDropDown
                                            data={genderOptions}
                                            onSelect={handleSelectedGenderOption}
                                            initData={userData.Gender || "Male"}
                                        />
                                    )}
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('BIRTH DATE',
                                        <TextInput
                                            keyboardType='number-pad'
                                            placeholder={userData.Birthdate.toISOString().split('T')[0]}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            value={formattedBirthDate} // 포맷된 생일 날짜를 표시
                                            onChangeText={handleBirthDateChange} // 입력 변경 처리
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('EMAIL',
                                        <TextInput
                                            keyboardType='email-address'
                                            placeholder={userData.Email}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            value={userData.Email}
                                            onChangeText={(text) => setUserData({ ...userData, Email: text })}
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                                <View style={UserInfoStyles.detailScreenItem}>
                                    {Item('PHONE NUMBER',
                                        <TextInput
                                            keyboardType='number-pad'
                                            placeholder={userData.Phone_num}
                                            placeholderTextColor='#696969'
                                            style={[LoginStyles.textInput, { borderBottomWidth: 0 }]}
                                            value={userData.Phone_num}
                                            onChangeText={handlePhoneNumberChange}
                                            textAlign='right'
                                        />
                                    )}
                                </View>
                            </View>

                            <View style={[UserInfoStyles.content, { backgroundColor: 'rgba(0,0,0,0)', elevation: 0, flexDirection: 'row' }]}>
                                <TouchableOpacity
                                    onPress={onSaveButton}
                                    activeOpacity={0.7}
                                    style={[GlobalStyles.blackButton, { width: '30%', backgroundColor: '#FFE68C', marginRight: 12 }]} >
                                    <Text style={[GlobalStyles.BoldText, { color: 'black' }]}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onCancelButton}
                                    activeOpacity={0.7}
                                    style={[GlobalStyles.blackButton, { width: '30%', backgroundColor: 'white' }]} >
                                    <Text style={[GlobalStyles.BoldText, { color: 'black' }]}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}



                </ScrollView>
            </LinearGradient>

            {warningModalVisible && (
                <WarningModal
                    modalVisible={warningModalVisible}
                    toggleWarningModal={toggleWarningModal}
                    navigation={navigation}
                    confirmDestination="MyPage"
                />
            )}
        </View>
    );
}

export default UserInfoModifyDetailScreen;
