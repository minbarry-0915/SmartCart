import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BeaconDistanceTracker = ({ beaconId, txPower }: { beaconId: string, txPower: number }) => {
    const [beaconDistance, setBeaconDistance] = useState<number>();
    const manager = new BleManager();

    const calculateDistance = (rssi: number | null) => {
        if (rssi === 0) return -1;
        if (rssi != null) {
            const ratio = rssi / txPower;
            if (ratio < 1.0) {
                return Math.pow(10, (txPower - rssi) / (10 * 2));
            } else {
                return 0.89976 * Math.pow(10, (txPower - rssi) / (10 * 1.5));
            }
        }
    };

    const requestBluetoothPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            if (granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Bluetooth Permission Granted.');
            } else {
                console.log('Bluetooth Permission Denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        const startScan = async () => {
            console.log('스캔 시작');
            await requestBluetoothPermissions();
            
            try {
                manager.startDeviceScan(null, null, (error, device) => {
                    if (error) {
                        console.error('스캔 오류:', error);
                        return;
                    }
                    // if (device)
                    //     console.log(device.id);
    
                    if (device && (device.id === beaconId || device?.name === 'test')) {
                        console.log(`비콘 발견: ${device.id}`);
                        const distance = calculateDistance(device.rssi);
                        console.log(`RSSI: ${device.rssi}, 계산된 거리: ${distance}`);
                        setBeaconDistance(distance);
                    }
                });
    
            } catch (e) {
                console.error('스캔 중 에러:', e);
                // 에러 발생 시 5초 대기 후 재시도
                setTimeout(() => startScan(), 5000);
            }
        };
    
        startScan();
    
        return () => {
            manager.stopDeviceScan();
        };
    }, [beaconId, txPower]);
    

    return (
        <View>
            <Text>
                비콘과의 거리: {beaconDistance !== null && beaconDistance !== undefined ? `${beaconDistance.toFixed(2)} m` : '측정 중...'}
            </Text>
        </View>
    );
};

export default BeaconDistanceTracker;
