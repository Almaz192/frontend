// hooks/useApiRequest.ts
import { useState } from "react";
import axios from "axios";

const API_URL = "https://enetyl-back.onrender.com";

const useApiRequest = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const apiRequest = async (
        method: string,
        endpoint: string,
        requestData?: any
    ) => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                method,
                url: `${API_URL}${endpoint}`,
                headers: { "Content-Type": "application/json" },
                data: requestData,
            };
            const response = await axios(config);
            setData(response.data);
        } catch (err: any) {
            setError(err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    return { apiRequest, loading, data, error };
};

export default useApiRequest;
