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
//
interface MyParams {
    resultKeyword: string;
    // 다른 매개변수가 있다면 여기에 추가
}
interface Product {
    pNum: string,
    pCategory: string,
    pName: string,
    pImage: string,
    pPrice: number,
}

function SearchResultScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    //redux
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const { resultKeyword } = route.params as MyParams;
    const [scrollToTopButtonVisible, setScrollToTopButtonVisible] = useState<boolean>(false);

    const { loading, error, response } = useGetSearchResults(resultKeyword); //검색 결과 상품들 가져오기

    const onProductButton = (pNum: string) => {
        navigation.navigate('ProductDetail', { pNum: pNum });
    };

    useEffect(() => {
        console.log('loginStatus', isLoggedIn);
    }, []);

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
        <View
            style={{ flex: 1 }}
        >
            {isLoggedIn ? (
                <LinearGradient
                    colors={['#000000', '#666666']}
                    style={{ flex: 1 }}
                >
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
                                <Text style={[GlobalStyles.semiBoldText, { color: 'white', fontSize: 24, marginBottom: 24 }]}>{response.length} 건의 검색 결과가 있습니다.</Text>
                                {response.map((product, index) => (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={index}
                                        onPress={() => onProductButton(product.pNum)}
                                        style={SearchStyles.productNode}>
                                        <Image source={{ uri: product.pImage }} style={SearchStyles.productImage} />
                                        <View style={SearchStyles.productDetailContainer}>
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.semiBoldText, { fontSize: 20 }]}>{product.pCategory}</Text>
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.regularText, { fontSize: 16 }]}>{product.pName}</Text>
                                            <Text
                                                numberOfLines={1}
                                                style={[GlobalStyles.semiBoldText, { fontSize: 20, alignSelf: 'flex-end' }]}>{product.pPrice}원</Text>
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
                            style={GlobalStyles.upwardButtonContainer}
                        >
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