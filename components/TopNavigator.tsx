import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import TopNavigatorStyles from "../styles/TopNavigatorStyles";
import { BackBlackIcon, BackWhiteIcon, SearchBlackIcon, SearchWhiteIcon, CartBlackIcon, CartWhiteIcon, PersonBlackIcon, PersonWhiteIcon } from "../assets/icons";

import GlobalStyles from "../styles/GlobalStyles";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import usePostSearchKeyword from "../customHooks/usePostRecentKeywords";

interface Prop {
    title: string,
    showMyPageButton?: boolean,
    showCartButton?: boolean,
    showBackButton?: boolean,
    showSearchButton?: boolean,
    showSearchBar?: boolean,
    navigation: NavigationProp<ParamListBase>,
    mode?: 'white' | 'black',
}

const TopNavigator = ({
    showBackButton = true,
    showSearchButton = true,
    showMyPageButton = true,
    showCartButton = true,
    title,
    showSearchBar = false,
    navigation,
    mode = "white" }: Prop) => {
    const [keyword, setKeyword] = useState<string>('');
    const { userId } = useSelector((state: RootState) => state.auth);
    const { postSearchKeyword } = usePostSearchKeyword();

    const onBackButton = () => {
        navigation.goBack();
    }

    const onSearchButton = () => {
        navigation.navigate('Search');
    }

    const onMyPageButton = () => {
        navigation.navigate('MyPage');
    }

    const onCartButton = () => {
        navigation.navigate('Cart');
    }

    const onSearchResultButton = async () => {
        try {
            const result = await postSearchKeyword(keyword);
            if (result) {
                navigation.navigate('SearchResult', { resultKeyword: keyword });
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus',()=>{
            setKeyword('');
        })
        return unsubscribe;
    },[navigation]);

    // 아이콘을 선택하기 위한 조건문
    const BackIcon = mode === "black" ? BackWhiteIcon : BackBlackIcon;
    const SearchIcon = mode === "black" ? SearchWhiteIcon : SearchBlackIcon;
    const PersonIcon = mode === "black" ? PersonWhiteIcon : PersonBlackIcon;
    const CartIcon = mode === "black" ? CartWhiteIcon : CartBlackIcon;
    const textColor = mode === "black" ? "white" : "black"; // black 모드일 경우 흰색, 그렇지 않으면 검정색

    return (
        <View style={TopNavigatorStyles.container}>
            <View style={TopNavigatorStyles.content}>
                {showBackButton && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onBackButton}
                        style={{ marginRight: 4 }}>
                        <BackIcon width={40} height={40} />
                    </TouchableOpacity>
                )}

                <Text style={[GlobalStyles.BoldText, { fontSize: 32, color: textColor }]}>
                    {title}
                </Text>
            </View>

            {showSearchBar && (
                <View style={TopNavigatorStyles.content}>
                    <TextInput
                        onChangeText={setKeyword}
                        value={keyword}
                        style={mode === "black" ? TopNavigatorStyles.textInputWhite : TopNavigatorStyles.textInputBlack}
                        autoCorrect={false}           // 자동수정 비활성화
                        autoCapitalize="none"         // 자동대문자 비활성화
                        autoComplete="off"            // 자동완성 비활성화
                    />
                    <TouchableOpacity
                        onPress={onSearchResultButton}
                        activeOpacity={0.8}
                    >
                        <SearchIcon width={40} height={40} />
                    </TouchableOpacity>
                </View>
            )}

            <View style={[TopNavigatorStyles.content, { justifyContent: 'flex-end' }]}>
                {showMyPageButton && (<TouchableOpacity
                    onPress={onMyPageButton}
                    activeOpacity={0.8}
                    style={{ marginRight: 12 }}>
                    <PersonIcon width={40} height={40} />
                </TouchableOpacity>)}

                {showCartButton && (<TouchableOpacity
                    onPress={onCartButton}
                    activeOpacity={0.8}
                    style={{ marginRight: 12 }}>
                    <CartIcon width={40} height={40} />
                </TouchableOpacity>)}

                {showSearchButton && (
                    <TouchableOpacity
                        onPress={onSearchButton}
                        activeOpacity={0.8}
                    >
                        <SearchIcon width={40} height={40} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
export default TopNavigator;
