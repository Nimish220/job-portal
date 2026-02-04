import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance"; //  fixed path
import { toast } from "react-toastify";

const recruiterStore = create((set) => ({
  loading: false,
  recruiter: null,

  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/recruiters/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      set({recruiter: response.data.recruiter, loading: false });
      toast.success("Login Successfull");
      return { success: true };
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg);
      set({ loading: false });
    }
  },
  fetchRecruiter: async () => {
  set({ loading: true });   //added fetch for recruiter along with page restrictions
  try {
    const res = await axiosInstance.get("/recruiters/me");
    set({ recruiter: res.data.recruiter, loading: false });
  } catch (err) {
    const status = err.response?.status;
    
    //  PERMANENT FIX: If status is 401 or 403, it just means 
    // this person isn't a recruiter. Don't log it as an error.
    if (status !== 401 && status !== 403) {
      console.error("Unexpected error fetching recruiter:", err);
    }
    set({ recruiter: null, loading: false });
  }
},

 register: async (formData) => {
  set({ loading: true });
  try {
    const response = await axiosInstance.post("/recruiters/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data", //  Explicitly needed here if axiosInstance has a default
      },
    });

    if (response.status === 201) {
      toast.success("Recruiter registered successfully");
      set({recruiter: response.data.recruiter, loading: false });
      return { success: true };
    } else {
      set({ loading: false });
      return { success: false, message: "Unexpected response" };
    }
  } catch (error) {
    set({ loading: false });
    const msg = error?.response?.data?.message || "Server Error";
    toast.error(msg);
    return { success: false, message: msg };
  }
},


  logout: async () => {
    try {
      const response = await axiosInstance.post("/recruiters/logout");
      localStorage.removeItem("token");
      set({ recruiter: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const msg = error.response.data.message || "Logout failed";
      toast.error(msg);
    }
  },

  postJob: async (formData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/recruiters/postJob", formData,{
        withCredentials: true,
      });
      
      set({ loading: false });
      toast.success("Job posted successfully!");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const msg = error.response?.data?.message || "Failed to post job";
      toast.error(msg);
      return { success: false };
    }
  },
}));

export default recruiterStore;
