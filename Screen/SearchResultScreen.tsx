import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React,{useEffect, useState} from "react";
import styles from "./StyleSheet";
import { Image, ScrollView, Text, View } from "react-native";

interface MyParams {
    keyword: string;
    // 다른 매개변수가 있다면 여기에 추가
}
interface Product {
    pNum: string,
    pCategory: string,
    pName: string,
    pImage: string,
    pPrice: number,
}

function SearchResultScreen({route} : {route: RouteProp<ParamListBase> }){
    const {keyword} = route.params as MyParams;
    const [products, setProducts] = useState<Product[]>([]);
    const getResultdata = () =>{
        //서버요청 작성 필요
        const jsonResponse = {
            "data": [
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

    useEffect(()=>{
        getResultdata();
    },[]);

    return(
        <View>
            <ScrollView>
                {products.map((product, index) =>(
                    <View key={product.pNum}>
                        <Text>{product.pName}</Text>
                        <Text>{product.pCategory}</Text>
                        <Image source={{uri:product.pImage}} style={{width: 200, height: 200}}/>
                        <Text>{product.pPrice}원</Text>
                    </View> 
                ))}
            </ScrollView>
        </View>
    );
}
export default SearchResultScreen;