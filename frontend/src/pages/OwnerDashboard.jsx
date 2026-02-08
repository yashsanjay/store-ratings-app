import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import Loader from "../components/Loader";
import Table from "../components/Table";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const d = await api.ownerDashboard();
        setData(d);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  if (!data && !err) return <Loader />;

  return (
    <div className="container">
      <div className="card">
        <h2>Owner Dashboard</h2>
        {err && <div className="error">{err}</div>}
        {data && (
          <>
            <p><b>Store:</b> {data.store.name}</p>
            <p><b>Address:</b> {data.store.address}</p>
            <p><b>Average Rating:</b> {data.averageRating ?? "—"}</p>

            <hr />

            <h3>Users who rated your store</h3>
            <Table
              columns={[
                { key: "name", label: "Name", sortable: false },
                { key: "email", label: "Email", sortable: false },
                { key: "rating", label: "Rating", sortable: false },
                { key: "updatedAt", label: "Updated", sortable: false, render: (r) => new Date(r.updatedAt).toLocaleString() }
              ]}
              rows={data.raters}
            />
          </>
        )}
      </div>
    </div>
  );
}
