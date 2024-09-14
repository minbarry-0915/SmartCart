import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./StyleSheet";
import OrderComponent from "../components/Order";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
//
interface MyParams{
    order: Order,
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
    const { order } = route.params as MyParams;

    useEffect(()=>{
        console.log('orderId:',order.id);
    },[])

    const onOrderListButton = () => {
        navigation.goBack();
    };

    return(
        <View style={{
            flex: 1,
        }}>
            <LinearGradient
                colors={['#FFFFFF', '#D9D9D9', '#000000']}
                style={{flexGrow: 1}}
            >
            <TopNavigator
            title="주문목록조회"
            navigation={navigation}
            />

            {order && (
                    <ScrollView 
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={GlobalStyles.scrollContainer}>
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
                                <Text style={[GlobalStyles.semiBoldText, {color: 'white'}]}>목록</Text>
                            </TouchableOpacity>
                        </View>

                        
                    </ScrollView>
                
            )}
            </LinearGradient>
        </View>    
    );

}
export default OrderListDetailScreen;