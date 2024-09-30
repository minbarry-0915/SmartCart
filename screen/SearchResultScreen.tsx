import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Image, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import useGetSearchResults from "../customHooks/useGetSearchResult";
import LinearGradient from "react-native-linear-gradient";
import GlobalStyles from "../styles/GlobalStyles";
import SearchStyles from "../styles/SearchScreenStyles";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";
import { UpwardIcon } from "../assets/icons";
import { logout } from "../redux/authSlice";
import { Product } from "../types";
import discountCalculate from "../customHooks/discountCalculate";
import isDiscount from "../customHooks/isDiscount";
import formatNumber from "../customHooks/fomatNumber";

interface MyParams {
    resultKeyword: string;
}

function SearchResultScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    // redux
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const { resultKeyword } = route.params as MyParams;
    const [scrollToTopButtonVisible, setScrollToTopButtonVisible] = useState<boolean>(false);

    const { loading, error, products } = useGetSearchResults(resultKeyword); // 검색 결과 상품들 가져오기

    const onProductButton = (productId: number) => {
        navigation.navigate('ProductDetail', { productId: productId });
    };

    useEffect(() => {
        console.log('loginStatus', isLoggedIn);
    }, [isLoggedIn]);

    const scrollViewRef = React.useRef<ScrollView>(null);
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollToTopButtonVisible(offsetY > 100);
    };
    
    const renderPriceText = (product: Product) => {
        return (
            <>
                {!isDiscount(product.Discount) ? (
                    <Text
                        numberOfLines={1}
                        style={[
                            GlobalStyles.semiBoldText,
                            { fontSize: 20, alignSelf: 'flex-end' },
                        ]}
                    >{formatNumber(product.Price)}원</Text>
                ) : (
                    <>
                        <Text
                            numberOfLines={1}
                            style={[
                                GlobalStyles.semiBoldText,
                                { fontSize: 20, alignSelf: 'flex-end', textDecorationLine: 'line-through', marginRight: 8 },
                            ]}
                        >{formatNumber(product.Price)}원</Text>
                        <Text
                            style={[GlobalStyles.semiBoldText, { fontSize: 20, alignSelf: 'flex-end', color: '#D10000' }]}>
                            {formatNumber(discountCalculate({ price: product.Price, discount: product.Discount, quantity: 1 }))}원
                        </Text>
                    </>

                )}

            </>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoggedIn ? (
                <LinearGradient colors={['#000000', '#666666']} style={{ flex: 1 }}>
                    <TopNavigator
                        title="검색결과"
                        navigation={navigation}
                        showSearchBar={true}
                        showSearchButton={false}
                        mode="black"
                    />
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        contentContainerStyle={[GlobalStyles.scrollContainer, { paddingBottom: 24 }]}>

                        {loading ? (
                            <View style={[SearchStyles.content, { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }]}>
                                <Loading style={[AnimationStyles.loading]} />
                            </View>
                        ) : (
                            <View style={[SearchStyles.content, { width: '40%' }]}>
                                <Text style={[GlobalStyles.semiBoldText, { color: 'white', fontSize: 24, marginBottom: 24 }]}>
                                    {products.length} 건의 검색 결과가 있습니다.
                                </Text>
                                {products.map((product) => (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={product.Product_id} // Product_id 사용
                                        onPress={() => onProductButton(product.Product_id)}
                                        style={SearchStyles.productNode}>
                                        <Image source={{ uri: product.Main_image }} style={SearchStyles.productImage} />
                                        <View style={SearchStyles.productDetailContainer}>
                                            <Text
                                                style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>{product.Product_name}</Text>
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.regularText, { fontSize: 16 }]}>{product.Category}</Text>

                                            <View style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end'
                                            }}>
                                                {renderPriceText(product)}
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                    {scrollToTopButtonVisible && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={scrollToTop}
                            style={GlobalStyles.upwardButtonContainer}>
                            <UpwardIcon width={24} height={24} />
                        </TouchableOpacity>
                    )}
                </LinearGradient>
            ) : (
                <View style={{ flex: 1 }}>
                    <Text>Login Again</Text>
                </View>
            )}
        </View>
    );
}

export default SearchResultScreen;
