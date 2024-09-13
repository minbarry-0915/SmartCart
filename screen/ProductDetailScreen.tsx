import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import GlobalStyles from "../styles/GlobalStyles";
import CartStyles from "../styles/CartScreenStyles";
import LinearGradient from "react-native-linear-gradient";
import useGetProductDetail from "../customHooks/useGetProductDetail";
import ProductDetailStyles from "../styles/ProductDetailScreenStyles";
import LocationModal from "../components/LocationModal";
import CartModal from "../components/CartModal";
import { AddCartIcon, UpwardIcon, LocationIcon } from "../assets/icons";

interface MyParams {
    pNum: string,
};

function ProductDetailScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const { pNum } = route.params as MyParams;
    const { product, loading, error } = useGetProductDetail(pNum);

    const [scrollToTopButtonVisible, setScrollToTopButtonVisible] = useState<boolean>(false);
    const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);
    const [addCartModalVisible, setAddCartModalVisible] = useState<boolean>(false);

    const slideAnim = useRef(new Animated.Value(300)).current;
    const [count, setCount] = useState<number>(0);
    const [grandPrice, setGrandPrice] = useState<number>(0);
    const textColor = 'white';
   
    const toggleLocationModal = () => {
        setLocationModalVisible(!locationModalVisible);
    };
    const toggleAddCartModal = () => {
        setAddCartModalVisible(!addCartModalVisible);
    };

    useEffect(() => {
        if (product) {
            const newGrandPrice = product.price * count;
            setGrandPrice(newGrandPrice);
            console.log("currentCount:", count);
        }
    }, [count])

    const scrollViewRef = React.useRef<ScrollView>(null);
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 100) { // 예시: 스크롤이 100px 이상 내려갔을 때 버튼을 보이게 함
            setScrollToTopButtonVisible(true);
        } else {
            setScrollToTopButtonVisible(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#000000', '#666666']}
                style={{ flex: 1 }}
            >
                <TopNavigator
                    title="상세페이지"
                    navigation={navigation}
                    mode="black"
                />

                {/* body */}
                {product ? (
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        contentContainerStyle={[GlobalStyles.scrollContainer, { paddingBottom: 24, marginHorizontal: 126 }]}>

                        <View style={ProductDetailStyles.content}>
                            {/* 메인이미지 */}
                            <View style={ProductDetailStyles.mainImageContainer}>
                                <Image
                                    source={{ uri: product.pMainImage }}
                                    style={ProductDetailStyles.mainImage} />
                            </View>
                            {/* 브랜드 */}
                            <Text style={[GlobalStyles.semiBoldText, { color: textColor, fontSize: 24, marginBottom: 24 }]}>{product.category}</Text>
                            {/* 상품명 */}
                            <Text style={[GlobalStyles.mediumText, { color: textColor, marginBottom: 24 }]}>{product.pName}</Text>

                            <View style={{flexDirection: 'row', marginBottom: 24}}>
                                {/* 상품위치보기버튼 */}
                                <TouchableOpacity
                                    onPress={toggleLocationModal}
                                    activeOpacity={0.8}
                                    style={{marginRight: 12}}
                                >
                                    <LocationIcon width={50} height={50} />
                                </TouchableOpacity>
                                {/* 장바구니추가하기버튼 */}
                                <TouchableOpacity
                                    onPress={toggleAddCartModal}
                                    activeOpacity={0.8}
                                >
                                    <AddCartIcon width={50} height={50} />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={[CartStyles.stick, { marginBottom: 24 }]} />

                        <View style={[ProductDetailStyles.content, { width: '40%', flexWrap: 'wrap', }]}>
                            {product.pDetailImage.map((image, index) => (
                                <Text style={[GlobalStyles.regularText, { color: textColor, fontSize: 16}]}>
                                    {image}
                                </Text>
                            ))}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text>Failed to fetch product info</Text>
                    </View>
                )}

                {scrollToTopButtonVisible && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={scrollToTop}
                        style={GlobalStyles.upwardButtonContainer}
                    >
                        <UpwardIcon width={24} height={24} />
                    </TouchableOpacity>
                )}
            </LinearGradient>

            {/* locationModal */}
            <LocationModal
                modalVisible = {locationModalVisible}
                toggleLocationModal={toggleLocationModal}
            />
            {/* addCartModal */}
            <CartModal
                modalVisible = {addCartModalVisible}
                toggleLocationModal={toggleAddCartModal}
                price={product?.price}
            />
        </View>
    );
}
export default ProductDetailScreen;