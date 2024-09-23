import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import OrderItem from "../components/OrderList";
import { Order } from "../types";

interface MyParams {
    order: Order,
}

function OrderListDetailScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    const { order } = route.params as MyParams;

    useEffect(() => {
        console.log('orderId:', order.id);
    }, [])

    const onOrderListButton = () => {
        navigation.goBack();
    };

    const onProductInfo = (id: string) => {
        //console.log(id);
        navigation.navigate('ProductDetail', { pNum: id });
    }

    if (!order) {
        return null; // order가 undefined일 경우 아무것도 렌더링하지 않음
    }

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

                    <OrderItem
                        data={order}
                        navigation={navigation}
                        route={route}
                        mode='detailedMode'
                    />

                    <View style={{ width: '45%' }}>
                        <TouchableOpacity
                            onPress={onOrderListButton}
                            activeOpacity={0.7}
                            style={[GlobalStyles.blackButton, { elevation: 10 }]}>
                            <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>목록</Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>


            </LinearGradient>
        </View>
    );

}
export default OrderListDetailScreen;