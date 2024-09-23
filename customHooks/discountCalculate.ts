//할인 계산
interface Prop{
    price: number,
    discount: number | undefined
}

function discountCalculate({price, discount}:Prop){
    if(discount){
        return price - discount;
    }else{
        return price
    }
   
}
export default discountCalculate;