import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../Screen/StyleSheet";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

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

const Order: React.FC<OrderProps> = ({data,navigation,route}) =>{
    //redux
    const {userId} = useSelector((state: RootState)=> state.auth);
    
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        // 상품명 글자수 제한
        if (data) {
            const ParsedData = {
                ...data,
                productList: data.productList.map(product=>({
                    ...product,
                    pName: product.pName.length > 20 ? product.pName.slice(0,20) + '...': product.pName
                }))
            };
            setOrder(ParsedData);
        }
    }, [data]);

    const onProductInfo = (id:string) =>{
        //console.log(id);
        navigation.navigate('ProductDetail', {pNum: id});
    }

    return (
        <View style = {{width: '100%',justifyContent: 'center',alignItems:'center'}}>
            {order && (
                <View style={styles.OrderContainer}>
                    {/* OrderDate */}
                    <View style={styles.OrderSubContainer}>
                        <Text style={[styles.SemiBoldText,{fontSize:24}]}>{order.orderDate}</Text>
                    </View>
                    <View style={[styles.OrderSubContainer,{paddingVertical: 12}]}>
                        {order.tag ? (<Text style={[styles.MainText, {color: '#696969', fontSize: 18}]}>온라인 구매</Text>) : (<Text style={[styles.MainText, {color: '#696969', fontSize: 18}]}>오프라인 구매</Text>)}
                    </View>
                    {order.productList.map((product, index)=>(
                        <TouchableOpacity activeOpacity={0.7} key={index} style={[styles.OrderSubContainer,{width:'100%'}]} onPress={()=>onProductInfo(product.pNum)}>
                            <View style={{flexDirection:'row', marginBottom:12}}>
                                <View style={styles.OrderProductImageContainer}>
                                    <Image source={{uri:product.pImage}} style={styles.OrderProductImage}/>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style = {styles.OrderListPNameContainer}>
                                        <Text style = {[styles.MainText, {fontSize: 18}]}>{product.pName}</Text>
                                    </View>    
                                    <View style = {{alignSelf: 'baseline'}}>
                                        <Text style = {styles.OrderProductQuantityText}>수량: {product.quantity}개</Text>
                                        <Text style = {[styles.MainText, {fontSize: 20}]}>{product.pPrice}원</Text>
                                    </View>
                                </View> 
                            </View>
                            <View style={{width: '100%', height: 2,backgroundColor:'#D9D9D9'}}/>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.OrderTotalContainer}>
                        <View style={styles.OrderTotalContent}>
                            <Text style={styles.LightText}>총 상품 금액</Text>
                            <Text style={styles.LightText}>{order.totalProductPrice} 원</Text>
                        </View>
                        <View style={styles.OrderTotalContent}>
                            <Text style={styles.LightText}>쿠폰 할인 금액</Text>
                            <Text style={styles.LightText}>-{order.totalDiscountPrice} 원</Text>
                        </View>
                        <View style={styles.OrderTotalContent}>
                            <Text style={styles.LightText}>결제 정보</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.LightText}>{order.paymentCard} </Text>
                                <Text style={styles.LightText}>{order.paymentCardNum}</Text>
                            </View>
                        </View>
                        <View style={styles.OrderTotalContent}>
                            <Text style={[styles.MediumText,{fontSize: 20, color:'#E33434'}]}>총 결제금액</Text>
                            <Text style={[styles.MediumText,{fontSize: 20, color:'#E33434'}]}>{order.totalPaymentPrice} 원</Text>
                        </View>
                    </View>
                </View>
            )}
            
        </View>
    );
}
export default Order;