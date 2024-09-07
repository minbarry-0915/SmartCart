import { StyleSheet } from "react-native";

const LoginStyles = StyleSheet.create({
    logo:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
    },
    content:{
        width: '30%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        
        marginBottom: 10,
    },
    textInput:{
        width: '100%',
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
        borderBottomWidth: 2,
    },
    optionContainer:{
        flexDirection:'row',
        width: '30%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    optionContent:{
        justifyContent:'center',
        alignItems:'center',
        padding: 10,
    }
});
export default LoginStyles;