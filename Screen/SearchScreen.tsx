import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, {useCallback, useEffect, useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

interface Keyword {
    pNum: string,
    pName: string,
}

function SearchScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
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

    const onSearchResultButton = () =>{
      navigation.navigate('SearchResult', {resultKeyword:keyword});
      //recentkeyword put으로 업데이트 해야됨
    };
    const onMyPageButton = () =>{
    };
    const onBackButton = () => {
      navigation.goBack();
    };
    const onCartButton = () =>{
      navigation.navigate('Cart');
    }
    const onRecentKeywordNode = (pNum:string) =>{
      //recentkeyword put으로 업데이트 해야됨
      navigation.navigate('ProductDetail',{pNum:pNum});

    };

    const onChangeKeyword = (text: string) => {
        //trim: 양쪽끝의 공백을 제거함
        setKeyword(text.trim());
    };



    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
            {/* header */}
            <View style={styles.HeaderContainer}>
              <View style={{flexDirection:'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={onBackButton} >
                  <Image 
                source={require('../assets/icon/back.png')}
                style={{width: 50, height: 50}}/>
                </TouchableOpacity>
                <Text style={styles.HeaderTitleText}>
                 검색
                </Text>
              </View>   
              <View style={styles.SearchContainer}>
                <TextInput
                  style = {styles.searchInputText}
                  placeholder='검색어를 입력하세요'
                  onChangeText={onChangeKeyword}
                />
                <TouchableOpacity onPress={onSearchResultButton} style={styles.SearchButton}>
                  <Ionicons name ='search' size={50} color={'black'}/>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={onCartButton} style={{marginRight: 12}}>
                  <Image 
                    source={require('../assets/icon/shoppingCart.png')}
                    style={{width: 50, height: 53}}  
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onMyPageButton} style={styles.MyPageButton}>
                  <Ionicons name='person' size={50} color={'black'}/>
                </TouchableOpacity>
              </View>
              
            </View>

            <View style={styles.BodyContainer}>
                <View style={{flex: 0.4}}>
                    <ScrollView style={styles.RecentKeywordContainer}> 
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
        </SafeAreaView>
    );
    
}
export default SearchScreen;