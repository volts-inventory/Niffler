import { useState, useEffect } from "react";

export function useGeoPosition() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.loc) {
          const [lat, lng] = data.loc.split(",").map(Number);
          setPos({
            lat,
            lng,
            state: data.region,
            country: data.country,
            city: data.city
          });
        } else {
          setError("Location data not available");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  return { pos, error };
}
