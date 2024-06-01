import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import styles from "../Screen/StyleSheet";

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
    <View style={styles.BarcodeScannerContainer}>
        {scaned &&(
            <Camera
            style={styles.Scanner}
            cameraType={CameraType.Back} // Front/Back
            scanBarcode={true}
            showFrame={false}
            onReadCode={onBarCodeRead}
          />
        )}
        {!scaned &&(
          <TouchableOpacity onPress={resetScanner} style={styles.BacodeScanRequestButton}>
            <Text style={styles.BarcodeScanRequestButtonText}>바코드</Text>
            <Text style={styles.BarcodeScanRequestButtonText}>스캔 하기</Text>  
          </TouchableOpacity>
        )}     
    </View>
  );
};


export default BarcodeScanner;