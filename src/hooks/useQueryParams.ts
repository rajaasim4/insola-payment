// hooks/useQueryParams.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { queryParamsAtom } from "../store";

export const useQueryParams = () => {
  const setQueryParams = useSetAtom(queryParamsAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramObj: Record<string, string> = {};

    params.forEach((value, key) => {
      paramObj[key] = value;
    });

    if (Object.keys(paramObj).length) {
      setQueryParams(paramObj);
      localStorage.setItem("query_params", JSON.stringify(paramObj));
    } else {
      // fallback to localStorage if no query params
      const stored = localStorage.getItem("query_params");
      if (stored) setQueryParams(JSON.parse(stored));
    }
  }, [setQueryParams]);
};
