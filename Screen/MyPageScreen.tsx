import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import styles from "./StyleSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
//
interface User {
    id: string,
    name: string
}

interface MyParams {
    id: string,
}

interface Product {
    pNum: string,
    pCategory: string,
    pName: string,
    pImage: string,
    pPrice: number,
}

function MyPageScreen({route}:{route:RouteProp<ParamListBase>}){
    const {isLoggedIn, userId} = useSelector((state: RootState)=> state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [user,setUser] = useState<User>()
    const [products, setProducts] = useState<Product[]>([]);
    const [isOrderListPressed, setIsOrderListPressed] = useState<boolean>(false);
    const [isModifyInfoPressed, setIsModifyInfoPressed] = useState<boolean>(false);

    const getId = () => {
        const jsonResponse = {
            "id": "1234",
            "name": "이지민"
        }
        setUser(jsonResponse);
    }

    const getProduct = () => {
        const jsonResponse = {
            "data": [
                {
                    "pNum": '1234',
                    "pCategory": '마이프로틴',
                    "pName": '코카콜라난난나나나나나나나나나나나나나나ㅏ나나',
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
        const parsedJsonResponse = jsonResponse.data.map(product =>({
            ...product,
            pName: product.pName.substring(0,10)
        }));

        setProducts([...parsedJsonResponse]);
    }

    const onOrderListButton = (id: string ='') =>{
        navigation.navigate('OrderList', {id});
    }
    const handleOrderListButtonPressIn = () => {
        setIsOrderListPressed(true)
    }
    const handleOrderListButtonPressOut = () => {
        setIsOrderListPressed(false)
    }
    const handleModifyInfoButtonPressedIn = () =>{
        setIsModifyInfoPressed(true)
    }
    const handleModifyInfoButtonPressedOut = () =>{
        setIsModifyInfoPressed(false)
    }
    const onProductInfo = (id: string) => {
        console.log(id);
        navigation.navigate('ProductDetail',{pNum: id});
    } 
    const onLogoutButton = () => {
        dispatch(logout());
        navigation.navigate('Login');
    }
    

    useEffect(()=>{
        console.log('loginStatus:',isLoggedIn);
        getId();
        getProduct();
        setIsOrderListPressed(false);
        setIsModifyInfoPressed(false);
    },[]);

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
            {isLoggedIn ? (
                <View style={{flex: 1}}>
                    <Header 
                    showBackButton={true} 
                    title="마이페이지" 
                    showSearchButton={true}
                    showCartButton={true}
                    showMyPageButton={false}
                    showSearchContainer={false} 
                    navigation={navigation}/>

                    {/* body */}
                    <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                        <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                            <View style={[styles.MyPageMenuContainer, {borderWidth: 0, paddingBottom: 10}]}>
                                <Text style={{fontFamily: 'Pretendard-Medium', fontSize: 32, color: '#6E91EB'}}>{user?.name}</Text>
                                <Text style={styles.MainText}> 님 환영합니다</Text>
                            </View>
                            <View style={[styles.MyPageMenuContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                                <View style={{marginBottom: 36}}>
                                    <Text style={styles.MainText}>최근 구매 상품의 연관 상품</Text>
                                </View>
                                
                                <ScrollView 
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.RecommendProductListContainer}>
                                    {products.map((product, index)=>(
                                        <View key={index} style={{flexDirection:'row'}}>
                                            <TouchableOpacity  
                                            style={styles.RecentProductContainer} activeOpacity={0.8}
                                            onPress={()=>{onProductInfo(product.pNum)}}
                                            >
                                            <Image source={{uri:product.pImage}} style={styles.RecentProductImage}/>
                                            <Text style={[styles.MainText,{fontSize:15}]}>{product.pName}</Text>
                                            <Text style={[styles.MainText]}>{product.pPrice} 원</Text>
                                        </TouchableOpacity>
                                        <View style={{width:2, height: '100%', backgroundColor:'#D9D9D9', marginRight: 12}}/>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            <TouchableOpacity 
                            activeOpacity={1} 
                            style={[styles.MyPageMenuContainer,isOrderListPressed && {backgroundColor:'#FFE68C'}]} 
                            onPress={()=>{onOrderListButton(user?.id)}}
                            onPressIn={handleOrderListButtonPressIn}
                            onPressOut={handleOrderListButtonPressOut}
                            >
                                <View style = {styles.MyPageMenuIconContainer}>
                                    <Image 
                                    source={require('../assets/icon/shoppingCart.png')} style={styles.MyPageMenuIcon}  resizeMode='contain'/>
                                </View> 
                                <Text style={styles.MainText}> 주문목록조회</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            activeOpacity={1} 
                            style={[styles.MyPageMenuContainer,isModifyInfoPressed && {backgroundColor:'#FFE68C'}]}
                            onPressIn={handleModifyInfoButtonPressedIn}
                            onPressOut={handleModifyInfoButtonPressedOut}
                            >
                                <View style = {styles.MyPageMenuIconContainer}>
                                    <Image 
                                    source={require('../assets/icon/person.png')} style={styles.MyPageMenuIcon} resizeMode='contain'/>
                                </View> 
                                <Text style={styles.MainText}> 개인정보수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            activeOpacity={0.7} 
                            onPress={onLogoutButton}
                            style={styles.MyPageMenuContainer}>
                                <View style = {styles.MyPageMenuIconContainer}>
                                    <Image 
                                    source={require('../assets/icon/mynaui_logout.png')} style={styles.MyPageMenuIcon} resizeMode='contain'/>
                                </View> 
                                <Text style={[styles.MainText, {color:'#ED7272'}]}> 로그아웃</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            ):(
                <View style={{flex: 1}}>
                    <Text>Login Again</Text>
                </View>
            )}   
        </SafeAreaView>
    )
}
export default MyPageScreen;