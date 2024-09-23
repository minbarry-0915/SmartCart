import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";

function Location({style}){
    return(
        <View>
            <LottieView 
            style={style}
            source={require('../../assets/animation/location.json')}
            autoPlay
            loop
            />
        </View>
        
    );
}
export default Location;