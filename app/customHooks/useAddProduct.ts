import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";

function useAddProduct(){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { userId } = useSelector((state: RootState) => state.auth);

    const addProduct = async(productId: string, quantity: number) => {
        if(!productId || quantity === 0)
            return;
        try{
            console.log('Trying to add product on cart...');
            setLoading(true);
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/cart/addProduct    `, {
                Userid: userId,
                Product_id: productId,
                Quantity: quantity
            })
            return true;
        } catch(err: any){
            console.error('Failed to add product on cart', err);
            setError(err);
            return false;
        } finally{
            setLoading(false);
            console.log('Done.');
        }
    }

    return {
        loading,
        error,
        addProduct
    }
}
export default useAddProduct;