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
    totalProductPrice: number;
    totalDiscountPrice: number;
    paymentCard: string;
    paymentCardNum: string;
    totalPaymentPrice: number;
}

interface OrderProps {
    data: Order;
    navigation: NavigationProp<ParamListBase>;
    route: RouteProp<ParamListBase>;
}

const Order: React.FC<OrderProps> = ({ data, navigation, route }) => {
    //redux
    const { userId } = useSelector((state: RootState) => state.auth);

    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        setOrder(data);
    }, []);

    const onProductInfo = (id: string) => {
        //console.log(id);
        navigation.navigate('ProductDetail', { pNum: id });
    }

    return (
        <>
            {order && (
                <View style={OrderListStyles.orderContainer}>
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
                    {order.productList.map((product, index) => (
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
                            <View style={{ width: '100%', height: 2, backgroundColor: '#D9D9D9', marginTop: 12, }}></View>
                        </TouchableOpacity>
                    ))}

                </View>)}

        </>
    );
}
export default Order;