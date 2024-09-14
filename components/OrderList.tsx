import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../screen/StyleSheet";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OrderListStyles } from "../styles/OrderListStyles";
import GlobalStyles from "../styles/GlobalStyles";
import formatNumber from "../customHooks/fomatNumber";

interface Product {
    pNum: string;
    pCategory: string;
    pName: string;
    pImage: string;
    pPrice: number;
    quantity: number;  // 수량 추가
}

interface Order {
    id: string;
    orderDate: string;
    productList: Product[];
    tag: boolean; // true: online, false: offline
}

interface OrderListProps {
    data: Order[];
    navigation: NavigationProp<ParamListBase>;
    route: RouteProp<ParamListBase>;
}

//TypeScript의 타입 추론을 통해 컴포넌트의 props 타입을 명시적으로 정의하고, 
//컴포넌트 내부에서 props를 구조 분해 할당할 때 적절한 타입 검사를 수행하기 위함입니다.
function OrderList({ data, navigation, route }: OrderListProps) {
    const { userId } = useSelector((state: RootState) => state.auth);

    const [orderList, setOrderList] = useState<Order[]>([]);

    useEffect(() => {
        setOrderList(data);
    }, [data]);

    const onOrderDetailButton = (order: Order) => {
        navigation.navigate('OrderListDetail', { order: order });
    }
    const onProductInfo = (id: string) => {
        //console.log(id);
        navigation.navigate('ProductDetail', { pNum: id });
    }

    return (
        <>
            {orderList.map((order, index) => (
                <View key={index} style={OrderListStyles.orderContainer}>
                    {/* OrderDate */}
                    <View style={OrderListStyles.orderContent}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>{order.orderDate}</Text>
                    </View>
                    {/* 오프라인 온라인 */}
                    <View style={[OrderListStyles.orderContent, { paddingVertical: 12 }]}>
                        {order.tag ?
                            (<Text style={[GlobalStyles.regularText, { color: '#D10000', fontSize: 18 }]}>온라인 구매</Text>)
                            : (<Text style={[GlobalStyles.regularText, { color: '#0262F1', fontSize: 18 }]}>오프라인 구매</Text>)}
                    </View>
                    {/* 주문목록요약 : 3개 까지만 보여줌*/}
                    {order.productList.slice(0, 2).map((product, index) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={index}
                            style={[OrderListStyles.orderContent]}
                            onPress={() => onProductInfo(product.pNum)}>
                            <View style={OrderListStyles.orderItem}>
                                {/* 상품이미지 */}
                                <View style={OrderListStyles.imageContainer}>
                                    <Image source={{ uri: product.pImage }} style={styles.OrderProductImage} />
                                </View>
                                {/* 상품명 */}
                                <View style={OrderListStyles.textContainer}>
                                    <View style={OrderListStyles.textItem}>
                                        <Text style={[GlobalStyles.regularText, { fontSize: 18 }]}>{product.pName}</Text>
                                    </View> 
                                    <View style={OrderListStyles.textItem}>
                                        <Text style={[GlobalStyles.mediumText, { color: '#696969' }]}>수량: {product.quantity}개</Text>
                                    </View>
                                    <View style={OrderListStyles.textItem}>
                                        <Text style={[GlobalStyles.semiBoldText]}>{formatNumber(product.pPrice)} 원</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '100%', height: 2, backgroundColor: '#D9D9D9', marginTop: 12,}}></View>
                        </TouchableOpacity>
                    ))}
                    {order.productList.length > 2 && (
                        <View style={[OrderListStyles.orderContent, { alignItems: 'center', paddingVertical: 0 }]}>
                            <Text style={[GlobalStyles.BoldText, { fontSize: 18 }]}> . . . </Text>
                        </View>
                    )}
                    <View style={[OrderListStyles.orderContent, { alignItems: 'center'}]}>
                        <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => { onOrderDetailButton(order) }}>
                            <Text style={[styles.MediumText, { fontSize: 20, color: '#0262F1' }]}>상세보기</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            ))}
        </>
    );
};

export default OrderList;
