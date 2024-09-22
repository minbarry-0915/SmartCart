import React, { useRef, useState, useEffect } from "react";
import { Modal, TouchableOpacity, View, Text, Animated, Easing, } from "react-native";
import LocationModalStyles from "../styles/LocationModalStyles";
import GlobalStyles from "../styles/GlobalStyles";
import { UpwardIcon, PlusIcon, MinusIcon } from "../assets/icons";
import formatNumber from "../customHooks/fomatNumber";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import RecommendModal from "./RecommendModal";

interface Prop {
    modalVisible: boolean,
    toggleAddCartModal: () => void,
    price: number | undefined,
    discount: number | undefined,
    navigation: NavigationProp<ParamListBase>
}

function CartModal({ modalVisible, toggleAddCartModal, price, discount, navigation }: Prop) {
    const [visible, setVisible] = useState(modalVisible);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [count, setCount] = useState<number>(1);

    const [initVisible, setInitVisible] = useState<boolean>(true);
    const [resultVisible, setResultVisible] = useState<boolean>(false);

    const slideAnim = useRef(new Animated.Value(500)).current;
    const resSlideAnim = useRef(new Animated.Value(500)).current;

    // 가격이 변경될 때 totalPrice 업데이트
    useEffect(() => {
        if (price) {
            setTotalPrice(price * count);
        }
    }, [count, price]);

    // 모달이 열리고 닫힐 때 애니메이션 처리
    useEffect(() => {
        if (modalVisible) {
            handleModalOpen();
        } else {
            handleModalClose();
        }
    }, [modalVisible, price]);

    // 모달 열기 애니메이션
    const handleModalOpen = () => {
        setVisible(true);
        setInitVisible(true);
        animateModal(slideAnim, 0);
    };

    // 모달 닫기 애니메이션
    const handleModalClose = () => {
        animateModal(slideAnim, 500, () => {
            resetModalState();
        });
    };

    // 애니메이션 실행 함수
    const animateModal = (anim: Animated.Value, toValue: number, callback?: () => void) => {
        Animated.timing(anim, {
            toValue,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            if (callback) callback();
        });
    };

    // 모달 상태 초기화
    const resetModalState = () => {
        setInitVisible(false);
        setResultVisible(false);
        setVisible(false);
        if (price) setTotalPrice(price);
        setCount(1);
    };

    // 수량 증가/감소 핸들러
    const increaseCount = () => count < 99 && setCount(count + 1);
    const decreaseCount = () => count > 1 && setCount(count - 1);

    // 장바구니 담기 핸들러
    const addCartHandler = () => {
        animateModal(slideAnim, 500, () => {
            setInitVisible(false);
            setResultVisible(true);
            //animateModal(resSlideAnim, 500);
        });
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={toggleAddCartModal}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={LocationModalStyles.background}
            >
                {initVisible && (<Animated.View style={[
                    LocationModalStyles.content,
                    {
                        width: '40%',
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <TouchableOpacity
                        onPress={toggleAddCartModal}
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
                                style={[GlobalStyles.mediumText, { fontSize: 24, width: 32, textAlign: 'center' }]}
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
                </Animated.View>)}

                {resultVisible && (
                    <RecommendModal
                        modalVisible={resultVisible}
                        toggleRecommendationModal={() => { }}
                        navigation={navigation}
                        closeCartModal={toggleAddCartModal}
                    />

                )}
            </TouchableOpacity>
        </Modal>
    );
}

export default CartModal;
