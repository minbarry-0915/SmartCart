import { StyleSheet } from "react-native";


const ScannerStyles = StyleSheet.create({
    Container:{
        width: '100%',
        height: '55%',
        borderWidth: 2,
        borderRadius: 20,  
        justifyContent: 'center',
        padding: 14,
    },
    Camera:{
        width: '100%',
        height: '100%',
    },
    ScanCancelButton:{
        position:'absolute',
        bottom: 24,
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
        zIndex: 1,
    },
    ScanRequestButton:{
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    ScanRequestButtonText:{
        fontFamily: 'Pretendard-Bold',
        fontSize: 30,
        color: '#6E91EB',
        lineHeight: 35,
    },
    totalTextContainer:{
        width: '100%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    GrandText:{
        color: 'black',
        fontFamily: 'Pretendard-Bold',
        fontSize: 25,
    },
    GrandSubText:{
        color: '#696969',
        fontFamily: 'Pretendard-Regular',
        fontSize: 20,
    },
});
export default ScannerStyles;