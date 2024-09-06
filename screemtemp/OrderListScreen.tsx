import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import styles from "./StyleSheet";
import OrderList from "../components/OrderList";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
//

interface Product {
    pNum: string;
    pCategory: string;
    pName: string;
    pImage: string;
    pPrice: number;
    quantity: number;  // 수량 추가
}

interface Order {
    id: string;
    orderDate: string;
    productList: Product[];
    tag: boolean; // true: online, false: offline
}


function OrderListScreen({navigation, route}:{navigation:NavigationProp<ParamListBase>, route:RouteProp<ParamListBase>}){
    //redux
    const {isLoggedIn, userId} = useSelector((state: RootState)=> state.auth);

    const [orderlist, setOrderList] = useState<Order[]>([]); 

    useEffect(()=>{
        console.log('loginStatus:',isLoggedIn);
        getOrderList();
    },[])

    const getOrderList = () => {
        const jsonResponse = {
            "orders": [
                {
                    "id": "order12345",
                    "orderDate": "2024-05-28T12:34:56.789Z",
                    "productList": [
                        {
                            "pNum": "P001",
                            "pCategory": "Electronics",
                            "pName": "Smartphone",
                            "pImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                            "pPrice": 699.99,
                            "quantity": 1
                        },
                        {
                            "pNum": "P002",
                            "pCategory": "Home Appliance",
                            "pName": "Blender",
                            "pImage": "https://example.com/images/blender.jpg",
                            "pPrice": 49.99,
                            "quantity": 2
                        },
                        {
                            "pNum": "P003",
                            "pCategory": "Home Appliance",
                            "pName": "Blender",
                            "pImage": "https://example.com/images/blender.jpg",
                            "pPrice": 49.99,
                            "quantity": 2
                        }
                    ],
                    "tag": true
                },
                {
                    "id": "order12346",
                    "orderDate": "2024-05-27T11:23:45.678Z",
                    "productList": [
                        {
                            "pNum": "P003",
                            "pCategory": "Books",
                            "pName": "TypeScript Handbook",
                            "pImage": "https://example.com/images/typescript_handbook.jpg",
                            "pPrice": 29.99,
                            "quantity": 3
                        },
                        {
                            "pNum": "P004",
                            "pCategory": "Clothing",
                            "pName": "T-shirtsssssssssssssssssssssssssssssssssssssssssss",
                            "pImage": "https://example.com/images/tshirt.jpg",
                            "pPrice": 19.99,
                            "quantity": 5
                        }
                    ],
                    "tag": false
                },
                {
                    "id": "order12347",
                    "orderDate": "2024-05-26T10:12:34.567Z",
                    "productList": [
                        {
                            "pNum": "P005",
                            "pCategory": "Grocery",
                            "pName": "Organic Apples",
                            "pImage": "https://example.com/images/apples.jpg",
                            "pPrice": 5.99,
                            "quantity": 10
                        }
                    ],
                    "tag": true
                }
            ]
        };
        setOrderList(jsonResponse.orders);
    };

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white'}}>
            <TopNavigator
            title="장바구니"
            navigation={navigation}
            />

            <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                    <OrderList data={orderlist} navigation={navigation} route={route}/>     
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
export default OrderListScreen;
