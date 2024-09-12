import React, { useEffect, useReducer, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import UpwardIcon from "../assets/icons/upward.svg";
import LocationModalStyles from "../styles/LocationModalStyles";
import GlobalStyles from "../styles/GlobalStyles";

interface Prop {
    modalVisible: boolean,
}

function RecommendModal({modalVisible}:Prop){
    const slideAnim = useRef(new Animated.Value(500)).current;
    const [visible, setVisible] = useState<boolean>(false);
    
    useEffect(() => {
        if (modalVisible) {
            setVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 500,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [modalVisible]);

    return (
        <>
        {visible && (
            <Animated.View style={[
                LocationModalStyles.content,
                {
                    width: '40%',
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <View style={[LocationModalStyles.item, { justifyContent: 'flex-end' }]}>
                    <Text>siiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</Text>
                </View>
            </Animated.View>
        )}
        </>
    );
}

export default RecommendModal;