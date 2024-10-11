import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {  ScrollView, Text, View } from "react-native";
import OrderItem from "../components/OrderList";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import LinearGradient from "react-native-linear-gradient";
import GlobalStyles from "../styles/GlobalStyles";
import useGetOrderList from "../customHooks/useGetOrderList";
import Loading from "../components/animations/loading";
import SearchResultScreen from "./SearchResultScreen";
import SearchStyles from "../styles/SearchScreenStyles";

function OrderListScreen({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: RouteProp<ParamListBase> }) {
    //redux
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const { loading, error, orderList=[] } = useGetOrderList();

    useEffect(() => {
        console.log('loginStatus:', isLoggedIn);
    }, [])


    return (
        <View style={{
            flex: 1,
        }}>
            <LinearGradient
                colors={['#FFFFFF', '#D9D9D9', '#000000']}
                style={{ flexGrow: 1 }}
            >
                <TopNavigator
                    title="주문목록조회"
                    navigation={navigation}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={GlobalStyles.scrollContainer}>
                        {loading ? (
                            <Loading style={{width: 200, height: 200}}/>
                        ) : orderList.length !== 0 ? (
                            orderList.map((order, index) => (

                                <OrderItem
                                    key={order.id}
                                    data={order}
                                    navigation={navigation}
                                    route={route}
                                    mode='briefMode'
                                />
                            ))
                        ):(
                            <View style={[SearchStyles.content,{alignItems: 'center'}]}>
                                <Text style={[GlobalStyles.semiBoldText, { color: 'black', fontSize: 24, marginBottom: 24 }]}>{error}</Text>
                            </View>
                        )}
                    

                </ScrollView>
            </LinearGradient>

        </View>
    )
}
export default OrderListScreen;
