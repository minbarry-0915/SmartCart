import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import ScannerStyles from "../styles/BarcodeScannerStyles";
import { CancelIcon } from '../assets/icons';
import Barcode from "./animations/barcode";
import AnimationStyles from "../styles/AnimationStyles";
import { useIsFocused } from '@react-navigation/native'; // 추가된 import

const BarcodeScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const [scaned, setScaned] = useState<boolean>(false);
  const [barcodeData, setBarcodeData] = useState<string>('');
  const isFocused = useIsFocused(); // 화면 포커스 상태 확인

  useEffect(() => {
    // 종료후 재시작을 했을때 초기화
    setScaned(false);
  }, []);

  useEffect(() => {
    // 화면이 블러일 때 카메라를 끄기
    if (!isFocused) {
      setScaned(false);
    }
  }, [isFocused]); // 화면 포커스 상태가 변할 때마다 실행

  const resetScanner = () => {
    setScaned(true);
  }

  const onBarCodeRead = (event: any) => {
    if (!scaned) return;
    setScaned(false);
    setBarcodeData(event.nativeEvent.codeStringValue);
    onScan(event.nativeEvent.codeStringValue); // 수정된 부분
  };

  return (
    <View style={ScannerStyles.Container}>
      {scaned && (
        <View>
          <Camera
            style={ScannerStyles.Camera}
            cameraType={CameraType.Back} // Front/Back
            scanBarcode={true}
            showFrame={false}
            onReadCode={onBarCodeRead}
          />
          <TouchableOpacity
            onPress={() => setScaned(false)}
            style={ScannerStyles.ScanCancelButton}
          >
            <CancelIcon width={40} height={40} />
          </TouchableOpacity>
        </View>

      )}
      {!scaned && (
        <TouchableOpacity
          onPress={resetScanner}
          style={ScannerStyles.ScanRequestButton}>
          <Barcode style={AnimationStyles.barcode} />
          <Text style={ScannerStyles.ScanRequestButtonText}>BARCODE SCAN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BarcodeScanner;
