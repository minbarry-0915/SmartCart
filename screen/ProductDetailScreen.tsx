import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
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
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";

interface MyParams {
    productId: number;
}

function ProductDetailScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const { productId } = route.params as MyParams;

    const { product, loading, error } = useGetProductDetail(productId);

    const [scrollToTopButtonVisible, setScrollToTopButtonVisible] = useState<boolean>(false);
    const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);
    const [addCartModalVisible, setAddCartModalVisible] = useState<boolean>(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const toggleLocationModal = () => setLocationModalVisible(!locationModalVisible);
    const toggleAddCartModal = () => setAddCartModalVisible(!addCartModalVisible);

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollToTopButtonVisible(offsetY > 100);
    };

    useEffect(() => {
        console.log('locationmodal: ', locationModalVisible);
    }, [locationModalVisible])

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#000000', '#666666']} style={{ flex: 1 }}>
                <TopNavigator title="상세페이지" navigation={navigation} mode="black" />

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Loading style={[AnimationStyles.loading, { width: 200, height: 200 }]} />
                    </View>
                ) : (
                    product ? (
                        <ScrollView
                            ref={scrollViewRef}
                            onScroll={handleScroll}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            contentContainerStyle={[GlobalStyles.scrollContainer, { paddingBottom: 24, marginHorizontal: 126 }]}>

                            <View style={ProductDetailStyles.content}>
                                {/* 메인이미지 */}
                                <View style={ProductDetailStyles.mainImageContainer}>
                                    <Image source={{ uri: product.Main_image }} style={ProductDetailStyles.mainImage} />
                                </View>
                                {/* 브랜드 */}
                                <Text style={[GlobalStyles.semiBoldText, { color: 'white', fontSize: 24, marginBottom: 24 }]}>{product.Category}</Text>
                                {/* 상품명 */}
                                <Text style={[GlobalStyles.mediumText, { color: 'white', marginBottom: 24 }]}>{product.Product_name}</Text>

                                <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                                    {/* 상품위치보기버튼 */}
                                    <TouchableOpacity onPress={toggleLocationModal} activeOpacity={0.8} style={{ marginRight: 12 }}>
                                        <LocationIcon width={50} height={50} />
                                    </TouchableOpacity>
                                    {/* 장바구니추가하기버튼 */}
                                    <TouchableOpacity onPress={toggleAddCartModal} activeOpacity={0.8}>
                                        <AddCartIcon width={50} height={50} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[CartStyles.stick, { marginBottom: 24 }]} />

                            <View style={[ProductDetailStyles.content, { width: '40%', flexWrap: 'wrap' }]}>
                                <Text style={[GlobalStyles.regularText, { color: 'white', fontSize: 16 }]}>
                                    {product.Description}
                                </Text>
                            </View>
                        </ScrollView>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <Text>Failed to fetch product info</Text>
                        </View>
                    )
                )}

                {scrollToTopButtonVisible && (
                    <TouchableOpacity activeOpacity={0.8} onPress={scrollToTop} style={GlobalStyles.upwardButtonContainer}>
                        <UpwardIcon width={24} height={24} />
                    </TouchableOpacity>
                )}
                {/* <BeaconDistanceTracker
            beaconId="1"
            txPower={-40}
            /> */}

            </LinearGradient>

            {/* locationModal */}
            <LocationModal modalVisible={locationModalVisible} toggleLocationModal={toggleLocationModal} />
            {/* addCartModal */}
            {product &&
                <CartModal modalVisible={addCartModalVisible} toggleAddCartModal={toggleAddCartModal} price={product.Price} navigation={navigation} discount={product?.Discount} />
            }

        </View>
    );
}

export default ProductDetailScreen;
