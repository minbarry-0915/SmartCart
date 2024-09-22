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


const BarcodeScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const [scaned, setScaned] = useState<boolean>(false);
  const [barcodeData, setBarcodeData] = useState<string>('');

  useEffect(() => {
    // 종료후 재시작을 했을때 초기화
    setScaned(false);
  }, []);

  const resetScanner = () => {
    setScaned(true);
  }


  const onBarCodeRead = (event: any) => {
    if (!scaned) return;
    setScaned(false);
    setBarcodeData(event.nativeEvent.codeStringValue);
    onScan(barcodeData);
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
          <Text style={ScannerStyles.ScanRequestButtonText}>바코드</Text>
          <Text style={ScannerStyles.ScanRequestButtonText}>스캔 하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


export default BarcodeScanner;