import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "./StyleSheet";


function MyPageScreen(){
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [name,setName] = useState('');
    
    const getId = () => {
        const jsonResponse = {
            "ID": "1234",
            "Name": "이지민"
        }
        setName(jsonResponse.Name);

    }

    useEffect(()=>{
        getId();
    },[]);

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
            <Header showBackButton={true} title="마이페이지" showSearchButton={true} showCartButton={true} navigation={navigation}/>

            {/* body */}
            <View style={[styles.BodyContainer,{flexDirection:'column'}]}>
                <ScrollView contentContainerStyle={styles.ProductDetailScrollContainer}>
                    <View style={[styles.MyPageMenuContainer, {borderWidth: 0, paddingBottom: 10}]}>
                        <Text style={{fontFamily: 'Pretendard-Medium', fontSize: 32, color: '#6E91EB'}}>{name}</Text>
                        <Text style={styles.MainText}> 님 환영합니다</Text>
                    </View>
                    <View style={[styles.MyPageMenuContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                        <Text style={styles.MainText}>최근 구매 상품의 연관 상품</Text>
                        <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.RecommendProductListContainer}>
                            <Text>this is no1</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                            <Text>this is no2</Text>
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={styles.MyPageMenuContainer}>
                        <View style = {styles.MyPageMenuIconContainer}>
                            <Image 
                            source={require('../assets/icon/shoppingCart.png')} style={styles.MyPageMenuIcon}  resizeMode='contain'/>
                        </View> 
                        <Text style={styles.MainText}> 주문목록조회</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.MyPageMenuContainer}>
                        <View style = {styles.MyPageMenuIconContainer}>
                            <Image 
                            source={require('../assets/icon/person.png')} style={styles.MyPageMenuIcon} resizeMode='contain'/>
                        </View> 
                        <Text style={styles.MainText}> 개인정보수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.MyPageMenuContainer}>
                        <View style = {styles.MyPageMenuIconContainer}>
                            <Image 
                            source={require('../assets/icon/mynaui_logout.png')} style={styles.MyPageMenuIcon} resizeMode='contain'/>
                        </View> 
                        <Text style={[styles.MainText, {color:'#ED7272'}]}> 로그아웃</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            
        </SafeAreaView>
    )
}
export default MyPageScreen;