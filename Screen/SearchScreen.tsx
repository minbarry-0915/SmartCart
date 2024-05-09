import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, {useCallback, useEffect, useState} from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./StyleSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";




function SearchScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const onSearchButton = () =>{

    };
    const onMyPageButton = () =>{
    
    };
    return(
        <SafeAreaView>
            <View style={styles.HeaderContainer}>
                <Text style={styles.HeaderTitleText}>
                    검색
                </Text>
                <View style={styles.SearchContainer}>
                    <TextInput
                        clearButtonMode='always'
                        style = {styles.searchInputText}
                        placeholder='검색어를 입력하세요'
                    />
                    <TouchableOpacity onPress={onSearchButton} style={styles.SearchButton}>
                        <Ionicons name ='search' size={50} color={'black'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={onMyPageButton} style={styles.MyPageButton}>
                    <Ionicons name='person' size={50} color={'black'}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
    
}
export default SearchScreen;