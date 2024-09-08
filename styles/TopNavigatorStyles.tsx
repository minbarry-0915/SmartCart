import { StyleSheet } from "react-native";

const TopNavigatorStyles = StyleSheet.create({
    container:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 60,
        paddingBottom: 24,
        paddingTop: 36,
    },
    content:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:"center",
    },
    textInputBlack:{
        flex: 1,
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
        borderBottomWidth: 2,
    },
    textInputWhite:{
        flex: 1,
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'white',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
        borderBottomWidth: 2,
        borderColor: 'white',
        paddingVertical: 4,
    }
});
export default TopNavigatorStyles;
