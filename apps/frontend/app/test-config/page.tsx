"use client";

import { useEffect, useState } from "react";
import {
  stellarNetwork,
  horizonUrl,
  apiBaseUrlBackend,
  apiBaseUrlFrontend,
  stellarNetworkPassphrase,
} from "@/lib/config";

export default function TestConfig() {
  const [backendConfig, setBackendConfig] = useState<Record<
    string,
    string
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBaseUrlBackend}/config`)
      .then((res) => res.json())
      .then((data) => {
        setBackendConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch backend config:", err);
        setError("Failed to load backend configuration");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Environment Configuration Test
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Frontend Config</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(
            {
              stellarNetwork,
              horizonUrl,
              apiBaseUrlBackend,
              apiBaseUrlFrontend,
              stellarNetworkPassphrase,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Backend Config</h2>
        {loading && <p>Loading backend configuration...</p>}+{" "}
        {error && <p className="text-red-500">{error}</p>}
        <pre className="bg-gray-100 p-4 rounded">
          {backendConfig ? JSON.stringify(backendConfig, null, 2) : null}
        </pre>
      </div>
    </div>
  );
}
