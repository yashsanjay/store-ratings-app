import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import RatingStars from "../components/RatingStars";
import Loader from "../components/Loader";

export default function Stores() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await api.listStores({ q, sortBy, sortOrder }, true);
      setStores(data.stores);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submitRating(storeId, value) {
    setErr("");
    try {
      await api.rateStore(storeId, value);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="card">
        <h2>Stores</h2>

        <div className="row" style={{ marginBottom: 12 }}>
          <div className="col">
            <label>Search by Name/Address</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="col">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="address">Address</option>
              <option value="createdAt">Created</option>
            </select>
          </div>
          <div className="col">
            <label>Sort Order</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
          <div className="col" style={{ alignSelf: "flex-end" }}>
            <button onClick={load}>Apply</button>
          </div>
        </div>

        {err && <div className="error">{err}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.overallRating ?? "—"}</td>
                <td>{s.myRating ?? "—"}</td>
                <td>
                  {user?.role === "NORMAL_USER" ? (
                    <RatingStars value={s.myRating} onChange={(v) => submitRating(s.id, v)} />
                  ) : (
                    <span style={{ fontSize: 13 }}>Login as Normal User to rate</span>
                  )}
                </td>
              </tr>
            ))}
            {stores.length === 0 && <tr><td colSpan={5}>No stores found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
