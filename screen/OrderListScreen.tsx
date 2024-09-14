import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import OrderList from "../components/OrderList";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import LinearGradient from "react-native-linear-gradient";
import GlobalStyles from "../styles/GlobalStyles";
import useGetOrderList from "../customHooks/useGetOrderList";
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


function OrderListScreen({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: RouteProp<ParamListBase> }) {
    //redux
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const { loading, orderList } = useGetOrderList();

    useEffect(() => {
        console.log('loginStatus:', isLoggedIn);
    }, [])


    return (
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

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={GlobalStyles.scrollContainer}>
                    <OrderList 
                    data={orderList} 
                    navigation={navigation} 
                    route={route} />
                </ScrollView>
            </LinearGradient>

        </View>
    )
}
export default OrderListScreen;
