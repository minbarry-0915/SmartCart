import { StyleSheet } from "react-native";

const MyPageStyles = StyleSheet.create({
    scrollContainer:{
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center',
        paddingVertical: 24,
        paddingBottom: 240,
    },
    content:{
        width: '50%',
        justifyContent:'flex-start',
        alignItems: 'center',
        borderRadius: 12,
        elevation: 10,
        paddingVertical: 24,
        paddingHorizontal: 24,
        marginBottom: 18,
    },  
    recommendListContainer:{
        flexDirection: 'row'
    },
    recommendProductContainer:{
        width: 140,
        height: 240,
        marginRight: 8,
    },
    productImageContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
    },
    button:{
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '50%',
        justifyContent:'flex-start',
        alignItems: 'center',
        borderRadius: 12,
        elevation: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 18,
    }
}); 
export default MyPageStyles;