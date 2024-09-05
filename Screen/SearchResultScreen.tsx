import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React,{useEffect, useState} from "react";
import styles from "./StyleSheet";
import { Button, Image, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
//
interface MyParams {
    resultKeyword: string;
    // 다른 매개변수가 있다면 여기에 추가
}
interface Product {
    pNum: string,
    pCategory: string,
    pName: string,
    pImage: string,
    pPrice: number,
}

function SearchResultScreen({route, navigation} : {route: RouteProp<ParamListBase> , navigation: NavigationProp<ParamListBase>}){
    //redux
    const {isLoggedIn, userId} = useSelector((state:RootState)=>state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const {resultKeyword} = route.params as MyParams;
    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [scrollToTopButtonVisible, setScrollToTopButtonVisible] = useState<boolean>(false);

    const getResultdata = () =>{
        console.log({resultKeyword});
        //서버요청 작성 필요
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
        setProducts([...jsonResponse.data]);
    };
   
    const onProductButton = (pNum: string) =>{
        navigation.navigate('ProductDetail',{pNum: pNum});
    };

    useEffect(()=>{
        console.log('loginStatus',isLoggedIn);
        getResultdata();
    },[]);

    const scrollViewRef = React.useRef<ScrollView>(null);
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
          }
      };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 100) { // 예시: 스크롤이 100px 이상 내려갔을 때 버튼을 보이게 함
            setScrollToTopButtonVisible(true);
        } else {
            setScrollToTopButtonVisible(false);
        }
    };

    return(
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white',
        }}>
        {isLoggedIn ? (
        <View style={{flex:1}}>
            <TopNavigator
            title="장바구니"
            navigation={navigation}
            />

            <View style={styles.BodyContainer}>
                <View style={styles.SearchResultProductContainer}>
                    <ScrollView 
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        >
                        {products.map((product, index) =>(
                            <TouchableOpacity key={index} onPress={()=>onProductButton(product.pNum)} style={styles.SearchResultProductNode}>
                                <Image source={{uri:product.pImage}} style={styles.SearchResultProductImage}/>
                                <View style={styles.SRProductDetailContainer}>
                                    <Text style={styles.SRProductDetailText}>{product.pCategory}</Text>
                                    <Text style={[styles.SRProductDetailText]}>{product.pName}</Text>
                                    <Text style={   [styles.SRProductDetailText,{fontFamily: 'Pretendard-Bold',alignSelf: 'flex-end'}]}>{product.pPrice}원</Text>
                                </View>
                                
                            </TouchableOpacity> 
                        ))}
                    </ScrollView>
                    {scrollToTopButtonVisible && (
                        <TouchableOpacity onPress={scrollToTop} style={{alignSelf:'center'}}>
                            <AntDesign name='upcircleo'
                            size={42} color='black'/>
                        </TouchableOpacity>
                    )}
                    
                </View>
            </View>
        </View>
        ):(
        <View style={{flex:1}}>
            <Text>Login Again</Text>
        </View>
        )}
    </SafeAreaView>
    );
}
export default SearchResultScreen;