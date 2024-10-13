import React, { useEffect, useReducer, useRef, useState } from "react";
import { Animated, Easing, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UpwardIcon } from "../assets/icons";
import LocationModalStyles from "../styles/LocationModalStyles";
import GlobalStyles from "../styles/GlobalStyles";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import MyPageStyles from "../styles/MypageScreenstyles";
import formatNumber from "../customHooks/fomatNumber";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "./animations/loading";

interface Prop {
    modalVisible: boolean,
    toggleRecommendationModal: () => void,
    navigation: NavigationProp<ParamListBase>,
    closeCartModal: () => void,
}

function RecommendModal({
    modalVisible,
    toggleRecommendationModal,
    navigation,
    closeCartModal
}: Prop) {
    const slideAnim = useRef(new Animated.Value(500)).current;
    const [visible, setVisible] = useState<boolean>(false);
    const { isLoggedIn, userId, recommendations: products, isLoadingRecommendations } = useSelector((state: RootState) => state.auth);


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

    // 제품 정보 화면으로 이동
    const onProductInfo = (id: string) => {
        animateModal(slideAnim, 500, () => {
            setVisible(false);
            closeCartModal();
            navigation.navigate('ProductDetail', { productId: id });
        });
    };

    // 장바구니로 이동
    const onCartButton = () => {
        animateModal(slideAnim, 500, () => {
            toggleRecommendationModal();
            closeCartModal();
        });

        navigation.navigate('Cart')
    };

    useEffect(() => {
        if (modalVisible) {
            setVisible(true);
            animateModal(slideAnim, 0);
        } else {
            animateModal(slideAnim, 500, () => {
                setVisible(false);
            })
        }
    }, [modalVisible]);

    const closeRequestHandler = () => {
        animateModal(slideAnim, 500, () => {
            toggleRecommendationModal(); //추천모달닫음
            closeCartModal();//전체 모달 종료
        });

    }

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
                    <TouchableOpacity
                        onPress={closeRequestHandler}
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
                            {isLoadingRecommendations ? (
                                <Loading style={{ width: 150, height: 150 }} />
                            ) : (
                                products.map((item, index) => (
                                    <View key={index} style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => { onProductInfo(item.Product_id) }}
                                            style={MyPageStyles.recommendProductContainer}
                                            activeOpacity={0.8}
                                        >
                                            <Image source={{ uri: item.Main_image }} style={[MyPageStyles.productImageContainer, { marginBottom: 12, }]} />
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.regularText, { fontSize: 16 }]}>{item.Product_name}</Text>
                                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 18 }]}>{formatNumber(item.Price)} 원</Text>
                                        </TouchableOpacity>
                                        {/* 오른쪽 경계선이 마지막 요소에는 표시되지 않도록 조건 추가 */}
                                        {index !== products.length - 1 && (
                                            <View style={{ width: 1, height: '100%', backgroundColor: '#D9D9D9', marginRight: 8 }} />
                                        )}
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </Animated.View>
            )}
        </>
    );
}

export default RecommendModal;