import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";

function Loading({style}){
    return(
        <View>
            <LottieView 
            style={style}
            source={require('../../assets/animation/loading.json')}
            autoPlay
            loop
            />
        </View>
        
    );
}
export default Loading;