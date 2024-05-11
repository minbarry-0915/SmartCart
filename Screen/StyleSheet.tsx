import { StyleSheet } from "react-native";
import BarcodeScanner from "../Components/BarcodeScanner";

const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    logoContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: 10,
      marginBottom: 30,
    },
    logoText: {
      fontSize: 70,
      fontWeight: 'bold',
      color: 'black',
      paddingVertical: 25,
    },
    loginButton: {
      width: 360,
      height: 50,
      backgroundColor: "#000000",
      padding: 10,
      borderRadius: 10,
      marginBottom: 24,
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    inputText: {
      height: 50,
      width: 360,
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 24,
      borderRadius: 10,
      backgroundColor: '#D9D9D9',
      color: "#696969"
    },
    subButtonGroup:{
      justifyContent: 'center',
      flexDirection: 'row',
    },
    subButton: {
      justifyContent: 'center',
      paddingHorizontal:15,
      height: 30,
      marginHorizontal: 10,
    },
    subButtonText: {
      justifyContent: 'center',
      fontSize: 15,
    },
    HeaderContainer:{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      height: 72,
      backgroundColor: 'white',
      elevation: 10,
      paddingHorizontal: 40,
    },
    HeaderTitleText:{
      fontSize: 40,
      fontWeight: 'bold',
      color: 'black',
    },
    SearchContainer:{
      alignItems: 'center',
      flexDirection: 'row',
    },
    searchInputText:{
      width: 408,
      height: 46,
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: '#D9D9D9',
      paddingHorizontal: 15,
      fontSize: 18,
    },
    SearchButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    MyPageButton: {
      alignItems: 'center',
    },
    BodyContainer:{
      flex:1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical:30,
      paddingHorizontal: 40,
    },
    Scanner:{
      flex: 1,
    },
    BarcodeScannerContainer:{
      flex:1,
      borderWidth: 2,
      borderRadius: 20,  
      justifyContent: 'center',
      marginBottom: 24,
    },
    BacodeScanRequestButton:{
      flex: 1,
      // borderWidth: 2,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor:'white',
    },
    BarcodeScanRequestButtonText:{
      fontSize: 25,
      fontWeight: 'bold',
      color: '#6E91EB',
      lineHeight: 35,
    },
    BuyingListContainer:{
      flex: 0.6,
      paddingHorizontal: 32,
      marginRight: 24,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 20,
      alignItems: 'center'
    },
    BLCHeaderContainer:{
      width: '100%',
    },
    BLCHeader:{
      flexDirection: 'row',
      height: 40,
      alignItems:'center',
      justifyContent: 'space-between',
      marginTop: 36,
    },
    BLCHeaderText: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    BLCHeaderEraseButton:{
      width: 100,
      height: 40,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 10,
      backgroundColor: 'white',
    },
    BLCHeaderEraseButtonText:{
      fontSize: 18,
    },
    Stick:{
      width: '100%',
      height: 2,
      backgroundColor: '#D9D9D9',
      marginTop: 12,
    },
    BLCpNode:{
      width: '100%',
      flexDirection:'row',
      alignItems:'center',
      height: 40,
      //borderWidth: 2,
      marginTop: 12,
    },
    BLCpNodeText:{
      fontSize: 20,
      width: '28%',
      marginRight: 8,
    },
    GrandContainer:{
      flex: 0.6,
      borderWidth:2,
      borderRadius: 20,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: "#FFE68C",
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    GrandTextContainer:{
      width: '100%',
      flexDirection:'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    GrandText:{
      color: 'black',
      fontSize: 25,
      fontWeight: 'bold',
    },
    GrandSubText:{
      color: '#696969',
      fontSize: 20,
      fontWeight: 'regular',
    },
    RecentKeywordContainer:{
      flex: 1,
      //borderWidth: 2,
    },
    RecentKeywordNode:{
      borderWidth: 2,
      borderRadius: 12,
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
      marginBottom: 12, 
      paddingHorizontal: 24,
    },
    RecentKeywordTextContainer:{
      //borderWidth: 2,
      flex: 1,
      
    },
    RecentKeywordText:{
      fontSize: 18,
      marginVertical: 12,
    },
    RecentkeywordDeleteButton: {
      //borderWidth: 2,
      padding: 10,
    },
    

  });

  export default styles;
  