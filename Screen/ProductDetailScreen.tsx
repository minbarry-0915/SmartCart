import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React,{useEffect, useState} from "react";
import styles from "./StyleSheet";
import { Button, Image, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../Components/Header";
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
    
    const handleInfoPressIn = () =>{
        setIsInfoButtonPressed(true);
        setIsReviewButtonPressed(false);
    };
    const handleReviewPressIn = () =>{
        setIsInfoButtonPressed(false);
        setIsReviewButtonPressed(true);
    };

    const getProductDetail = () => {
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
    }

    useEffect(()=>{
        getProductDetail();
    },[]);
    

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
                    >
                        <Text style={styles.ProductBottomButtonText}>상품위치보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.6}
                        style={[styles.ProductBottomButton,{borderEndWidth: 1, backgroundColor: '#9AB4F5',borderTopEndRadius:20,
                        }]}
                    >
                        <Text style={styles.ProductBottomButtonText}>장바구니에 담기</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
}
export default ProductDetailScreen;