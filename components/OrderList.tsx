import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../screen/StyleSheet";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OrderListStyles } from "../styles/OrderListStyles";
import GlobalStyles from "../styles/GlobalStyles";
import formatNumber from "../customHooks/fomatNumber";
import maskNumber from "../customHooks/maskString";
import { Order } from "../types";

interface OrderListProps {
    data: Order;
    navigation: NavigationProp<ParamListBase>;
    route: RouteProp<ParamListBase>;
    mode?: 'briefMode' | 'detailedMode'; // 모드를 두 개로 한정
}

function OrderItem({ data, navigation, route, mode = 'briefMode' }: OrderListProps) {
    const { userId } = useSelector((state: RootState) => state.auth);

    const [order, setOrder] = useState<Order | undefined>(data);

    useEffect(() => {
        setOrder(data);
    }, [data]);

    const onOrderDetailButton = (order: Order) => {
        navigation.navigate('OrderListDetail', { order });
    };

    const onProductInfo = (id: string) => {
        navigation.navigate('ProductDetail', { pNum: id });
    };

    if (!order) {
        return null; // order가 undefined일 경우 아무것도 렌더링하지 않음
    }

    return (
        <View style={OrderListStyles.orderContainer}>
            {/* OrderDate */}
            <View style={OrderListStyles.orderContent}>
                <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>{order.orderDate}</Text>
            </View>

            {/* 구매 타입 */}
            <View style={[OrderListStyles.orderContent, { paddingVertical: 12 }]}>
                {order.tag ? (
                    <Text style={[GlobalStyles.regularText, { color: '#D10000', fontSize: 18 }]}>온라인 구매</Text>
                ) : (
                    <Text style={[GlobalStyles.regularText, { color: '#0262F1', fontSize: 18 }]}>오프라인 구매</Text>
                )}
            </View>

            {/* 제품 목록 표시 */}
            {(mode === 'briefMode' ? order.orderItems.slice(0, 3) : order.orderItems).map((product, index) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    style={[OrderListStyles.orderContent]}
                    onPress={() => onProductInfo(product.product.Product_id.toString())}>
                    <View style={OrderListStyles.orderItem}>
                        {/* 상품이미지 */}
                        <View style={OrderListStyles.imageContainer}>
                            <Image source={{ uri: product.product.Main_image }} style={styles.OrderProductImage} />
                        </View>

                        {/* 상품명 */}
                        <View style={OrderListStyles.textContainer}>
                            <View style={OrderListStyles.textItem}>
                                <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>{product.product.Product_name}</Text>
                            </View>

                            <View style={OrderListStyles.textItem}>
                                <Text style={[GlobalStyles.mediumText, { color: '#696969' }]}>수량: {product.quantity}개</Text>
                            </View>

                            <View style={OrderListStyles.textItem}>
                                <Text style={[GlobalStyles.semiBoldText]}>{formatNumber(product.product.Price)} 원</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 2, backgroundColor: '#D9D9D9', marginTop: 12 }} />
                </TouchableOpacity>
            ))}

            {/* '...' 표시 및 상세보기 버튼 */}
            {mode === 'briefMode' ? (
                <>
                    {order.orderItems.length >= 3 && (
                        <View style={[OrderListStyles.orderContent, { alignItems: 'center', paddingVertical: 0 }]}>
                            <Text style={[GlobalStyles.BoldText, { fontSize: 18 }]}> . . . </Text>
                        </View>
                    )}

                    <View style={[OrderListStyles.orderContent, { alignItems: 'center' }]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => onOrderDetailButton(order)}>
                            <Text style={[styles.MediumText, { fontSize: 20, color: '#0262F1' }]}>상세보기</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    {/* 총 결제 내용 */}
                    <View style={OrderListStyles.orderContent}>
                        <View style={OrderListStyles.totalInfoContent}>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>총 상품금액</Text>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>{formatNumber(order.totalProductPrice)} 원</Text>
                        </View>
                        <View style={OrderListStyles.totalInfoContent}>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>쿠폰 할인금액</Text>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>{formatNumber(order.totalDiscountPrice)} 원</Text>
                        </View>
                        <View style={OrderListStyles.totalInfoContent}>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>결제 정보</Text>
                            <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>{[order.paymentCard, '  ', maskNumber(order.paymentCardNum)]}</Text>
                        </View>
                        <View style={OrderListStyles.totalInfoContent}>
                            <Text style={[GlobalStyles.mediumText, { fontSize: 20, color: '#E33434' }]}>총 결제금액</Text>
                            <Text style={[GlobalStyles.mediumText, { fontSize: 20, color: '#E33434' }]}> {formatNumber(order.totalPaymentPrice)} 원</Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

export default OrderItem;
