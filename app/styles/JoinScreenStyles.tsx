import { StyleSheet } from "react-native";


const JoinStyles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    item: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textInput: {
        width: '100%',
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical: 'center',
        borderBottomWidth: 1,
    },
    dropDownButton: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    dropDownItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    }
})
export default JoinStyles;