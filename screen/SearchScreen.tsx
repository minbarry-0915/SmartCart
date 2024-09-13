import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import SearchStyles from "../styles/SearchScreenStyles";
import GlobalStyles from "../styles/GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import useGetRecentKeyword from "../customHooks/useGetRecentKeywords";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";
import usePostRecentKeywords from "../customHooks/usePostRecentKeywords";
import { CancelIcon } from "../assets/icons";

function SearchScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  //redux
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const { keywordArray, loading, error, getRecentKeyword, setKeywordArray } = useGetRecentKeyword();

  usePostRecentKeywords(keywordArray,setKeywordArray);

  //처음 한번만 실행됨
  useEffect(() => {
    console.log("loginStatus:", isLoggedIn);
    const unsubscribe = navigation.addListener('focus', () => {
      // 페이지가 돌아올 때마다 실행되는 코드
      getRecentKeyword(); // 최근 키워드 가져오기
    });

    // cleanup 함수로 listener를 제거합니다.
    return unsubscribe;
  }, [navigation]);


  const deleteNodeButton = (index: number) => {
    const newKeywordArray = [...keywordArray];
    newKeywordArray.splice(index, 1);
    setKeywordArray(newKeywordArray);
  };

  const deleteAllKeyword = () => {
    setKeywordArray([]);
  };

  const onRecentKeywordNode = (pNum: string) => {
    navigation.navigate('ProductDetail', { pNum: pNum });
  };


  return (
    <View style={{
      flex: 1,
    }}>
      {isLoggedIn ? (
        <LinearGradient
          colors={['#000000', '#666666']}
          style={{ flex: 1 }}
        >
          <TopNavigator
            title="검색"
            mode="black"
            navigation={navigation}
            showSearchButton={false}
            showSearchBar={true}  
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[GlobalStyles.scrollContainer]}>

            <View style={SearchStyles.content}>
              <Text style={[GlobalStyles.semiBoldText, { color: 'white', fontSize: 24 }]}>최근 검색어</Text>
            </View>

            <View style={[SearchStyles.content, { alignItems: 'flex-end', marginBottom: 24 }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={deleteAllKeyword}
              >
                <Text style={[GlobalStyles.semiBoldText, { color: '#ED7272', fontSize: 18 }]}>전체삭제</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={[SearchStyles.content, { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }]}>
                <Loading style={AnimationStyles.loading} />
              </View>
            ) : (
              <View style={[SearchStyles.content, { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-start' }]}>
                {keywordArray.map((keyword, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    style={SearchStyles.keywordNode}
                    onPress={() => onRecentKeywordNode(keyword.pNum)}
                  >
                    <Text style={[GlobalStyles.mediumText, { fontSize: 16, lineHeight: 24, marginRight: 8 }]}>{keyword.pName}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => deleteNodeButton(index)}>
                      <CancelIcon width={20} height={20} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}


          </ScrollView>
        </LinearGradient>

      ) : (
        <View style={{ flex: 1 }}>
          <Text>Login again</Text>
        </View>
      )

      }

    </View>
  );

}
export default SearchScreen;