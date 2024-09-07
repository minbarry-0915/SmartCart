import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import BarcodeScanner from "../components/BarcodeScanner";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import CartStyles from "../styles/CartScreenStyles";
import GlobalStyles from "../styles/GlobalStyles";
//
interface Product {
  pNum: string,
  pName: string,
  count: number,
  price: number,
  discount: number,
  total: number,
}

function CartScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
  //로그인상태 관리
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();

  const [barcodeData, setBarcodeData] = useState<string>('');
  const [responses, setResponses] = useState<Product[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [grandDiscount, setGrandDiscount] = useState<number>(0);
  const [grandCount, setGrandCount] = useState<number>(0);
  const [grandPrice, setGrandPrice] = useState<number>(0);

  const deleteNodeButton = (index: number) => {
    const newResponses = [...responses];
    //index의 위치에서 1개의 node를 제거
    newResponses.splice(index, 1);
    setResponses(newResponses);
  };

  const deleteAllNodes = () => {
    setResponses([]);
  };
  const decreaseCount = (response: Product) => {
    if (response.count != 1) {
      const updateResponses = responses.map(product => {
        if (response.pNum == product.pNum) {
          const newCount: number = product.count - 1;
          const newTotal: number = newCount * (product.price - product.discount);

          //spread 문법
          return { ...product, count: newCount, total: newTotal };
        }
        else {
          return product;
        }
      });
      setResponses(updateResponses);
    }
  };
  const increaseCount = (response: Product) => {
    const updateResponses = responses.map(product => {
      if (response.pNum == product.pNum) {
        const newCount: number = product.count + 1;
        const newTotal: number = newCount * (product.price - product.discount);

        //spread 문법
        return { ...product, count: newCount, total: newTotal };
      }
      else {
        return product;
      }
    });
    setResponses(updateResponses);
  };

  const getCartList = () => {
    //서버에 아이디를 이용해서 요청해야됨

    const jsonResponse = [
      {
        "pNum": "P001",
        "pName": "Product 1",
        "count": 10,
        "price": 100,
        "discount": 10,
        "total": 90
      },
      {
        "pNum": "P002",
        "pName": "Product 2",
        "count": 5,
        "price": 200,
        "discount": 20,
        "total": 180
      },
      {
        "pNum": "P003",
        "pName": "Product 3",
        "count": 3,
        "price": 300,
        "discount": 15,
        "total": 285
      },
      {
        "pNum": "P004",
        "pName": "Product 4",
        "count": 7,
        "price": 400,
        "discount": 25,
        "total": 375
      },
      {
        "pNum": "P005",
        "pName": "Product 5",
        "count": 12,
        "price": 150,
        "discount": 5,
        "total": 145
      }
    ]
    setResponses(jsonResponse);
  }

  useEffect(() => {
    console.log('loginStatus:', isLoggedIn);
    console.log('welcome', userId);
    getCartList();
  }, [])

  useEffect(() => {
    // 총 결제금액, 할인 금액, 수량 업데이트
    let newGrandTotal: number = 0;
    let newGrandDiscount: number = 0;
    let newGrandCount: number = 0;
    let newGrandPrice: number = 0;
    responses.forEach(product => {
      newGrandTotal += product.total;
      newGrandDiscount += product.discount * product.count;
      newGrandCount += product.count;
      newGrandPrice += product.price * product.count;
    });
    setGrandTotal(newGrandTotal);
    setGrandDiscount(newGrandDiscount);
    setGrandCount(newGrandCount);
    setGrandPrice(newGrandPrice);
  }, [responses]);

  const handleBarcodeScan = (data: string) => {
    //바코드데이터 세팅하고 이 바코드로 서버에 요청 보내야 됨.
    setBarcodeData(data);
    //요청 부분 작성 필요

    //기존 response배열에 있는지 탐색
    const foundProduct = responses.find(product => product.pNum == data)

    //있으면 count 업데이트
    if (foundProduct) {
      const updateResponses = responses.map(product => {
        if (product.pNum == data) {
          const newCount: number = product.count + 1;
          const newTotal: number = newCount * (product.price - product.discount);

          //spread 문법
          return { ...product, count: newCount, total: newTotal };
        }
        else
          return product;
      });
      setResponses(updateResponses);
    }//없으면 post로 받아온 json값 response배열에 추가
    else {
      const jsonResponse = {
        pNum: 'as123121412123',
        pName: '이건 상품명ssssssssssssssssssssssssssss이다',
        count: 1,
        price: 100000,
        discount: 10000,
      };
      const total: number = jsonResponse.price - jsonResponse.discount;
      const response = {
        pNum: jsonResponse.pNum,
        pName: jsonResponse.pName,
        count: jsonResponse.count,
        price: jsonResponse.price,
        discount: jsonResponse.discount,
        total: total
      };
      setResponses([...responses, response]);
    }
    //총 결제금액, 할인 금액, 수량 업데이트
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor:'white' }}>

      {isLoggedIn ? (
        <View style={{ flex: 1 }}>
          {/* topNavigator */}
          <TopNavigator
            title="장바구니"
            navigation={navigation}
            showBackButton={false}
          />
          {/* body */}
          <View style={CartStyles.bodyContainer}>
            {/* 스캔목록 */}
            <View style={CartStyles.buyingListContainer}>
              {/* 스캔목록 헤더 */}
              <View style={CartStyles.buyingListHeader}>
                <Text style={[GlobalStyles.semiBoldText, { fontSize: 30, color: '#757575' }]}>스캔 목록</Text>
                <TouchableOpacity activeOpacity={0.9} style={CartStyles.deleteAllButton} onPress={deleteAllNodes}>
                  <Text style={[GlobalStyles.semiBoldText, { fontSize: 18, color: '#E33434' }]}>전체삭제</Text>
                </TouchableOpacity>
              </View>

              {/* 스캔목록 분류 */}
              <View style={CartStyles.listNodeContainer}>
                <Text style={[CartStyles.categoryText, { width: '25%' }]}>상품명</Text>
                <Text style={[CartStyles.categoryText, { width: '15%' }]}>수량</Text>
                <Text style={[CartStyles.categoryText, { width: '20%' }]}>단가</Text>
                <Text style={[CartStyles.categoryText, { width: '18%' }]}>할인</Text>
                <Text style={[CartStyles.categoryText, { width: '20%' }]}>합계</Text>
              </View>
              <View style={CartStyles.stick} />

              <ScrollView>
                {responses.map((response, index) => (
                  <View key={index} style={CartStyles.listNodeContainer}>
                    {/* 상품명 */}
                    <Text numberOfLines={1}
                      style={[CartStyles.categoryText, { width: '25%' }]}>{response.pName}</Text>
                    {/* 수량 */}
                    <View style={{
                      flexDirection: 'row', justifyContent: 'flex-start',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                      width: '15%'
                    }}>
                      {/* 감소버튼 */}
                      <TouchableOpacity onPress={() => decreaseCount(response)}>
                        <Feather name='minus-circle' size={25} color='black'></Feather>
                      </TouchableOpacity>
                      {/* 수량 숫자 */}
                      <Text style={[CartStyles.categoryText, { width: 40, textAlign: 'center' }]}>{response.count}</Text>
                      {/* 증가 버튼 */}
                      <TouchableOpacity onPress={() => increaseCount(response)}>
                        <Feather name='plus-circle' size={25} color='black' ></Feather>
                      </TouchableOpacity>
                    </View>

                    {/* 단가 */}
                    <Text style={[CartStyles.categoryText, { width: '20%' }]}>{response.price}</Text>
                    {/* 할인 */}
                    <Text style={[CartStyles.categoryText, { width: '18%' }]}>{response.discount}</Text>
                    {/* 합계 */}
                    <Text style={[CartStyles.categoryText, { width: '18%' }]}>{response.total}</Text>

                    {/* 삭제버튼 */}
                    <TouchableOpacity onPress={() => deleteNodeButton(index)}>
                      <AntDesign name='closecircle' size={25} color='black' />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

            </View>

            {/* 바코드 스캐너, 총 예상 금액 */}
            <View style={{
              flex: 4,
              justifyContent: 'space-between'
            }}>
              {/* 바코드 스캐너 */}
              <BarcodeScanner onScan={handleBarcodeScan} />

              {/* 총 예상 금액 */}
              <View style={CartStyles.totalContainer}>

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.BoldText, { fontSize: 24 }]}>총 결제 예상 금액</Text>
                  <Text style={[GlobalStyles.BoldText, { fontSize: 24 }]}>{grandTotal}원</Text>
                </View>
                <View style={[CartStyles.stick, { backgroundColor: 'black', marginTop: 0, marginBottom: 12, width: '100%' }]} />

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>총 상품 금액</Text>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>{grandPrice}원</Text>
                </View>

                <View style={CartStyles.totalTextContainer}>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#696969' }]}>총 할인 금액</Text>
                  <Text style={[GlobalStyles.regularText, { fontSize: 20, color: '#E33434' }]}>-{grandDiscount}원</Text>
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