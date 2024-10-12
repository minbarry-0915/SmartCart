import { useCallback, useEffect, useState } from "react";
import { Location } from "../types";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";

// -- 연결 완
function useGetLocation(Location_id: number){
    const [locationInfo, setLocationInfo] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLocationInfo = useCallback(async()=>{
        try{
            setLoading(true);
            setError(null);
            console.log('Fetching Location Info...');
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/locations/${Location_id}`);
            setLocationInfo(jsonResponse.data);
        }catch(err: any){
            console.log('Fail to get Location Info: ', err);
            setError(err);
        }finally{
            setLoading(false);
            console.log('Done.');
        }
    },[Location_id]);

    useEffect(() => {
        getLocationInfo();
    },[getLocationInfo]);


    return {
        locationInfo
    }
}
export default useGetLocation;