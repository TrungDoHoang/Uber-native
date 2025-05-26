import { useCallback, useEffect, useState } from "react";
import { fetchApi } from "./function";

/**
 * Custom hook for making API requests and managing loading/error states
 *
 * @template T - The expected type of the response data
 * @param url - The URL to fetch from
 * @param options - Optional RequestInit object containing fetch options
 * @returns Object containing:
 *  - data: The fetched data of type T or null
 *  - loading: Boolean indicating if request is in progress
 *  - errors: Error message string or null
 *
 * @example
 * ```ts
 * // Basic GET request
 * const { data, loading, errors } = useFetch<User[]>('https://api.example.com/users');
 *
 * // POST request with options
 * const { data, loading, errors } = useFetch<Response>('https://api.example.com/users', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({ name: 'John' })
 * });
 * ```
 */
export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors(null);

    try {
      const result = await fetchApi(url, options);
      setData(result.data);
    } catch (error) {
      setErrors((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, errors };
};
