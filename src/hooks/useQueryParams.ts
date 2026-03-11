// hooks/useQueryParams.ts
import { useAtom } from "jotai";
import { useEffect } from "react";
import { queryParamsAtom } from "../store";

export const useQueryParams = () => {
  const [queryParams, setQueryParams] = useAtom(queryParamsAtom);

  useEffect(() => {
    // Parse ALL query params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const params: { [key: string]: string } = {};

    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }

    setQueryParams(params);
  }, []);

  return queryParams;
};
