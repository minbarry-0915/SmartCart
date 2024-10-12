import { REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// -- 연결 완
function useDeleteSearchKeyword(){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useSelector((state:RootState)=> state.auth);


    const deleteSearchKeyword = async(keywordId: number) => {
        try{
            setLoading(true);
            console.log('Deleting search keyword...', keywordId);
            const jsonResponse = await axios.delete(`http://${REACT_NATIVE_BACKEND_IP}/api/search/history`,{
                data:{
                    Userid: userId,
                    Keyword_id: keywordId
                }
            });
            return true;
        }catch(err: any){
            setError(err);
            console.error('Failed to delete the keyword:',error);
            return false;
        }finally{
            setLoading(false);
            console.log('Deletion done.');
        }
    }

    return {
        loading,
        error,
        deleteSearchKeyword
    }
}
export default useDeleteSearchKeyword;