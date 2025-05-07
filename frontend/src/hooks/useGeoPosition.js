import { useEffect, useState } from "react";

export function useGeoPosition() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.loc) {
          const [lat, lng] = data.loc.split(",").map(Number);
          setPos({ lat, lng });
        } else {
          setError("Location data not available");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  return { pos, error };
}
