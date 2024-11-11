import React, { useEffect, useReducer, useRef, useState } from "react";
import { Animated, Easing, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CancelIcon, UpwardIcon } from "../assets/icons";
import LocationModalStyles from "../styles/LocationModalStyles";
import GlobalStyles from "../styles/GlobalStyles";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import MyPageStyles from "../styles/MypageScreenstyles";
import formatNumber from "../customHooks/fomatNumber";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "./animations/loading";

interface Prop {
    modalVisible: boolean,
    toggleErrorModal: () => void,
    navigation: NavigationProp<ParamListBase>,
    closeErrorModal?: () => void,
}

function BarcodeScanErrorModal({
    modalVisible,
    toggleErrorModal,
    navigation,
    closeErrorModal
}: Prop) {
    const slideAnim = useRef(new Animated.Value(500)).current;
    const [visible, setVisible] = useState<boolean>(false);

    // 애니메이션 실행 함수
    const animateModal = (anim: Animated.Value, toValue: number, callback?: () => void) => {
        Animated.timing(anim, {
            toValue,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            if (callback) callback();
        });
    };

    useEffect(() => {
        if (modalVisible) {
            setVisible(true);
            animateModal(slideAnim, 0);
        } else {
            animateModal(slideAnim, 700, () => {
                setVisible(false);
            })
        }
    }, [modalVisible]);

    const closeRequestHandler = () => {
        animateModal(slideAnim, 700, () => {
            toggleErrorModal(); //추천모달닫음
        });

    }

    return (
        <Modal
            animationType='none' // No built-in animation
            transparent={true}
            visible={visible}
            onRequestClose={toggleErrorModal}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={LocationModalStyles.background}
            >
                {visible && (
                    <Animated.View style={[
                        LocationModalStyles.content,
                        {
                            width: '40%',
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}>
                        <TouchableOpacity
                            onPress={closeRequestHandler}
                            activeOpacity={0.7}
                            style={{ marginBottom: 24, alignSelf:'flex-end'}}
                        >
                            <CancelIcon height={20} width={20} />
                        </TouchableOpacity>
                        <View style={[LocationModalStyles.item, {marginBottom: 12, justifyContent: 'center'}]}>
                            <Text style={GlobalStyles.mediumText}>
                                유효하지 않은 바코드입니다.
                            </Text>

                        </View>
                    </Animated.View>
                )}
            </TouchableOpacity>
        </Modal>
    );
}

export default BarcodeScanErrorModal;