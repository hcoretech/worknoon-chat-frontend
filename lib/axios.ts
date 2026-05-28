
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  timeout: 12000,
  withCredentials: true, // 🚀 FIX: Must match Express cors { credentials: true } to pass browser preflights
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Prevent execution errors during server-side hydration states
    if (typeof window !== 'undefined') {
      const savedSession = Cookies.get('token');
      
      if (savedSession) {
        let actualJwtToken: string | null = null;

        // Clean string trimming to eliminate raw format configuration anomalies
        const cleanedSession = savedSession.trim();

        if (cleanedSession.startsWith('{') || cleanedSession.startsWith('[')) {
          try {
            // Polymorphic fallback evaluation for structured JSON cookie formats
            const parsedUserData = JSON.parse(cleanedSession);
            actualJwtToken = parsedUserData?.token || parsedUserData?.accessToken || null;
          } catch (e) {
            console.error("🚨 Axios Global Interceptor JSON parse exception:", e);
            // Fallback: If parse fails but string exists, try using raw session data string
            actualJwtToken = cleanedSession;
          }
        } else {
          // Standard flat string layout configuration configuration fallback
          actualJwtToken = cleanedSession;
        }
        
       if (actualJwtToken && config.headers) {
  
           const absoluteToken = actualJwtToken.startsWith('Bearer ') 
             ? actualJwtToken.replace('Bearer ', '').trim() 
              : actualJwtToken.trim();

             config.headers.Authorization = `Bearer ${absoluteToken}`;
             }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Capture authorization faults to prevent app lockup states
    if (error.response?.status === 401) {
      console.warn("🔒 Critical Security Context Exception: Server issued 401 Unauthorized status code.");
      
      // OPTIONAL: Add cleanup steps here if session needs clear-down
      // Cookies.remove('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;







