import React, { useRef, useState, useEffect } from "react";
import { Modal, TouchableOpacity, View, Text, Animated, Easing } from "react-native";
import LocationModalStyles from "../styles/LocationModalStyles";
import Location from "./animations/location";
import AnimationStyles from "../styles/AnimationStyles";
import GlobalStyles from "../styles/GlobalStyles";
import useGetLocation from "../customHooks/useGetLocation";
import { UpwardIcon, PlusIcon, MinusIcon } from "../assets/icons";
import formatNumber from "../customHooks/fomatNumber";

interface Prop {
    modalVisible: boolean,
    toggleLocationModal: () => void,
    price: number | undefined
}

function CartModal({ modalVisible, toggleLocationModal, price }: Prop) {
    const [visible, setVisible] = useState(modalVisible);
    const [totalPrice, setTotalPrice] = useState<number>(0); // 초기값을 0으로 설정
    const [count, setCount] = useState<number>(1);
    const slideAnim = useRef(new Animated.Value(500)).current; // 장바구니 담기 
    const resSlideAnim = useRef(new Animated.Value(500)).current; // 장바구니 담기 결과

    const { location, distance } = useGetLocation();

    useEffect(() => {
        // 가격이 변경될 때 totalPrice 업데이트
        if (price) {
            setTotalPrice(price * count);
        }
    }, [count, price]);

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
                if (price) {
                    setTotalPrice(price);
                }
                setCount(1);
            });
        }
    }, [modalVisible, price]);

    const increaseCount = () => {
        if (count < 99) {
            setCount(count + 1);
        }
    };

    const decreaseCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const addCartHandler = () => {
        console.log(count);
        //카트 반영 처리 해야됨
        Animated.timing(slideAnim, {
            toValue: 500,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            if (price) {
                setTotalPrice(price);
            }
            setCount(1);
        });

    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={toggleLocationModal}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={LocationModalStyles.background}
            >
                <Animated.View style={[
                    LocationModalStyles.content,
                    {
                        width: '40%',
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <TouchableOpacity
                        onPress={toggleLocationModal}
                        activeOpacity={0.7}
                        style={{ marginBottom: 24, }}
                    >
                        <UpwardIcon width={24} height={24} style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>

                    <View style={LocationModalStyles.item}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 24, }]}>
                            {formatNumber(totalPrice)} 원
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPressIn={decreaseCount}
                            >
                                <MinusIcon width={40} height={40} />
                            </TouchableOpacity>
                            <Text 
                                style={[GlobalStyles.mediumText, { fontSize: 24, width: 32, textAlign: 'center'}]}
                            >
                                {formatNumber(count)}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPressIn={increaseCount}
                            >
                                <PlusIcon width={40} height={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[LocationModalStyles.item, { justifyContent: 'flex-end' }]}>
                        <TouchableOpacity
                            onPress={addCartHandler}
                            activeOpacity={0.8}
                            style={LocationModalStyles.button}
                        >
                            <Text style={GlobalStyles.semiBoldText}>
                                장바구니 담기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}

export default CartModal;
