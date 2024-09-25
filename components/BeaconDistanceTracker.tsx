import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const BeaconDistanceTracker = () => {
    const [beaconDistance, setBeaconDistance] = useState<number | null>(null);
    const [connected, setConnected] = useState<boolean>(false);  // 연결 상태 관리
    const manager = useRef(new BleManager()).current; //블루투스 객체 생성 및 현재 상태 추적 

    useEffect(() => {
        //블루투스 관련 권한 요청 
        const requestPermissions = async () => {
            const fineLocationGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            const coarseLocationGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            console.log('FineLocationGranted:', fineLocationGranted);
            console.log('CoarseLocationGranted:', coarseLocationGranted);

            if (Platform.OS === 'android' && Platform.Version >= 31) {
                const bluetoothScanGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
                console.log('BluetoothScanGranted:', bluetoothScanGranted);
                const bluetoothConnectGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
                console.log('BluetoothConnectGranted:', bluetoothConnectGranted);
            }
        };
        //RSSI 기반 거리 계산
        const calculateDistance = (rssi: number, txPower: number): number => {
            if (rssi === 0) return -1.0;

            const ratio = rssi / txPower;
            if (ratio < 1.0) return Math.pow(10, (txPower - rssi) / (10 * 1));
            return (0.89976) * Math.pow(10, (txPower - rssi) / (10 * 2));
        };

        //RSSI값 실시간 업데이트
        const handleUpdateRSSI = async (device: Device) => {
            const { rssi, isConnectable } = device;
        
            if (rssi !== null) {
                const txPower = 0;
                const distance = calculateDistance(rssi, txPower);
                setBeaconDistance(distance);
                console.log('RSSI:', rssi, '거리:', distance.toFixed(2), '미터');
        
                // 연결 가능 여부 체크
                if (!connected && isConnectable) {
                    try {
                        console.log('디바이스 연결 시도 중...'); // 연결 시도 로그 
                        await device.connect();
                        await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기 
                        const isConnected = await device.isConnected();  // 연결 상태 확인
                        setConnected(isConnected); // 연결 상태 업데이트 
                        console.log(isConnected ? '디바이스가 연결되었습니다.' : '디바이스 연결에 실패했습니다.');
                    } catch (error) {
                        console.log('디바이스 연결 중 오류 발생:', error);
                    }
                } else if (!isConnectable) {
                    console.log('디바이스는 연결할 수 없습니다.'); // 연결 불가 로그 추가
                } else {
                    console.log('이미 연결된 상태입니다.'); // 추가 로그
                }
            } else {
                console.log('RSSI 값이 null입니다.');
            }
        };
        
        
        //비콘 추적 시작
        const startScanning = () => {
            const beaconUUID = '74278bda-b644-4520-8f0c-720eaf059935'; // 비콘의 UUID로 변경하세요.
            manager.startDeviceScan(
                //UUIDs: UUID[] | null
                [beaconUUID], 
                // options: ScanOptions | null,
                null, 
                // listener: (error: BleError | null, scannedDevice: Device | null) => void
                (error, device) => {
                if (error) {
                    console.error(error);
                    return;
                }
                if (device) {
                    console.log('Device Detected:', device);
                    handleUpdateRSSI(device);
                }else{
                    console.log('Failed to find Device while scanning');
                }
            }
        )};
        

        //권한 승인 나면, 비콘 스캔 시작
        requestPermissions().then(() => {
            
        });
        startScanning();
        
    }, [manager, connected]);  // connected 상태를 의존성 배열에 추가

    useEffect(() => {
        console.log('현재 비콘과의 거리:', beaconDistance);
    }, [beaconDistance]);

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
                console.log('bleManger State:',state);
        })

        return () => {
            subscription.remove();
        }
    },[])

    return (
        <View>
            <Text style={{ color: 'white' }}>
                비콘과의 거리: {beaconDistance !== null ? `${beaconDistance.toFixed(2)} 미터` : '측정 중...'}
            </Text>
            <Text style={{ color: 'white' }}>
                연결 상태: {connected ? '연결됨' : '연결되지 않음'}
            </Text>
        </View>
    );
};

export default BeaconDistanceTracker;
