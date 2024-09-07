import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import TopNavigator from "../components/TopNavigator";
import LinearGradient from "react-native-linear-gradient";
import MyPageStyles from "../styles/MypageScreenstyles";
import GlobalStyles from "../styles/GlobalStyles";
import ShoppingBagIcon from '../assets/icons/shoppingBag.svg';
import PersonIcon from '../assets/icons/person_black.svg';
import LogOutIcon from '../assets/icons/logout.svg';

interface User {
    id: string,
    name: string
}

interface Product {
    pNum: string,
    pCategory: string,
    pName: string,
    pImage: string,
    pPrice: number,
}

function MyPageScreen({ route }: { route: RouteProp<ParamListBase> }) {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [user, setUser] = useState<User>()
    const [products, setProducts] = useState<Product[]>([]);
    const [isOrderListPressed, setIsOrderListPressed] = useState<boolean>(false);
    const [isModifyInfoPressed, setIsModifyInfoPressed] = useState<boolean>(false);
    const [isLogoutPressed, setIsLogOutPressed] = useState<boolean>(false);

    const getId = () => {
        if (userId != null) {
            const jsonResponse = {
                "id": userId,
                "name": "이지민"
            }
            setUser(jsonResponse);
        }
    }

    const getProduct = () => {
        const jsonResponse = {
            "data": [
                {
                    "pNum": '1234',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라난sssssssssss난나나나나나나나나나나나나나나ㅏ나나',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                },
                {
                    "pNum": '21321',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                },
                {
                    "pNum": '32523523',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                },
                {
                    "pNum": '657657',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                },
                {
                    "pNum": '1234',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                },
                {
                    "pNum": '1234',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라',
                    "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                    "pPrice": 1320,
                }
            ]
        };

        //상품명 10글자이상은 자르기
        const parsedJsonResponse = jsonResponse.data.map(product => ({
            ...product,
            pName: product.pName.substring(0, 10)
        }));

        setProducts([...parsedJsonResponse]);
    }


    //버튼 핸들러
    const onProductInfo = (id: string) => {
        console.log(id);
        navigation.navigate('ProductDetail', { pNum: id });
    }
    const onOrderListButton = (id: string = '') => {
        navigation.navigate('OrderList', { id });
    }
    const onModifyInfoButton = () => {
        navigation.navigate('UserInfoModify');
    }
    const onLogoutButton = () => {
        dispatch(logout());
        navigation.navigate('Login');
    }


    //버튼 눌릴때 애니매이션
    const handleOrderListButtonPressIn = () => {
        setIsOrderListPressed(true)
    }
    const handleOrderListButtonPressOut = () => {
        setIsOrderListPressed(false)
    }
    const handleModifyInfoButtonPressedIn = () => {
        setIsModifyInfoPressed(true);
    }
    const handleModifyInfoButtonPressedOut = () => {
        setIsModifyInfoPressed(false)
    }
    const handleLogoutButtonPressedIn = () => {
        setIsLogOutPressed(true);
    }
    const handleLogoutButtonPressedOut = () => {
        setIsLogOutPressed(false);
    }

    useEffect(() => {
        console.log('loginStatus:', isLoggedIn);
        getId();
        getProduct();
        setIsOrderListPressed(false);
        setIsModifyInfoPressed(false);
        setIsLogOutPressed(false);
    }, []);

    return (
        <View style={{flex: 1,}}>
            {isLoggedIn ? (
                <LinearGradient
                    colors={['#FFFFFF', '#D9D9D9', '#000000']}
                    style={GlobalStyles.gradientWhite}
                >
                    <TopNavigator
                        title="마이페이지"
                        navigation={navigation}
                    />

                    {/* body */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={MyPageStyles.scrollContainer}>
                        <View style={[MyPageStyles.content, { flexDirection: 'row', elevation: 0 }]}>
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 24, color: '#6E91EB' }]}>{user?.name}</Text>
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 18 }]}> 님 환영합니다</Text>
                        </View>

                        {/* 최근 구매 연관상품 */}
                        <View style={[MyPageStyles.content, { backgroundColor: 'white', alignItems: 'flex-start' }]}>
                            <View style={{ marginBottom: 36 }}>
                                <Text style={GlobalStyles.semiBoldText}>최근 구매 연관 상품</Text>
                            </View>

                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={MyPageStyles.recommendListContainer}>
                                {products.map((product, index) => (
                                    <View key={index} style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => { onProductInfo(product.pNum) }}
                                            style={MyPageStyles.recommendProductContainer}
                                            activeOpacity={0.8}
                                        >
                                            <Image source={{ uri: product.pImage }} style={[MyPageStyles.productImageContainer, { marginBottom: 12, }]} />
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.regularText, { fontSize: 12 }]}>{product.pName}</Text>
                                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 14 }]}>{product.pPrice} 원</Text>
                                        </TouchableOpacity>
                                        {/* 오른쪽 경계선이 마지막 요소에는 표시되지 않도록 조건 추가 */}
                                        {index !== products.length - 1 && (
                                            <View style={{ width: 1, height: '100%', backgroundColor: '#D9D9D9', marginRight: 8 }} />
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 주문목록조회 */}
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[MyPageStyles.button, isOrderListPressed && { backgroundColor: '#FFE68C' }]}
                            onPress={() => { onOrderListButton(user?.id) }}
                            onPressIn={handleOrderListButtonPressIn}
                            onPressOut={handleOrderListButtonPressOut}
                        >
                            <ShoppingBagIcon width={24} height={24} />
                            <Text style={[GlobalStyles.semiBoldText]}> 주문목록조회</Text>
                        </TouchableOpacity>

                        {/* 개인정보수정 */}
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[MyPageStyles.button, isModifyInfoPressed && { backgroundColor: '#FFE68C' }]}
                            onPressIn={handleModifyInfoButtonPressedIn}
                            onPressOut={handleModifyInfoButtonPressedOut}
                            onPress={onModifyInfoButton}
                        >
                            <PersonIcon width={24} height={24} />
                            <Text style={[GlobalStyles.semiBoldText]}> 개인정보수정</Text>
                        </TouchableOpacity>

                        {/* 로그아웃 */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPressIn={handleLogoutButtonPressedIn}
                            onPressOut={handleLogoutButtonPressedOut}
                            onPress={onLogoutButton}
                            style={[MyPageStyles.button, isLogoutPressed && { backgroundColor: '#FFE68C' }]}
                        >
                            <LogOutIcon width={24} height={24} />
                            <Text style={[GlobalStyles.semiBoldText, { color: '#ED7272' }]}> 로그아웃</Text>
                        </TouchableOpacity>
                        
                    </ScrollView>
                </LinearGradient>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.MainText}>Login Again</Text>
                </View>
            )}
        </View>
    )
}
export default MyPageScreen;