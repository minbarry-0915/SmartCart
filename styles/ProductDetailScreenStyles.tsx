import { StyleSheet } from "react-native";


const ProductDetailStyles = StyleSheet.create({
    content:{
        width: '100%',
        alignItems: 'center',
    },
    mainImageContainer:{
        width: 300,
        height: 348,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        borderRadius: 20,
        backgroundColor: '#696969',
        marginBottom: 24,
    },
    mainImage:{
        width: '100%',
        height: '100%',
        resizeMode:'cover',
        borderRadius: 20,
    }
}); 
export default ProductDetailStyles;