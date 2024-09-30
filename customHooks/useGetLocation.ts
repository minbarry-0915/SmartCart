import { useCallback, useEffect, useState } from "react";
import { Location } from "../types";

function useGetLocation(){
    const [locationInfo, setLocationInfo] = useState<Location | null>(null);

    const getLocationInfo = useCallback(async()=>{
        const jsonResponse = {
            data:{
                Location_id : 111,
                Location_name: '여기다호호호',
                Beacon_id: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0'
            }
        }

        setLocationInfo(jsonResponse.data);
    },[]);

    useEffect(() => {
        getLocationInfo();
    },[getLocationInfo]);


    return {
        locationInfo
    }
}
export default useGetLocation;