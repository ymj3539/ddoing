import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInitializer } from "../../util/https";

const axios = axiosInitializer();

// 영상 리스트 GET(수정중)
export const animationListGetAction = createAsyncThunk(
  "GET_ANIMATION_LIST",
  async (_, { rejectWithValue }) => {
    try {
      console.log("in?");
      const { data } = await axios.get(`/api/animations`, {
        params: { id: "userA" },
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      return data;
    } catch (e: any) {
      alert(e.response.data.message);
      return rejectWithValue(e);
    }
  }
);

// 스크립트 GET
export const scriptGetAction = createAsyncThunk(
  "GET_SCRIPT",
  async (animationId: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/animations/script/${animationId}`);
      return data;
    } catch (e: any) {
      alert(e.response.data.message);
      return rejectWithValue(e);
    }
  }
);
