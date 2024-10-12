import { StyleSheet } from "react-native";


const LocationModalStyles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content:{
        width: '30%',
        backgroundColor: 'white',
        padding: 24,
        justifyContent: 'center',
        alignItems:'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        elevation: 10,
        zIndex: 1,
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    button:{
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 2,    
    }
})
export default LocationModalStyles;