import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
import SearchStyles from "../styles/SearchScreenStyles";
import GlobalStyles from "../styles/GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import useGetRecentKeyword from "../customHooks/useGetRecentKeywords";
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/AnimationStyles";
import { CancelIcon } from "../assets/icons";
import useDeleteSearchKeyword from "../customHooks/useDeleteSearchKeyword";
import usePostSearchKeyword from "../customHooks/usePostRecentKeywords";

function SearchScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  //redux
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  //customHooks
  const { keywordArray, loading, error, getRecentKeyword, setKeywordArray } = useGetRecentKeyword();
  const { deleteSearchKeyword } = useDeleteSearchKeyword();
  const { postSearchKeyword } = usePostSearchKeyword();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("loginStatus:", isLoggedIn);
    const unsubscribe = navigation.addListener('focus', () => {
      // 페이지가 돌아올 때마다 실행되는 코드
      console.log("Focus event triggered"); // Focus 이벤트가 호출되었음을 확인
      getRecentKeyword(); // 최근 키워드 가져오기
    });

    // 클린업 함수: 컴포넌트 언마운트 시 리스너 제거
    return () => {
      unsubscribe(); // 리스너를 제거하여 중복 등록 방지
    };
  }, [navigation]); // 'navigation'만 의존성으로 추가

  const deleteNodeButton = async (index: number, keywordId: number) => {
    // 현재 keywordArray를 복사하고 해당 인덱스의 항목을 삭제
    const newKeywordArray = [...keywordArray];
    newKeywordArray.splice(index, 1);
    setKeywordArray(newKeywordArray); // UI 상태를 먼저 업데이트

    // API 요청을 보냅니다.
    const result = await deleteSearchKeyword(keywordId);
    if (!result) {
      // 만약 요청이 실패하면 이전 상태로 복구
      const revertedKeywordArray = [...newKeywordArray];
      revertedKeywordArray.splice(index, 0, keywordArray[index]); // 삭제한 항목을 다시 추가
      setKeywordArray(revertedKeywordArray); // UI 상태를 복구
    }
  };

  const deleteAllKeyword = async () => {
    // UI 상태를 먼저 업데이트하여 모든 키워드를 삭제한 것으로 설정
    const previousKeywords = [...keywordArray]; // 현재 키워드를 저장하여 오류 시 복구 가능
    setKeywordArray([]); // UI에서 모든 키워드를 즉시 제거

    try {
      // 모든 삭제 요청을 Promise.all로 처리
      const result = await Promise.all(
        previousKeywords.map(keyword => deleteSearchKeyword(keyword.Keyword_id))
      );

      // 결과를 체크하여 모든 삭제가 성공했는지 확인
      if (!result.every(res => res)) {
        // 일부 삭제가 실패한 경우, 이전 상태로 복구
        setKeywordArray(previousKeywords);
      }
    } catch (error) {
      console.error('Failed to delete all keywords:', error);
      // 예외 발생 시 이전 상태로 복구
      setKeywordArray(previousKeywords);
    }
  };

  const onRecentKeywordNode = async (keywordName: string) => {
    if (isSubmitting) return; // 중복 클릭 방지
    setIsSubmitting(true);
    navigation.navigate('SearchResult', { resultKeyword: keywordName });

    const result = await postSearchKeyword(keywordName).catch((error) => {
      console.error('Error posting search keyword:', error);
      return null;
    });
    setIsSubmitting(false); // API 완료 후 다시 활성화
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
                  <View
                    key={index}
                    style={SearchStyles.keywordNode}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => onRecentKeywordNode(keyword.Keyword_name)}
                      disabled={isSubmitting}
                    >
                      <Text style={[GlobalStyles.mediumText, { fontSize: 16, lineHeight: 24, marginRight: 8 }]}>{keyword.Keyword_name}</Text>
                    </TouchableOpacity>
                    {/* delete */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={(e) => {
                        e.stopPropagation(); // 내부 클릭이 외부 클릭 이벤트를 발생시키지 않도록 함
                        deleteNodeButton(index, keyword.Keyword_id);
                      }}>
                      <CancelIcon width={20} height={20} />
                    </TouchableOpacity>
                  </View>
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