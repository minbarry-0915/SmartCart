import { NavigationProp, ParamListBase, RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "./StyleSheet";

interface MyParams{
    orderId: string,
}

function OrderListDetailScreen ({route, navigation}:{route: RouteProp<ParamListBase>, navigation:NavigationProp<ParamListBase>}){
    const {orderId} = route.params as MyParams;
    console.log(orderId);

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <Text> this is orderListDetailScreen</Text>
            <Text> {orderId} </Text>
        </SafeAreaView>    
    );

}
export default OrderListDetailScreen;