import React, { useRef, useState, useEffect } from "react";
import { Modal, TouchableOpacity, View, Text, Animated, Easing } from "react-native";
import LocationModalStyles from "../styles/LocationModalStyles";
import Location from "./animations/location";
import AnimationStyles from "../styles/AnimationStyles";
import GlobalStyles from "../styles/GlobalStyles";
import useGetLocation from "../customHooks/useGetLocation";
import { UpwardIcon } from "../assets/icons";
import useBeaconDistance from "./BeaconDistanceTracker";

function LocationModal({ modalVisible, toggleLocationModal }: { modalVisible: boolean, toggleLocationModal: () => void }) {
    const [visible, setVisible] = useState(modalVisible);
    const slideAnim = useRef(new Animated.Value(500)).current;

    const { location } = useGetLocation();
    // 거리 값을 가져올 비콘 ID와 TX Power 설정
    const beaconId = 'e2c56db5-dffb-48d2-b060-d0f5a71096e0'; // 비콘 UUID
    const txPower = 0; // 비콘의 TX Power 설정 (예: 0 dBm)
    const { beaconDistance } = useBeaconDistance(beaconId, txPower); // 커스텀 훅 사용

    useEffect(() => {
        if (modalVisible) {
            setVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 500,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => setVisible(false)); // Set visible to false after animation completes
        }
    }, [modalVisible]);

    return (
        <Modal
            animationType="fade" // No built-in animation
            transparent={true}
            visible={visible}
            onRequestClose={toggleLocationModal}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={LocationModalStyles.background}
            >
                <Animated.View style={[
                    LocationModalStyles.content,
                    {
                        transform: [{ translateY: slideAnim }],
                    }
                ]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ marginBottom: 24, }}
                        onPress={toggleLocationModal}
                    >
                        <UpwardIcon width={24} height={24} style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Location style={AnimationStyles.location} />
                    <View>
                        <Text
                            style={[GlobalStyles.mediumText, { fontSize: 18, flexWrap: 'wrap', textAlign: 'center' }]}>
                            현재 위치에서 <Text style={[GlobalStyles.semiBoldText, { fontSize: 24, color: '#0262F1' }]}>{location}</Text> 구역까지
                        </Text>
                        <Text
                            style={[GlobalStyles.mediumText, { fontSize: 18, flexWrap: 'wrap', textAlign: 'center' }]}>
                            거리는 <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>{beaconDistance} m</Text>입니다.
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}

export default LocationModal;
