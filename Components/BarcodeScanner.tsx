import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import styles from "../screen/StyleSheet";
import ScannerStyles from "../styles/BarcodeScannerStyles";

const BarcodeScanner = ({onScan} : {onScan: (data: string) => void}) => {
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
    console.log("QR Code", event.nativeEvent.codeStringValue);
    setBarcodeData(event.nativeEvent.codeStringValue);
    onScan(barcodeData);
  };

  return (
    <View style={ScannerStyles.Container}>
        {scaned &&(
          <Camera
            style={ScannerStyles.Camera}
            cameraType={CameraType.Back} // Front/Back
            scanBarcode={true}
            showFrame={false}
            onReadCode={onBarCodeRead}
          />
        )}
        {!scaned &&(
          <TouchableOpacity onPress={resetScanner} style={ScannerStyles.ScanRequestButton}>
            <Text style={ScannerStyles.ScanRequestButtonText}>바코드</Text>
            <Text style={ScannerStyles.ScanRequestButtonText}>스캔 하기</Text>  
          </TouchableOpacity>
        )}     
    </View>
  );
};


export default BarcodeScanner;