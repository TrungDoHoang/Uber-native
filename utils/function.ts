import { ClerkAPIError } from "@clerk/types";

/**
 * Gets the error message for a specific field from Clerk API errors
 *
 * @param err - Array of Clerk API errors
 * @param field - The field name to find the error for (e.g. 'email', 'password')
 * @param replaceField - Optional. If provided, replaces occurrences of the field name in the error message
 * @returns The error message for the field if found, empty string otherwise
 *
 * @example
 * ```ts
 * const errors = [
 *   {
 *     meta: { paramName: 'email' },
 *     longMessage: 'Email is invalid'
 *   }
 * ];
 *
 * // Get error for email field
 * getErrMgs({ err: errors, field: 'email' }); // Returns: 'Email is invalid'
 *
 * // Get error with replaced field name
 * getErrMgs({ err: errors, field: 'email', replaceField: 'Email Address' });
 * // Returns: 'Email Address is invalid'
 * ```
 */
export const getErrMgs = ({
  err,
  field,
  replaceField,
}: {
  err: ClerkAPIError[];
  field: string;
  replaceField?: string;
}) => {
  const error = err.find((er) => er.meta?.paramName === field);
  return error
    ? replaceField
      ? error.longMessage?.replaceAll(field, replaceField)
      : error.longMessage
    : "";
};

/**
 * Fetches data from an API endpoint and handles the response
 *
 * @param url - The URL to fetch from
 * @param options - Optional RequestInit object containing fetch options like method, headers etc
 * @returns The parsed JSON response from the API
 * @throws Error if the fetch fails or returns a non-200 status code
 *
 * @example
 * ```ts
 * // Basic GET request
 * const data = await fetchApi('https://api.example.com/users');
 *
 * // POST request with options
 * const response = await fetchApi('https://api.example.com/users', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({ name: 'John' })
 * });
 * ```
 */
export const fetchApi = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      new Error(`HTTP error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(
      `[${options?.method ?? "GET"}] Fetch API ${url} error: ${error}`
    );
    throw error;
  }
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}

export function formatTime(minutes: number): string {
  const formattedMinutes = +minutes?.toFixed(0) || 0;

  if (formattedMinutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}
