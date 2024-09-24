// BeaconDistanceTracker.tsx
import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const BeaconDistanceTracker = () => {
    const [beaconDistance, setBeaconDistance] = useState<number | null>(null);
    const manager = useRef(new BleManager()).current;

    useEffect(() => {
        const requestPermissions = async () => {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

            // Android 12 이상에서 Bluetooth 권한 요청
            if (Platform.OS === 'android' && Platform.Version >= 31) {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
            }
        };

        const calculateDistance = (rssi: number, txPower: number): number => {
            if (rssi === 0) return -1.0;

            const ratio = rssi / txPower;
            if (ratio < 1.0) return Math.pow(10, (txPower - rssi) / (10 * 1));
            return (0.89976) * Math.pow(10, (txPower - rssi) / (10 * 2));
        };

        const handleUpdateRSSI = (device: Device) => {
            const { rssi } = device;

            // rssi가 null이 아닌 경우에만 거리 계산
            if (rssi !== null) {
                const txPower = -40; // 비콘의 TX Power 값, 필요시 변경 가능
                const distance = calculateDistance(rssi, txPower);
                setBeaconDistance(distance);
                console.log('RSSI:', rssi, '거리:', distance.toFixed(2), '미터');
            } else {
                console.log('RSSI 값이 null입니다.');
            }
        };

        const startScanning = () => {
            const beaconUUID = 'e2c56db5-dffb-48d2-b060-d0f5a71096e0'; // 비콘의 UUID로 변경하세요.
            manager.startDeviceScan([beaconUUID], null, (error, device) => {
                if (error) {
                    console.error(error);
                    return;
                }
                if (device) {
                    handleUpdateRSSI(device);
                }
            });
        };

        requestPermissions().then(() => {
            startScanning();
        });

        return () => {
            manager.stopDeviceScan();
        };
    }, [manager]);

    useEffect(() => {
        // 비콘 거리 변경 시 콘솔에 출력
        console.log('현재 비콘과의 거리:', beaconDistance);
    }, [beaconDistance]);

    return (
        <View>
            <Text style={{ color: 'white' }}>
                비콘과의 거리: {beaconDistance !== null ? `${beaconDistance.toFixed(2)} 미터` : '측정 중...'}
            </Text>
        </View>
    );
};

export default BeaconDistanceTracker;
