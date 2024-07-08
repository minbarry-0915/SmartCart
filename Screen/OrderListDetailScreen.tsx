import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "./StyleSheet";
import OrderComponent from "../Components/Order";
//
interface MyParams{
    orderId: string,
}

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
    
    totalProductPrice: number;
    totalDiscountPrice: number;
    paymentCard: string;
    paymentCardNum: string;
    totalPaymentPrice: number;
}

function OrderListDetailScreen ({route, navigation}:{route: RouteProp<ParamListBase>, navigation:NavigationProp<ParamListBase>}){
    const {orderId} = route.params as MyParams;
    
    const [order, setOrder] = useState<Order>();

    const getOrderList = () =>{
        const jsonResponse ={
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
                },
                {
                    "pNum": "P004",
                    "pCategory": "Home Appliance",
                    "pName": "Blender",
                    "pImage": "https://example.com/images/blender.jpg",
                    "pPrice": 49.99,
                    "quantity": 2
                }
            ],
            "tag": true,
            "totalProductPrice": 1000000,
            "totalDiscountPrice": 100,
            "paymentCard": '신한카드',
            "paymentCardNum": '4221555845457878',
            "totalPaymentPrice": 999900,
        } 
        setOrder(jsonResponse);
    };

    useEffect(()=>{
        console.log('oderId:',orderId);
        getOrderList();
    },[])

    const onOrderListButton = () => {
        navigation.goBack();
    };

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <Header
            title="주문목록조회"
            showBackButton={true}
            showCartButton={false}
            showMyPageButton={true}
            showSearchButton={true}
            showSearchContainer={false}
            navigation={navigation}
            />

            {order && (
                <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                    <ScrollView 
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.ProductDetailScrollContainer}>
                        <OrderComponent
                        data={order}
                        navigation={navigation}
                        route={route}
                        />
                        <View style={{width: '50%'}}>
                            <TouchableOpacity
                            onPress={onOrderListButton}
                            activeOpacity={0.7}
                            style={styles.OrderListButton}>
                                <Text style={[styles.MainText, {color: 'white'}]}>목록</Text>
                            </TouchableOpacity>
                        </View>

                        
                    </ScrollView>
                </View>
                
            )}
            
        </SafeAreaView>    
    );

}
export default OrderListDetailScreen;