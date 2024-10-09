import { StyleSheet } from "react-native";

const WarningModalStyles = StyleSheet.create({
    content:{
        width: '30%',
        backgroundColor: 'white',
        paddingHorizontal: 36,
        paddingVertical: 36,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 20,
        elevation: 10,
        zIndex: 1,
    },
    item:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default WarningModalStyles;