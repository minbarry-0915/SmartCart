import { StyleSheet } from "react-native";

const CartStyles = StyleSheet.create({
    bodyContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingBottom: 24,
        paddingHorizontal: 42,
    },
    buyingListContainer:{
        flex: 7,
        borderWidth: 2,
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
        marginRight: 8,
    },
    buyingListHeader:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteAllButton:{
        width: 100,
        height: 40,
        borderWidth: 2,
        borderColor: '#E33434',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        backgroundColor: 'white',
    },
    listNodeContainer:{
        width: '100%',
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        height: 40,
        marginTop: 12,
    },
    categoryText:{
        fontFamily: 'Pretendard-Regular',
        fontSize: 20,
        color: '#696969',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
        paddingHorizontal: 8
    },
    stick:{
        width: '100%',
        height: 2,
        backgroundColor: '#D9D9D9',
        marginTop: 12,
    },
    totalContainer:{
        flex:1,
        marginTop: 12,
        borderWidth:2,
        borderRadius: 20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#FFE68C",
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    totalTextContainer:{
        width: '100%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
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
    
})
export default CartStyles;