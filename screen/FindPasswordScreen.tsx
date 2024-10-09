import { ScrollView, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import TopNavigator from "../components/TopNavigator";

interface Props{
    navigation: NavigationProp<ParamListBase>

}

function FindPasswordScreen({navigation}: Props) {
    return (
        <View>
            <LinearGradient
                colors={['#FFFFFF', '#D9D9D9', '#000000']}
            >
                <TopNavigator
                    title="마이페이지"
                    navigation={navigation}
                />
                
            </LinearGradient>
        </View>
    );
}
export default FindPasswordScreen;