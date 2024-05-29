import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState} from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import BarcodeScanner from "../Components/BarcodeScanner";
import Header from "../Components/Header";

interface Product {
  pNum: string,
  pName: string,
  count: number,
  price: number,
  discount: number,
  total: number,
}
// interface GrandPrice {
//   grandTotalPrice: number,
//   grandDiscountPrice: number,
//   grandCount: number,
// }
interface MyParams {
  //유저 id
  id: string,
}

function CartScreen({route,navigation}: {route: RouteProp<ParamListBase>,navigation: NavigationProp<ParamListBase>}){
  const {id} = route.params as MyParams;

  const [barcodeData, setBarcodeData] = useState<string>('');
  const [responses, setResponses] = useState<Product[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [grandDiscount, setGrandDiscount] = useState<number>(0);
  const [grandCount, setGrandCount] = useState<number>(0);
  const [grandPrice, setGrandPrice] = useState<number>(0);
  
  

  const onSearchButton = () => {
    navigation.navigate('Search');
  };

  const onMyPageButton = () => {
    
  };

  const onBackButton = () => {
    navigation.goBack();
  };

  const deleteNodeButton = (index: number) =>{
    const newResponses = [...responses];
    //index의 위치에서 1개의 node를 제거
    newResponses.splice(index,1);
    setResponses(newResponses);
  };

  const deleteAllNodes = () =>{
    setResponses([]);
  };
  const decreaseCount = (response: Product) =>{
    if(response.count!= 1){
      const updateResponses = responses.map(product =>{
      if(response.pNum == product.pNum){
        const newCount:number = product.count-1;
        const newTotal:number = newCount*(product.price-product.discount);

        //spread 문법
        return {...product,count:newCount,total:newTotal};
      }
      else{
        return product;
      }
    });
    setResponses(updateResponses);
    }
  };
  const increaseCount = (response: Product) =>{
    const updateResponses = responses.map(product =>{
      if(response.pNum == product.pNum){
        const newCount:number = product.count+1;
        const newTotal:number = newCount*(product.price-product.discount);

        //spread 문법
        return {...product,count:newCount,total:newTotal};
      }
      else{
        return product;
      }
    });
    setResponses(updateResponses);
  };

  const getCartList = () => {
    //서버에 아이디를 이용해서 요청해야됨
    console.log('welcome'+id);
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

  useEffect(()=>{
    getCartList();
  },[])

  useEffect(() => {
    // 총 결제금액, 할인 금액, 수량 업데이트
    let newGrandTotal: number = 0;
    let newGrandDiscount: number = 0;
    let newGrandCount: number = 0;
    let newGrandPrice: number = 0;
    responses.forEach(product => {
      newGrandTotal += product.total;
      newGrandDiscount += product.discount*product.count;
      newGrandCount += product.count;
      newGrandPrice += product.price*product.count;
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
    if(foundProduct){
      const updateResponses = responses.map(product => {
        if(product.pNum == data){
          const newCount:number = product.count+1;
          const newTotal:number = newCount*(product.price-product.discount);

          //spread 문법
          return {...product,count:newCount,total:newTotal};
        }
        else
          return product;
      });
      setResponses(updateResponses);
    }//없으면 post로 받아온 json값 response배열에 추가
    else{
      const jsonResponse = {
        pNum: 'as123121412123',
        pName: '이건 상품명이다',
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

  // const sendData = async () =>{
  //   try{
  //     const dataToSend = {
  //       barcodeData: barcodeData,
  //     };
  //     //주소 넣어야됨
  //     const response = await fetch('',{
  //       method: 'POST',
  //       headers: {
  //         'Content-Type':'application/json', 
  //       },
  //       body: JSON.stringify(dataToSend)
  //     });
  //     const jsonResponse = await response.json();
  //   } catch(error){
  //     console.error('Error fetching Data: ', error);
  //   }
  // };


  return(
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        {/* header */}
        <Header showBackButton={true} title={'장바구니'} showSearchContainer={false} showCartButton={false} showMyPageButton={true} showSearchButton={true} navigation={navigation}/>
        
        <View style={styles.BodyContainer}>
          <View style={styles.BuyingListContainer}>
            <View style={styles.BLCHeaderContainer}>
              <View style= {styles.BLCHeader}>
                <Text style= {styles.BLCHeaderText}>스캔 목록</Text>
                <TouchableOpacity activeOpacity={0.9} style= {styles.BLCHeaderEraseButton} onPress={deleteAllNodes}>
                  <Text style={styles.BLCHeaderEraseButtonText}>전체삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* BuyingListContainerCatergory */}
            <View style= {styles.BLCpNode}>
              <Text style={styles.BLCpNodeText}>상품명</Text>
              <Text style={[styles.BLCpNodeText,{width: '15%'}]}>수량</Text>
              <Text style={[styles.BLCpNodeText,{width: '17%'}]}>단가</Text>
              <Text style={[styles.BLCpNodeText,{width: '15%'}]}>할인</Text>
              <Text style={[styles.BLCpNodeText,{width: '20%'}]}>합계</Text>
            </View>
            <View style= {styles.Stick}/>

            {responses.map((response, index) => (
              <View key={index} style={styles.BLCpNode}>
                <Text style={styles.BLCpNodeText}>{response.pName}</Text>
                <TouchableOpacity onPress={() =>decreaseCount(response)} style={{marginRight:5}}>
                  <Feather name='minus-circle' size={25} color='black'></Feather>
                </TouchableOpacity>
                <Text style={[styles.BLCpNodeText,{width: '4%'}]}>{response.count}</Text>
                <TouchableOpacity onPress={()=>increaseCount(response)} style={{marginRight:10}}>
                  <Feather name='plus-circle' size={25} color='black' ></Feather>
                </TouchableOpacity>
                <Text style={[styles.BLCpNodeText,{width: '17%', marginLeft: 5,}]}>{response.price}</Text>
                <Text style={[styles.BLCpNodeText,{width: '15%'}]}>{response.discount}</Text>
                <Text style={[styles.BLCpNodeText,{width: '16%'}]}>{response.total}</Text>
                <TouchableOpacity onPress={()=>deleteNodeButton(index)}>
                  <AntDesign name='closecircle' size={25} color='black'/>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={{flex: 0.4}}>
            <BarcodeScanner onScan={handleBarcodeScan}/>
            <View style={styles.GrandContainer}>
              <View style={styles.GrandTextContainer}>
                <Text style={styles.GrandText}>총 결제 예상 금액</Text>
                <Text style={styles.GrandText}>{grandTotal}원</Text>
              </View>
              <View style= {[styles.Stick, {backgroundColor: 'black', marginTop: 0, marginBottom: 14, width: '100%'}]}/>
              <View style={styles.GrandTextContainer}>
                <Text style={styles.GrandSubText}>총 상품 금액</Text>
                <Text style={styles.GrandSubText}>{grandPrice}원</Text>
              </View>
              <View style={styles.GrandTextContainer}>
                <Text style={styles.GrandSubText}>총 할인 금액</Text>
                <Text style={[styles.GrandSubText, {color: '#ED7272'}]}>-{grandDiscount}원</Text>
              </View>
              <View style={styles.GrandTextContainer}>
                <Text style={styles.GrandSubText}>총 수량</Text>
                <Text style={styles.GrandSubText}>{grandCount}개</Text>
              </View>
            </View>
          </View>
        </View>       
        
      </SafeAreaView>
    )
  }

  export default CartScreen;