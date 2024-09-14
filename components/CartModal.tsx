import React, { useRef, useState, useEffect } from "react";
import { Modal, TouchableOpacity, View, Text, Animated, Easing, ScrollView, Image } from "react-native";
import LocationModalStyles from "../styles/LocationModalStyles";
import GlobalStyles from "../styles/GlobalStyles";
import useGetLocation from "../customHooks/useGetLocation";
import { UpwardIcon, PlusIcon, MinusIcon } from "../assets/icons";
import formatNumber from "../customHooks/fomatNumber";
import useGetRecommendProductList from "../customHooks/useGetRecommendProductList";
import MyPageStyles from "../styles/MypageScreenstyles";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface Prop {
    modalVisible: boolean,
    toggleAddCartModal: () => void,
    price: number | undefined,
    navigation: NavigationProp<ParamListBase>
}

function CartModal({ modalVisible, toggleAddCartModal, price, navigation }: Prop) {
    const [visible, setVisible] = useState(modalVisible);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [count, setCount] = useState<number>(1);

    const [initVisible, setInitVisible] = useState<boolean>(true);
    const [resVisible, setResVisible] = useState<boolean>(false);

    const slideAnim = useRef(new Animated.Value(500)).current;
    const resSlideAnim = useRef(new Animated.Value(500)).current;
    const { product } = useGetRecommendProductList();
    const { location, distance } = useGetLocation();

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
        setResVisible(false);
        setVisible(false);
        if (price) setTotalPrice(price);
        setCount(1);
    };

    // 수량 증가/감소 핸들러
    const increaseCount = () => count < 99 && setCount(count + 1);
    const decreaseCount = () => count > 1 && setCount(count - 1);

    // 제품 정보 화면으로 이동
    const onProductInfo = (id: string) => {
        animateModal(slideAnim, 500, () => {
            setVisible(false);
            navigation.navigate('ProductDetail', { pNum: id });
        });
    };

    // 장바구니 담기 핸들러
    const addCartHandler = () => {
        animateModal(slideAnim, 500, () => {
            setInitVisible(false);
            setResVisible(true);
            animateModal(resSlideAnim, 500);
        });
    };

    // 장바구니로 이동
    const onCartButton = () => navigation.navigate('Cart');

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

                {resVisible && (<Animated.View style={[
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
                    <View style={[LocationModalStyles.item, { borderBottomColor: '#D9D9D9', borderBottomWidth: 2 }]}>
                        <Text style={GlobalStyles.mediumText}>
                            장바구니에 상품이 담겼습니다!
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onCartButton}
                        >
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 18, color: '#6E91EB' }]}>
                                장바구니 확인하기
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[LocationModalStyles.item]}>
                        <Text style={[GlobalStyles.regularText, { fontSize: 18, color: '#696969' }]}>
                            이런 상품은 어떠세요?
                        </Text>
                    </View>
                    <View style={LocationModalStyles.item}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={MyPageStyles.recommendListContainer}
                        >
                            {product.map((item, index) => (
                                <View key={index} style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => { onProductInfo(item.pNum) }}
                                        style={MyPageStyles.recommendProductContainer}
                                        activeOpacity={0.8}
                                    >
                                        <Image source={{ uri: item.pImage }} style={[MyPageStyles.productImageContainer, { marginBottom: 12, }]} />
                                        <Text
                                            numberOfLines={1}
                                            style={[GlobalStyles.regularText, { fontSize: 16 }]}>{item.pName}</Text>
                                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 18 }]}>{item.pPrice} 원</Text>
                                    </TouchableOpacity>
                                    {/* 오른쪽 경계선이 마지막 요소에는 표시되지 않도록 조건 추가 */}
                                    {index !== product.length - 1 && (
                                        <View style={{ width: 1, height: '100%', backgroundColor: '#D9D9D9', marginRight: 8 }} />
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>)}


            </TouchableOpacity>
        </Modal>
    );
}

export default CartModal;
