import { create } from 'zustand';
import { axiosInstance } from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import { getCookie } from '../utils/getCookie';
import recruiterStore from './recruiterStore';
const useUserStore = create((set, get) => {
  const store = {
    loading: false,
    jobs: [],
    appliedJobs: [],
    appliedInternships: [],
    user: null,
    fetchedUser: false,

    fetchUser: async () => {
  try {
    //console.log('Calling /users/me...');
    const response = await axiosInstance.get('/users/me');
    const fetchedUser = response.data.user;
    //console.log('Fetched user:', fetchedUser);
    set({ user: fetchedUser, fetchedUser: true });
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status !== 401 && status !== 403) {
      console.error('Unexpected error fetching user:', message);
    }
    
    set({ user: null, fetchedUser: true });
  }
},



    login: async ({ email, password }) => {

      set({ loading: true });
      try {
        const response = await axiosInstance.post('/users/login', { email, password });
        toast.success('Login Successful');
        recruiterStore.setState({ recruiter: null });
        localStorage.setItem("token", response.data.token);
        set({ user: response.data.user, loading: false });
        return { success: true };
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || 'Login failed';
          if (import.meta.env.MODE === 'development') {
            if (status === 401) {
              console.warn(" Login 401: Invalid credentials or expired session.");
            } else if (status === 403) {
              console.warn(" Login 403: Access denied for this role.");
            } else if(status === 404){
              console.warn(" Login 404: User not found.");
            }else {
              console.error(` Login Error (${status}):`, message);
            }
          }
        toast.error(message);
        set({ loading: false });
        return { success: false, message };
      }
    },

    register: async ({ name, email, password }) => {
      set({ loading: true });
      try {
        const response = await axiosInstance.post('/users/register', {
          name,
          email,
          password,
        });
        toast.success('Registration Successful');
        set({ loading: false });
        return { success: true };
      } catch (error) {
        const msg = error?.response?.data?.message || 'Registration Failed';
        set({ loading: false });
        toast.error(msg);
        return { success: false };
      }
    },

    logout: async () => {
      set({ loading: true });
      try {
        await axiosInstance.post('/users/logout');
        localStorage.removeItem("token");
        set({ user: null, loading: false });
        toast.success('Logged out successfully');
        return { success: true };
      } catch (error) {
        const message = error?.response?.data?.message || 'Logout failed';
        toast.error(message);
        set({ loading: false });
        return { success: false };
      }
    },

    // getJobs: async () => {
    //   set({ loading: true });
    //   try {
    //     const response = await axiosInstance.get('/users/getJobs');
    //     set({ jobs: response.data.jobs, loading: false });
    //     return { success: true };
    //   } catch (error) {
    //     const msg = error?.response?.data?.message || 'Failed to fetch jobs';
    //     toast.error(msg);
    //     set({ jobs: [], loading: false });
    //     return { success: false, error: msg };
    //   }
    // },

    getJobs: async () => {
  set({ loading: true });
  try {
    const response = await axiosInstance.get('/users/getJobs');
    // Handle backend returning array directly
    const jobs = Array.isArray(response.data) ? response.data : response.data.jobs;
    set({ jobs, loading: false });
    return { success: true, data: jobs }; // include data so JobCards can check
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to fetch jobs';
    toast.error(msg);
    set({ jobs: [], loading: false });
    return { success: false, error: msg };
  }
},
    applyJob: async (jobId) => {
      try {
        const response = await axiosInstance.put('/users/applyJob', { jobId });
        toast.success(response.data.message);
        set({ loading: false });
      } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to apply';
        toast.error(msg);
      }
    },

    getAppliedJobs: async () => {
      try {
        const response = await axiosInstance.get('/users/getAppliedJobs');
        set({ appliedJobs: response.data.appliedJobs || [],appliedInternships: response.data.appliedInternships || [], loading: false });
      } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to fetch applied jobs';
        toast.error(msg);
      }
    },
  };

  //  Call fetchUser AFTER store has been created
  // setTimeout(() => {
  //   get().fetchUser();
  // }, 0);

  return store;
});

export default useUserStore;
