import React, { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../screen/StyleSheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";

interface MyParams{
    id: string,
}

const Header = ({showBackButton,title,showSearchContainer,showSearchButton,showCartButton,showMyPageButton, navigation}:{showBackButton:boolean, title: string, showSearchContainer:boolean, showSearchButton: boolean, showCartButton:boolean, showMyPageButton:boolean, navigation: NavigationProp<ParamListBase>}) =>{

    const [backButton, setBackButton] = useState(false);
    const [searchContainer, setSearchContainer] = useState(false);
    const [searchButton, setSearchButton] = useState(false);
    const [cartButton, setCartButton] = useState(false);
    const [myPageButton, setMyPageButton] = useState(false);
    const [keyword, setKeyword] = useState<string>('');

    useEffect(() => {
        setBackButton(showBackButton);
        setSearchContainer(showSearchContainer);
        setSearchButton(showSearchButton);
        setCartButton(showCartButton);
        setMyPageButton(showMyPageButton);
      }, [showBackButton, showSearchContainer, showSearchButton, showCartButton, showMyPageButton]);
    

    const onBackButton = () =>{
        navigation.goBack();
    };
    const onSearchButton = () => {
        navigation.navigate('Search',);
    }
    const onCartButton = () => {
        navigation.navigate('Cart');
    }
    const onMyPageButton = () => {
        navigation.navigate('MyPage');
    }
    const onSearchResultButton = () =>{
        navigation.navigate('SearchResult', {resultKeyword:keyword});
        //recentkeyword put으로 업데이트 해야됨
    };
    const onRecentKeywordNode = (pNum:string) =>{
        //recentkeyword put으로 업데이트 해야됨
        navigation.navigate('ProductDetail',{pNum:pNum});
    };
    const onChangeKeyword = (text: string) => {
        //trim: 양쪽끝의 공백을 제거함
        setKeyword(text.trim());
    };
    const onTextInput = () =>{
        navigation.navigate('Search');
    }

    return(
        <View style={styles.HeaderContainer}>
              <View style={{flexDirection:'row', justifyContent: 'center'}}>
                {backButton == true && (
                    <TouchableOpacity onPress={onBackButton} >
                    <Image 
                      source={require('../assets/icon/back.png')}
                      style={{width: 50, height: 50, marginRight: 8}}/>
                  </TouchableOpacity>
                )}
                <Text style={styles.HeaderTitleText}>
                 {title}
                </Text>
              </View>
                {showSearchContainer == true && (
                    <View style={styles.SearchContainer}>
                        <TextInput
                        style = {styles.searchInputText}
                        placeholder='검색어를 입력하세요'
                        onChangeText={onChangeKeyword}
                        //onFocus={onTextInput}
                        />
                        <TouchableOpacity onPress={()=>onSearchResultButton()}style={styles.SearchButton}>
                            <Ionicons name ='search' size={50} color={'black'}/>
                        </TouchableOpacity>
                    </View> 
                )}
                
              <View style={{flexDirection: 'row'}}>
                {searchButton == true && (
                    <TouchableOpacity onPress={onSearchButton} style={styles.SearchButton}>
                        <Ionicons name ='search' size={50} color={'black'}/>
                    </TouchableOpacity>
                )}
                {cartButton == true && (
                    <TouchableOpacity onPress={onCartButton} style={{marginRight: 12}}>
                        <Image 
                        source={require('../assets/icon/shoppingCart.png')}
                        style={{width: 50, height: 53}}  
                        />
                    </TouchableOpacity> 
                )}
                {myPageButton == true && (
                    <TouchableOpacity onPress={onMyPageButton} style={styles.MyPageButton}>
                        <Ionicons name='person' size={50} color={'black'}/>
                  </TouchableOpacity>
                )}
                
              </View>
        </View>
    )
}
export default Header;