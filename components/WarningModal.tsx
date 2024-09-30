import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import LocationModalStyles from "../styles/LocationModalStyles";
import WarningModalStyles from "../styles/WarningModalStyles";
import GlobalStyles from "../styles/GlobalStyles";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface Prop {
    modalVisible: boolean,
    toggleWarningModal: () => void,
    confirmDestination: string,
    navigation: NavigationProp<ParamListBase>
}

function WarningModal({ modalVisible, toggleWarningModal, navigation, confirmDestination }: Prop) {
    const [visible, setVisible] = useState<boolean>(modalVisible);

    const onConfirmButton = () => {
        navigation.navigate(confirmDestination);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { }}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={[LocationModalStyles.background, { justifyContent: 'center' }]}
            >
                <View style={[WarningModalStyles.content]}>
                    <View style={[WarningModalStyles.item,{marginBottom: 12}]}>
                        <Text style={[GlobalStyles.semiBoldText, {fontSize: 20, textAlign: 'center' ,lineHeight: 32}]}>
                            수정된 개인정보가 저장되지 않았어요.
                        </Text>
                        <Text style={[GlobalStyles.semiBoldText, {fontSize: 20, textAlign: 'center' ,lineHeight: 32}]}>
                            저장하지 않고 종료할까요?
                        </Text>
                    </View>
                    <View style={[WarningModalStyles.item,{flexDirection: 'row', justifyContent:'space-between'}]}>
                        <TouchableOpacity
                            onPress={onConfirmButton}
                            activeOpacity={0.7}
                            style={[GlobalStyles.blackButton, { width: '48%', backgroundColor: '#E33434' }]} >
                            <Text style={[GlobalStyles.BoldText, { color: 'white' }]}>네</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleWarningModal}
                            activeOpacity={0.7}
                            style={[GlobalStyles.blackButton, { width: '48%', backgroundColor: 'white' }]} >
                            <Text style={[GlobalStyles.BoldText, { color: 'black' }]}>아니오</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity>
        </Modal>
    )
}
export default WarningModal;