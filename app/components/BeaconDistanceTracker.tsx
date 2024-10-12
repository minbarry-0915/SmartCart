import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import beacons, { BeaconRegion } from '@hkpuits/react-native-beacons-manager';

class KalmanFilter {
    q: number;
    r: number;
    x: number;
    p: number;
    k: number;

    constructor() {
        this.q = 0.01; // 프로세스 노이즈
        this.r = 0.1; // 측정 노이즈
        this.x = 0; // 초기 추정값
        this.p = 1; // 초기 오차 공분산
        this.k = 0; // 칼만 이득
    }

    update(measurement: number) {
        this.p = this.p + this.q; // 예측 단계
        this.k = this.p / (this.p + this.r); // 업데이트 단계
        this.x = this.x + this.k * (measurement - this.x);
        this.p = (1 - this.k) * this.p;
        return this.x;
    }
}

const useBeaconDistance = (beaconId: string | undefined, txPower: number, modalVisible: boolean) => {
    const [beaconDistance, setBeaconDistance] = useState<number | null>(null);
    const kalmanFilter = new KalmanFilter(); // 칼만 필터 인스턴스

    const beaconTarget: BeaconRegion | null = beaconId
        ? {
            identifier: "beacon",
            uuid: beaconId, // 비콘 ID를 props로 받음 : UUID 형태여야됨
        }
        : null;

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            ]);

            if (
                result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
                result['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
                result['android.permission.BLUETOOTH_CONNECT'] === 'granted'
            ) {
                console.log('Permissions related to Bluetooth granted');
            } else {
                console.log('Permissions denied');
            }
        }
    };

    const calculateDistance = (rssi: number | null): number | null => {
        if (rssi === 0) return -1; // RSSI가 0이면 거리를 알 수 없음
        if (rssi != null) {
            const ratio = rssi / txPower;
            if (ratio < 1.0) {
                return parseFloat((Math.pow(10, (txPower - rssi) / (10 * 2))).toFixed(2)); // 거리 계산
            } else {
                return parseFloat((0.89976 * Math.pow(10, (txPower - rssi) / (10 * 1.5))).toFixed(2)); // 거리 계산
            }
        }
        return null;
    };

    useEffect(() => {
        let listener: any;

        const startBeaconDetection = async () => {
            try{
                await requestPermissions(); // 권한 요청
                
                beacons.detectIBeacons();
                
                if (beaconTarget) {
                    await beacons.startRangingBeaconsInRegion(beaconTarget);
                    console.log('Finding Beacons...');
                    listener = (data: any) => {
                        const beacon = data.beacons.find((b: { uuid: string }) => b.uuid === beaconTarget?.uuid);
                        if (beacon) {
                            const rssi = beacon.rssi;
                            console.log(`RSSI: ${rssi}`); // RSSI 로그
                            const filteredRssi = kalmanFilter.update(rssi); // RSSI 값을 칼만 필터로 보정
                            const distance = calculateDistance(filteredRssi); // 보정된 RSSI로 거리 계산
                            
                            console.log(`RSSI: ${rssi}, Filtered RSSI: ${filteredRssi}, Distance: ${distance}`); // 로그 추가
                            setBeaconDistance(distance); // 상태 업데이트
                        }
                    };
    
                    // 비콘 이벤트 리스너 등록
                    beacons.BeaconsEventEmitter.addListener('beaconsDidRange', listener);
                }
            } catch(err){
                console.error(err);
            }
            
        };

        if (modalVisible) {
            startBeaconDetection(); // 모달이 열릴 때 비콘 탐지 시작
        }

        return () => {
            // 모달이 닫힐 때 비콘 탐지 중지 및 리스너 제거
            if (listener) {
                if (beaconTarget) {
                    beacons.stopRangingBeaconsInRegion(beaconTarget);
                }
                beacons.BeaconsEventEmitter.removeAllListeners('beaconsDidRange');
                console.log('Beacon detection stopped');
            }
        };
    }, [modalVisible, beaconId]); // 모달 상태와 beaconId가 변경될 때마다 실행

    return { beaconDistance };
};

export default useBeaconDistance;
