import { StyleSheet, Dimensions } from "react-native"

const screenWidth = Dimensions.get('screen').width;  // topbar를 제외한 화면 너비
const screenHeight = Dimensions.get('screen').height;

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    ExtraBoldText:{
        fontFamily: 'Pretendard-Bold',
        fontSize: 80,
        color: 'black',
        letterSpacing: -4,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    BoldText:{
        fontFamily: 'Pretendard-Bold',
        fontSize: 20,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    semiBoldText:{
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    mediumText:{
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    regularText:{
        fontFamily: 'Pretendard-Regular',
        fontSize: 14,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    lightText:{
        fontFamily: 'Pretendard-Light',
        fontSize: 12,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    blackButton:{
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 12,
    },
    gradientWhite:{
        //...StyleSheet.absoluteFillObject
    }
});
export default GlobalStyles;