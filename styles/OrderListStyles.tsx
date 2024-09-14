import { StyleSheet } from "react-native";

export const OrderListStyles = StyleSheet.create({
    orderContainer: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 20,
        marginBottom: 48,
    },
    orderContent: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    orderItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },  
    imageContainer:{
        width: 100,
        height: 125,
        marginRight: 10,
        borderRadius: 20,
        borderColor: '#B4B4B4',
        backgroundColor: '#696969',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20,
    },
    textContainer:{
        flex: 1,
        padding: 12, 
    },
    textItem:{
        marginBottom: 12,
    }

})
