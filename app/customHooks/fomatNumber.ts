//금액 표기 변환용 커스텀 함수
const formatNumber = (num: number | undefined) => {
    return num?.toLocaleString() || '0';
};
export default formatNumber;