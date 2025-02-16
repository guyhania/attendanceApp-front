import apiService from "../services/apiService";

const useApi = () => {
  const getApi = async (url: string) => {
    try {
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching API:", error);
      return null;
    }
  };

  const postApi = async (url: string, data: any) => {
    try {
      const response = await apiService.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      return null;
    }
  };

  const putApi = async (url: string, data: any) => {
    try {
      const response = await apiService.put(url, data);
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return null;
    }
  };
  
  return { getApi, postApi, putApi };
};

export default useApi;
