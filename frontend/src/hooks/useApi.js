// src/hooks/useApi.js
import { useReducer, useCallback } from "react";
import { postJSON } from "../utils/api";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

function apiReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...initialState, loading: true };
    case "FETCH_SUCCESS":
      return { ...initialState, data: action.payload };
    case "FETCH_ERROR":
      return { ...initialState, error: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function useApi(endpoint) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  const execute = useCallback(
    async (body) => {
      dispatch({ type: "FETCH_START" });
      try {
        const result = await postJSON(endpoint, body);
        dispatch({ type: "FETCH_SUCCESS", payload: result });
        return result;
      } catch (e) {
        dispatch({ type: "FETCH_ERROR", payload: e });
        return null;
      }
    },
    [endpoint]
  );

  return { ...state, execute };
}
