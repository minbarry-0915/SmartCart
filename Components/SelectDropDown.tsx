import React from "react";
import { View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Feather from 'react-native-vector-icons/Feather';
import styles from "../Screen/StyleSheet";

type SelectDropDownProps = {
  data: { title: string }[];
  onSelect: (selectedItem: { title: string }, index: number) => void;
  initData: string,
};

const SelectDropDown: React.FC<SelectDropDownProps> = ({ data, onSelect , initData}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      renderButton={(selectedItem, index) => {
        return (
          <View style={styles.DropDownButton}>
            <Text
              style={{
                fontFamily: 'Pretendard-Regular',
                fontSize: 18,
                color: '#696969',
              }}>
              {(selectedItem && selectedItem.title) || initData}
            </Text>
            <View style={{marginLeft: 8}}>
                <Feather 
                name={index ? 'chevron-up' : 'chevron-down'} 
                size={20}
                />
            </View>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View style={{ ...styles.DropDownItem, ...(isSelected && { backgroundColor: '#686868' }) }}>
            <Text
              style={{
                fontFamily: 'Pretendard-Regular',
                fontSize: 18,
                color: '696969',
            }}>
              {item.title}
            </Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.DropdownMenu}
    />
  );
};

export default SelectDropDown;
