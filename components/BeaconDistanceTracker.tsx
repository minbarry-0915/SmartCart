import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BeaconDistanceTracker = ({ beaconId, txPower }: { beaconId: string; txPower: number }) => {
    const [beaconDistance, setBeaconDistance] = useState<number | null>(null);
    const manager = new BleManager();

    // 거리 계산 함수
    const calculateDistance = (rssi: number) => {
        if (rssi === 0) return -1; // RSSI가 0이면 거리를 알 수 없음
        const ratio = rssi / txPower;
        if (ratio < 1.0) {
            return Math.pow(10, (txPower - rssi) / (10 * 2)); // 거리 계산
        } else {
            return 0.89976 * Math.pow(10, (txPower - rssi) / (10 * 1.5)); // 거리 계산
        }
    };

    useEffect(() => {
        const startScan = async () => {
            console.log('스캔 시작');
            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.error('스캔 오류:', error);
                    return;
                }

                if (device) {
                    console.log('발견된 디바이스 MAC 주소:', device.id);
                    
                    // 비콘의 UUID로 필터링
                    // 예시로 여기서는 device.serviceUUIDs를 사용하여 UUID를 확인할 수 있습니다.
                    // UUID가 일치하는지 확인
                    if (device.id === beaconId) {
                        console.log(`비콘 발견: ${device.id}`);

                        // RSSI 값을 직접 사용
                        const rssi = device.rssi; // 이 값을 사용할 수 있는 방법은 device 객체에 따라 다를 수 있습니다.
                        if (rssi !== null) {
                            const distance = calculateDistance(rssi);
                            console.log(`RSSI: ${rssi}, 계산된 거리: ${distance}`);
                            setBeaconDistance(distance);
                        }
                    }
                }
            });
        };

        startScan();

        // 스캔 중지
        return () => {
            console.log('스캔 중지');
            manager.stopDeviceScan();
        };
    }, [beaconId, txPower]);

    return (
        <View>
            <Text>
                비콘과의 거리: {beaconDistance !== null ? `${beaconDistance.toFixed(2)} m` : '측정 중...'}
            </Text>
        </View>
    );
};

export default BeaconDistanceTracker;
