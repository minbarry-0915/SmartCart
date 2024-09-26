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

const useBeaconDistance = (beaconId: string, txPower: number) => {
    const [beaconDistance, setBeaconDistance] = useState<number | null>(null);
    const kalmanFilter = new KalmanFilter(); // 칼만 필터 인스턴스

    const beaconTarget: BeaconRegion = {
        identifier: "test",
        uuid: beaconId, // 비콘 ID를 props로 받음
    };

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
                return Math.pow(10, (txPower - rssi) / (10 * 2)); // 거리 계산
            } else {
                return 0.89976 * Math.pow(10, (txPower - rssi) / (10 * 1.5)); // 거리 계산
            }
        }
        return null;
    };

    useEffect(() => {
        const startBeaconDetection = async () => {
            await requestPermissions(); // 권한 요청
            beacons.detectIBeacons();
            await beacons.startRangingBeaconsInRegion(beaconTarget);

            const listener = (data: any) => {
                const beacon = data.beacons.find((b: { uuid: string }) => b.uuid === beaconTarget.uuid);
                if (beacon) {
                    const rssi = beacon.rssi;
                    console.log(`RSSI: ${rssi}`); // RSSI 로그
                    const filteredRssi = kalmanFilter.update(rssi); // RSSI 값을 칼만 필터로 보정
                    const distance = calculateDistance(filteredRssi); // 보정된 RSSI로 거리 계산
                    console.log(`RSSI: ${rssi}, Filtered RSSI: ${filteredRssi}, Distance: ${distance}`); // 로그 추가
                    setBeaconDistance(distance); // 상태 업데이트
                } else {
                    //console.log("비콘을 찾을 수 없습니다.");
                }
            };

            // 비콘 이벤트 리스너 등록
            beacons.BeaconsEventEmitter.addListener('beaconsDidRange', listener);

            // Cleanup on unmount
            return () => {
                beacons.stopRangingBeaconsInRegion(beaconTarget);
                beacons.BeaconsEventEmitter.removeAllListeners('beaconsDidRange');
                beacons.stop();
            };
        };

        startBeaconDetection();
    }, []); // 빈 배열을 넣어 한 번만 실행

    return { beaconDistance };
};

export default useBeaconDistance;
