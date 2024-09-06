import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, {useCallback, useEffect, useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import TopNavigator from "../components/TopNavigator";
//
interface Keyword {
  pNum: string,
  pName: string,
}

function SearchScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
  //redux
  const {isLoggedIn, userId} = useSelector((state:RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [keyword, setKeyword] = useState<string>('');
  const [keywordArray, setKeywordArray] = useState<Keyword[]>([]);

  const getRecentKeyWord = () =>{
      //서버요청 구현 필요
      const jsonResponse = {
          "data": [
              {
                "pNum": '1234',
                "pName": "코카콜라"
              },
              {
                "pNum": 'asdasasa',
                "pName": "마이프로틴"
              },
              {
                "pNum": 'qweqwqww',
                "pName": "커피"
              },
              {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },
                {
                  "pNum": '123412',
                  "pName": "커피"
                },

            ],
            "status": 200,
            "statusText": "OK",
            "headers": {
              "content-type": "application/json; charset=utf-8"
            },
            "config": {
              "url": "https://api.example.com/data",
              "method": "get",
              "headers": {
                "Accept": "application/json, text/plain, */*"
              },
              "transformRequest": [null],
              "transformResponse": [null],
              "timeout": 0,
              "xsrfCookieName": "XSRF-TOKEN",
              "xsrfHeaderName": "X-XSRF-TOKEN",
              "maxContentLength": -1,
              "maxBodyLength": -1
            },
            "request": {}
      };
      setKeywordArray([...jsonResponse.data]);
  };
  
  //처음 한번만 실행됨
  useEffect(() => {
    console.log("loginStatus:",isLoggedIn);
    const unsubscribe = navigation.addListener('focus', () => {
      // 페이지가 돌아올 때마다 실행되는 코드
      getRecentKeyWord(); // 최근 키워드 가져오기
    });

    // cleanup 함수로 listener를 제거합니다.
    return unsubscribe;
  }, [navigation]);

  
  const deleteNodeButton = (index: number) => {
      const newKeywordArray = [...keywordArray];
      newKeywordArray.splice(index,1);
      setKeywordArray(newKeywordArray);   
  };

  const onRecentKeywordNode = (pNum:string) =>{
    //recentkeyword put으로 업데이트 해야됨
    navigation.navigate('ProductDetail',{pNum:pNum});
  };

  return(
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        {isLoggedIn ? (
          <View style={{flex: 1}}>
            <TopNavigator
            title="장바구니"
            navigation={navigation}
            />

            <View style={styles.BodyContainer}>
                <View style={{flex: 0.4}}>
                    <ScrollView
                    showsVerticalScrollIndicator={false} 
                    style={styles.RecentKeywordContainer}> 
                        {keywordArray.map((keyword, index)=>(
                        <View key={index} style={styles.RecentKeywordNode}>
                        <TouchableOpacity onPress={()=>onRecentKeywordNode(keyword.pNum)} style={styles.RecentKeywordTextContainer}>
                            <Text style={styles.RecentKeywordText}>{keyword.pName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={styles.RecentkeywordDeleteButton} onPress={()=>deleteNodeButton(index)}>
                            <AntDesign name='closecircle' size={28} color='black' />
                        </TouchableOpacity>
                        </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
          </View>
        ):(
          <View style={{flex: 1}}>
            <Text>Login again</Text>
          </View>
        )

        }
        
    </SafeAreaView>
  );
    
}
export default SearchScreen;