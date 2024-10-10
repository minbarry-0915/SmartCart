//할인 계산
interface Prop{
    price: number,
    discount: number | undefined
    quantity: number 
}

function discountCalculate({price, discount, quantity = 1}:Prop){
    if(discount){
        return price * quantity - discount * quantity;
    }else{
        return price
    }
   
}
export default discountCalculate;