import { StyleSheet } from "react-native";

const SearchStyles = StyleSheet.create({
    content:{
        width: '50%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    keywordNode:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 14,
        marginBottom: 24,
        elevation: 10,
    },
    productNode:{
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 24,
        padding: 24,
        elevation: 10,
    },
    productImage:{
        width: 110,
        height: 140,
        resizeMode:'cover',
        borderRadius: 20,
        marginRight: 24,
    },
    productDetailContainer:{
        flex: 2,
        justifyContent:'space-between'
    }
});
export default SearchStyles;