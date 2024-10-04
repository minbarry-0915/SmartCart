import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import BarcodeScanner from "../components/BarcodeScanner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import CartStyles from "../styles/CartScreenStyles";
import GlobalStyles from "../styles/GlobalStyles";
import useGetCartList from "../customHooks/useGetCartList";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";

import useGetProduct from "../customHooks/useGetProduct";
import formatNumber from "../customHooks/fomatNumber";

import { CartItem } from "../types";
import usePostCartList from "../customHooks/useUpdateCartList";

function CartScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const { 
    responses,
    loading,
    grandTotal,
    grandDiscount,
    grandCount,
    grandPrice,
    setResponses,
  } = useGetCartList();

  const deleteNodeButton = (index: number) => {
    const newResponses = [...responses];
    newResponses.splice(index, 1);
    setResponses(newResponses);
  };

  const deleteAllNodes = () => {
    setResponses([]);
  };

  //상품별 총 합계 계산 
  const calculateTotal = (cartItem: CartItem) => {
    return cartItem.quantity * (cartItem.product.Price - (cartItem.product.Discount || 0));
  };

  const decreaseCount = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      const updatedResponses = responses.map(item => {
        if (cartItem.product.Product_id === item.product.Product_id) {
          const newCount = item.quantity - 1;
          return { ...item, quantity: newCount };
        }
        return item;
      });
      setResponses(updatedResponses);
    }
  };

  const increaseCount = (cartItem: CartItem) => {
    const updatedResponses = responses.map(item => {
      if (cartItem.product.Product_id === item.product.Product_id) {
        const newCount = item.quantity + 1;
        return { ...item, quantity: newCount };
      }
      return item;
    });
    setResponses(updatedResponses);
  };

  const { handleBarcodeScan } = useGetProduct(responses, setResponses);
  
  usePostCartList(responses, setResponses);

  const scrollViewRef = useRef<ScrollView>(null);
  

  // 제품 추가 시 ScrollView의 맨 끝으로 이동
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [responses]); // responses가 업데이트될 때 스크롤 이동


  useEffect(()=>{

  },[]);
  
  return (
    <ScrollView 
  
    contentContainerStyle={{ flex: 1, backgroundColor: 'white' }}>
      {isLoggedIn ? (
        <View style={{ flex: 1 }}>
          <TopNavigator title="장바구니" navigation={navigation} showBackButton={false} />
          <View style={CartStyles.bodyContainer}>
            <View style={CartStyles.buyingListContainer}>
              <View style={CartStyles.buyingListHeader}>
                <Text style={[GlobalStyles.semiBoldText, { fontSize: 30, color: '#757575' }]}>스캔 목록</Text>
                <TouchableOpacity activeOpacity={0.9} style={CartStyles.deleteAllButton} onPress={deleteAllNodes}>
                  <Text style={[GlobalStyles.semiBoldText, { fontSize: 18, color: '#E33434' }]}>전체삭제</Text>
                </TouchableOpacity>
              </View>

              <View style={CartStyles.listNodeContainer}>
                <Text style={[CartStyles.categoryText, { width: '25%' }]}>상품명</Text>
                <Text style={[CartStyles.categoryText, { width: '15%' }]}>수량</Text>
                <Text style={[CartStyles.categoryText, { width: '20%' }]}>단가</Text>
                <Text style={[CartStyles.categoryText, { width: '18%' }]}>할인</Text>
                <Text style={[CartStyles.categoryText, { width: '20%' }]}>합계</Text>
              </View>
              <View style={CartStyles.stick} />

              {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Loading style={[AnimationStyles.loading, { width: 200, height: 200 }]} />
                </View>
              ) : (
                <ScrollView 
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}>
                  {responses.map((cartItem, index) => {
                    const total = calculateTotal(cartItem);
                    return (
                      <View key={index} style={CartStyles.listNodeContainer}>
                        <Text numberOfLines={1} style={[CartStyles.categoryText, { width: '20%' }]}>{cartItem.product.Product_name}</Text>
                        <View style={{
                          flexDirection: 'row', justifyContent: 'flex-start',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          width: '20%'
                        }}>
                          <TouchableOpacity onPress={() => decreaseCount(cartItem)}>
                            <Feather name='minus-circle' size={25} color='black' />
                          </TouchableOpacity>
                          <Text style={[CartStyles.categoryText, { width: 40, textAlign: 'center' }]}>{cartItem.quantity}</Text>
                          <TouchableOpacity onPress={() => increaseCount(cartItem)}>
                            <Feather name='plus-circle' size={25} color='black' />
                          </TouchableOpacity>
                        </View>
                        <Text style={[CartStyles.categoryText, { width: '20%' }]}>{formatNumber(cartItem.product.Price)}</Text>
                        <Text style={[CartStyles.categoryText, { width: '18%' }]}>- {formatNumber(cartItem.product.Discount || 0)}</Text>
                        <Text style={[CartStyles.categoryText, { width: '18%' }]}>{formatNumber(total)}</Text>
                        <TouchableOpacity onPress={() => deleteNodeButton(index)}>
                          <AntDesign name='closecircle' size={25} color='black' />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
            
            <View style={{
              flex: 4,
              justifyContent: 'space-between'
            }}>
              {/* 바코드 스캐너 */}
              <BarcodeScanner onScan={handleBarcodeScan} />
              {/* 장바구니 총계산 금액 */}
              <View style={CartStyles.totalContainer}>
                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.BoldText, { fontSize: 24 }]}>총 결제 예상 금액</Text>
                  <Text style={[GlobalStyles.BoldText, { fontSize: 24 }]}>{formatNumber(grandTotal)}원</Text>
                </View>
                <View style={[CartStyles.stick, { backgroundColor: 'black', marginTop: 0, marginBottom: 12, width: '100%' }]} />

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>총 상품 금액</Text>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>{formatNumber(grandPrice)}원</Text>
                </View>

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>총 할인 금액</Text>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#E33434' }]}>-{formatNumber(grandDiscount)}원</Text>
                </View>

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>총 수량</Text>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>{grandCount}개</Text>
                </View>
              </View>
            </View>

          </View>
        </View>
      ) : (
        <Text>Please Login</Text>
      )}
    </ScrollView>
  );
}

export default CartScreen;
