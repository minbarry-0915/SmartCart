import { useState } from "react";

function useGetLocation(){
    const [location, setLocation] = useState<string>('E5-2');
    const [distance, setDistance] = useState<number>(100);
    
    return {
        location,
        distance,
    }
}
export default useGetLocation;