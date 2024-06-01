import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React,{useEffect, useRef, useState} from "react";
import styles from "./StyleSheet";
import { Animated, Button, Easing, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
//import ProductBottomModal from "../Components/ProductBottomModal";

interface MyParams{
    pNum: string,
};

interface Product{
    pNum: string,
    category: string,
    pName: string,
    pMainImage: string,
    pDetailImage: string[],
    price: number,
    location: string,
}

function ProductDetailScreen({route, navigation}:{route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase>}) {
    const {isLoggedIn, userId} = useSelector((state: RootState)=> state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const {pNum} = route.params as MyParams;
    const [product, setProduct] = useState<Product>({
        pNum: '', 
        category: '', 
        pName: '', 
        pMainImage: '', 
        pDetailImage: [] as string[], 
        price: 0, 
        location: ''
     });
    const [isInfoButtonPressed, setIsInfoButtonPressed] = useState<boolean>(true);
    const [isReviewButtonPressed, setIsReviewButtonPressed] = useState<boolean>(false);
    const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);
    const [addCartModalVisible, setAddCartModalVisible] = useState<boolean>(false);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const [count, setCount] = useState<number>(0);
    const [grandPrice, setGrandPrice] = useState<number>(0);
    
    const handleInfoPressIn = () =>{
        setIsInfoButtonPressed(true);
        setIsReviewButtonPressed(false);
    };
    const handleReviewPressIn = () =>{
        setIsInfoButtonPressed(false);
        setIsReviewButtonPressed(true);
    };
    const toggleLocationModal = () => {
        setLocationModalVisible(!locationModalVisible);
    };
    const toggleAddCartModal = () => {
        if (addCartModalVisible) {
          // 모달이 닫힐 때 슬라이드 다운 애니메이션 실행
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start(() => {
            setAddCartModalVisible(false);
          });
        } else {
          setAddCartModalVisible(true);
        }
      };

    const getProductDetail = () => {
        console.log('pNum:'+pNum);
        //서버요청 작성 필요
        const jsonResponse = {
            "pNum": "1234",
            "category": "마이프로틴",
            "pName": "퓨처 웨이(Future Whey) 스트로베리 맛 ",
            "pMainImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
            //상세페이지 이미지는 string array형태로 받음
            "pDetailImage": ["https://shop-phinf.pstatic.net/20230511_154/1683785993017aMJOa_PNG/%EC%9E%90%EC%82%B0_19.png?type=w860",
            // "https://shop-phinf.pstatic.net/20240418_53/17134278662846L3Ei_JPEG/%EC%9E%90%EC%82%B0_33x-100.jpg?type=w860"
            ],
            "price": 38900,
            "location": "e3",
        };  
        setProduct(jsonResponse);
        setCount(1);
        setGrandPrice(product.price);
    }
    const increaseCount = () =>{
        const newCount = count + 1;
        setCount(newCount);
    }
    const decreaseCount = () =>{
        if(count > 1){
            const newCount = count - 1;
            setCount(newCount);
        }
    }
    const onAddCartButton = (id:string, count:number) => {
        //서버 카트에 등록해야됨

        toggleAddCartModal();
    }

    useEffect(()=>{
        if (addCartModalVisible) {
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.timing(slideAnim, {
              toValue: 300,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start();
          }
        getProductDetail();
        
    },[addCartModalVisible, slideAnim]);

    useEffect(()=>{
        const newGrandPrice = product.price * count;
        setGrandPrice(newGrandPrice);
        console.log("currentCount:",count);
    },[count])
    
    

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
            {/* header */}
            <Header showBackButton={true} title={'상품'} showSearchContainer={false} showCartButton={true} showMyPageButton={true} showSearchButton={true} navigation={navigation}/>

            {/* body */}
            <View style={[styles.BodyContainer,{flexDirection:'column', paddingBottom: 0}]}>
                <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                    <View style={styles.ProductMainInfoContainer}>
                        {product.pMainImage ? (
                            <View style={styles.ImageContainer}>
                                <Image source={{ uri: product.pMainImage }} style={styles.ProductMainImage} />
                            </View>     
                        ) : (
                                <Text>No Image Available</Text>
                        )}
                        <Text style={[styles.ProductText,{textDecorationLine: 'underline'}]}>{product.category}</Text>
                        <Text style={[styles.ProductText, {fontSize: 24}]}>{product.pName}</Text>
                        <Text style={[styles.ProductText, {fontFamily: 'Pretendard-Bold',fontSize: 32}]}>{product.price} 원</Text>
                    </View>
                    <View style= {[styles.Stick, {marginBottom: 24}]}/>
                    <View style= {styles.ProductSubInfoContainer}>
                        <View style={styles.ProductSubInfoMenuContainer}>
                            <TouchableOpacity onPressIn={handleInfoPressIn}
                            activeOpacity={1}
                            style={[styles.ProductSubInfoMenuNodeContainer, isInfoButtonPressed&& styles.ProductSubInfoMenuNodeContainer_pressed]}>
                                <Text style={[styles.ProductSubInfoMenuText, isInfoButtonPressed&&styles.ProductSubInfoMenuText_pressed]}>정보</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPressIn={handleReviewPressIn}
                            activeOpacity={1}
                            style={[styles.ProductSubInfoMenuNodeContainer, isReviewButtonPressed&& styles.ProductSubInfoMenuNodeContainer_pressed]}>
                                <Text style={[styles.ProductSubInfoMenuText, isReviewButtonPressed&&styles.ProductSubInfoMenuText_pressed]}
                                >
                                후기</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {isInfoButtonPressed && product.pDetailImage.map((image,index)=>(
                            <Image 
                                key={index} 
                                source={{uri:image}}
                                style={styles.ProductDetailImage}    
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View style={styles.ProductBottomButtonsContainer}>
                    <TouchableOpacity 
                        activeOpacity={0.6}
                        style={[styles.ProductBottomButton,{borderEndWidth: 1, backgroundColor: '#FFE68C',borderTopStartRadius:20,
                        }]}
                        onPress={toggleLocationModal}
                    >
                        <Text style={styles.ProductBottomButtonText}>상품위치보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.6}
                        style={[styles.ProductBottomButton,{borderEndWidth: 1, backgroundColor: '#9AB4F5',borderTopEndRadius:20,
                        }]}
                        onPress={toggleAddCartModal}
                    >
                        <Text style={styles.ProductBottomButtonText}>장바구니에 담기</Text>
                    </TouchableOpacity>
            </View>
            {/* locationModal */}
            <Modal 
            animationType='fade'
            transparent={true}
            visible={locationModalVisible}
            onRequestClose={toggleLocationModal}
            >
                <TouchableOpacity
                activeOpacity={1} 
                style={styles.ProductLocationModalContainer}>
                    <View style={styles.ProductLocationModalContent}>
                        <View style={styles.ProductLocationModalContentHeader}>
                            <View style={{flexDirection:'row', alignItems:'baseline',justifyContent:'center'}}>
                                <Text style={[styles.SemiBoldText,{fontSize: 36,color:'#0262F1'}]}>{product.location} </Text>
                                <Text style={styles.MainText}>에 위치하고 있어요!</Text>
                            </View>
                            <TouchableOpacity onPress={toggleLocationModal}>
                                <AntDesign name="closecircleo" size={40} color={'black'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ProductLocationModalMapContainter}>
                            <Text>this is map</Text>   
                        </View>
                    </View>
                    
                </TouchableOpacity>
            </Modal>
            {/* addCartModal */}
            <Modal
            animationType='fade'
            transparent={true}
            visible={addCartModalVisible}
            onRequestClose={toggleAddCartModal}
            >
                <View style={styles.AddCartModalContainer}>
                    <Animated.View style={[styles.AddCartModalContent, { transform: [{ translateY: slideAnim }] }]}>
                        <View style={{alignItems:"center"}}>
                            <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={toggleAddCartModal}
                            >
                                <Feather name="chevron-down" size={40} color='black'/>
                            </TouchableOpacity>
                            <View 
                            style={{
                                width:'100%',
                                flexDirection: 'row',justifyContent:'space-between',    
                            }}>
                                <Text style={styles.MainText}>{grandPrice}원</Text>
                                <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                    <TouchableOpacity
                                    onPress={decreaseCount} 
                                    style={styles.ModalIconContainer}>
                                        <Feather 
                                        name="minus-circle" 
                                        size={24} 
                                        color={'black'}/>
                                    </TouchableOpacity>
                                    <Text style={styles.MainText}>{count}</Text>
                                    <TouchableOpacity
                                    onPress={increaseCount}
                                    style={[styles.ModalIconContainer,{marginRight:0}]}>
                                        <Feather 
                                        name="plus-circle" 
                                        size={24}
                                        color={'black'}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        
                        
                        <TouchableOpacity
                        onPress={()=>{onAddCartButton(product.pNum,count)}}
                        style={styles.AddCartButton}>
                            <Text style={[styles.MediumText,{fontSize:20}]} >장바구니 추가</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}
export default ProductDetailScreen;