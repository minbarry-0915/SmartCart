const formatNumber = (num: number | undefined) => {
    return num?.toLocaleString() || '0';
};
export default formatNumber;