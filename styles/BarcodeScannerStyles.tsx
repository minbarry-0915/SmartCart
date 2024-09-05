import { StyleSheet } from "react-native";


const ScannerStyles = StyleSheet.create({
    Container:{
        flex:1,
        borderWidth: 2,
        borderRadius: 20,  
        justifyContent: 'center',
        marginBottom: 24,
        padding: 24,
    },
    Camera:{
        width: '100%',
        height: '100%', 
    },
    ScanRequestButton:{
        width: '100%',
        height: '100%',
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
});
export default ScannerStyles;