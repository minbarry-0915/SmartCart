import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../Screen/StyleSheet";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

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
}

//TypeScript의 타입 추론을 통해 컴포넌트의 props 타입을 명시적으로 정의하고, 컴포넌트 내부에서 props를 구조 분해 할당할 때 적절한 타입 검사를 수행하기 위함입니다.
const OrderList: React.FC<OrderListProps> = ({ data, navigation }) => {
    const [orderList, setOrderList] = useState<Order[]>([]);


    useEffect(() => {
        if (data && Array.isArray(data)) {
            const ParsedData = data.map(order=>({
                ...order,
                productList: order.productList.map(product=>({
                    ...product,
                    pName: product.pName.length > 20 ? product.pName.slice(0,20) + '...': product.pName
                }))
            }));
            setOrderList(ParsedData);
        }
    }, [data]);

    const onOrderDetailButton = (id: string) => {
        //console.log(id);
        navigation.navigate('OrderListDetail', {orderId:id});
    }
    const onProductInfo = (id:string) =>{
        //console.log(id);
        navigation.navigate('ProductDetail', {pNum: id});
    }

    return (
        <View style = {{width: '100%',justifyContent: 'center',alignItems:'center'}}>
            {orderList.map((order,index)=>(
                        <View key={index} style={styles.OrderContainer}>
                            {/* OrderDate */}
                            <View style={styles.OrderSubContainer}>
                                <Text style={[styles.SemiBoldText,{fontSize:24}]}>{order.orderDate}</Text>
                            </View>
                            <View style={[styles.OrderSubContainer,{paddingVertical: 12}]}>
                                {order.tag ? (<Text style={[styles.MainText, {color: '#696969', fontSize: 18}]}>온라인 구매</Text>) : (<Text style={[styles.MainText, {color: '#696969', fontSize: 18}]}>오프라인 구매</Text>)}
                            </View>
                            {order.productList.slice(0,2).map((product, index)=>(
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
                            {order.productList.length > 2 && (
                                <View style={[styles.OrderSubContainer,{alignItems:'center',paddingVertical: 0}]}>
                                    <Text style={[styles.MainText,{fontSize: 18}]}> . . . </Text>
                                </View>
                            )}
                            <View style={[styles.OrderSubContainer,{alignItems:'center',paddingVertical:12}]}>
                                <TouchableOpacity onPress={()=>{onOrderDetailButton(order.id)}}>
                                    <Text style={[styles.MediumText,{fontSize: 20, color: '#0262F1'}]}>상세보기</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    ))}
        </View>
    );
};

export default OrderList;
