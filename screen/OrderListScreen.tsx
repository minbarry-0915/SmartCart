import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import OrderItem from "../components/OrderList";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import LinearGradient from "react-native-linear-gradient";
import GlobalStyles from "../styles/GlobalStyles";
import useGetOrderList from "../customHooks/useGetOrderList";

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

                    {orderList.map((order, index) =>(
                        <>
                            <OrderItem
                            data= {order}
                            navigation={navigation}
                            route={route}
                            mode='briefMode'
                            />
                        </>
                    ))}

                </ScrollView>
            </LinearGradient>

        </View>
    )
}
export default OrderListScreen;
