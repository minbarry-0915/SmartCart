import { StyleSheet } from "react-native";

const UserInfoStyles = StyleSheet.create({
    content:{
        width: '45%',
        paddingVertical: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 10,
    },
    item:{
        width: '100%',
        justifyContent: 'center',
        alignItems:'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    detailScreenItem: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        marginBottom: 12,
        elevation: 10,
    },
    subItem:{
        width: '50%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    
})
export default UserInfoStyles;