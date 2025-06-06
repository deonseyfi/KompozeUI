
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export interface UserSentiment {
    data: Object | null;        
}

interface State {
  data: UserSentiment | null;
  loading: boolean;
  error: string | null;
}

/**
 * React hook to fetch user‑sentiment from `http://localhost:8000/usersentiment:<username>`
 */
export const useUserSentiment = (username: string) => {
  const [state, setState] = useState<State>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!username) return;     // guard against empty calls

    const auth = getAuth()
    const token = auth.currentUser?.getIdToken();
    const controller = new AbortController();
    const fetchData = async () => {
      setState(s => ({ ...s, loading: true, error: null }));

      try {
        const url = `http://localhost:8001/usersentiment/${encodeURIComponent(
          username
        )}`;
        const res = await fetch(url, { signal: controller.signal,   headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }});

        if (!res.ok) {
          throw new Error(`API responded with ${res.status}`);
        }

        const json: UserSentiment = await res.json();
        setState({ data: json, loading: false, error: null });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // request was cancelled
        setState({ data: null, loading: false, error: (err as Error).message });
      }
    };

    fetchData();
    return () => controller.abort(); // cleanup on unmount or username change
  }, [username]);

  return state; // { data, loading, error }
};
