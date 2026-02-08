import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import Table from "../components/Table";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [err, setErr] = useState("");

  const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "", sortBy: "name", sortOrder: "asc" });
  const [storeFilters, setStoreFilters] = useState({ name: "", email: "", address: "", sortBy: "name", sortOrder: "asc" });

  const [newUser, setNewUser] = useState({ name: "", email: "", address: "", password: "", role: "NORMAL_USER" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", ownerId: "" });

  async function loadAll() {
    setErr("");
    try {
      const [d, u, s] = await Promise.all([
        api.adminDashboard(),
        api.adminListUsers(cleanParams(userFilters)),
        api.adminListStores(cleanParams(storeFilters))
      ]);
      setStats(d);
      setUsers(u.users);
      setStores(s.stores);
    } catch (e) {
      setErr(e.message);
    }
  }

  function cleanParams(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== "" && v !== undefined) out[k] = v;
    }
    return out;
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createUser(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.adminCreateUser(newUser);
      setNewUser({ name: "", email: "", address: "", password: "", role: "NORMAL_USER" });
      await loadAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function createStore(e) {
    e.preventDefault();
    setErr("");
    try {
      const payload = { ...newStore };
      if (!payload.ownerId) delete payload.ownerId;
      await api.adminCreateStore(payload);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      await loadAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  if (!stats) return <Loader />;

  const userCols = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    { key: "role", label: "Role", sortable: true }
  ];

  const storeCols = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    { key: "rating", label: "Rating", sortable: false, render: (r) => r.rating ?? "—" }
  ];

  function toggleSort(currentBy, currentOrder, key) {
    if (currentBy !== key) return { sortBy: key, sortOrder: "asc" };
    return { sortBy: key, sortOrder: currentOrder === "asc" ? "desc" : "asc" };
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>

        <div className="row">
          <div className="col card">
            <h3>Total Users</h3>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.users}</div>
          </div>
          <div className="col card">
            <h3>Total Stores</h3>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.stores}</div>
          </div>
          <div className="col card">
            <h3>Total Ratings</h3>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.ratings}</div>
          </div>
        </div>

        {err && <div className="error" style={{ marginTop: 10 }}>{err}</div>}

        <hr />

        <div className="row">
          <div className="col card">
            <h3>Add User</h3>
            <form onSubmit={createUser} className="row">
              <div className="col">
                <label>Name (20-60)</label>
                <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div className="col">
                <label>Email</label>
                <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div className="col">
                <label>Address</label>
                <textarea value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
              </div>
              <div className="col">
                <label>Password</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="col">
                <label>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <button type="submit">Create User</button>
            </form>
          </div>

          <div className="col card">
            <h3>Add Store</h3>
            <form onSubmit={createStore} className="row">
              <div className="col">
                <label>Store Name</label>
                <input value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
              </div>
              <div className="col">
                <label>Email</label>
                <input value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} />
              </div>
              <div className="col">
                <label>Address</label>
                <textarea value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
              </div>
              <div className="col">
                <label>Owner ID (optional)</label>
                <input value={newStore.ownerId} onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })} />
              </div>
              <button type="submit">Create Store</button>
            </form>
          </div>
        </div>

        <hr />

        <h3>Users</h3>
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="col"><input placeholder="Name filter" value={userFilters.name} onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} /></div>
          <div className="col"><input placeholder="Email filter" value={userFilters.email} onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} /></div>
          <div className="col"><input placeholder="Address filter" value={userFilters.address} onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })} /></div>
          <div className="col">
            <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div className="col" style={{ alignSelf: "flex-end" }}>
            <button onClick={async () => {
              const u = await api.adminListUsers(cleanParams(userFilters));
              setUsers(u.users);
            }}>Apply</button>
          </div>
        </div>

        <Table
          columns={userCols}
          rows={users}
          sortBy={userFilters.sortBy}
          sortOrder={userFilters.sortOrder}
          onSort={async (key) => {
            const next = toggleSort(userFilters.sortBy, userFilters.sortOrder, key);
            const merged = { ...userFilters, ...next };
            setUserFilters(merged);
            const u = await api.adminListUsers(cleanParams(merged));
            setUsers(u.users);
          }}
        />

        <hr />

        <h3>Stores</h3>
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="col"><input placeholder="Name filter" value={storeFilters.name} onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} /></div>
          <div className="col"><input placeholder="Email filter" value={storeFilters.email} onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })} /></div>
          <div className="col"><input placeholder="Address filter" value={storeFilters.address} onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} /></div>
          <div className="col" style={{ alignSelf: "flex-end" }}>
            <button onClick={async () => {
              const s = await api.adminListStores(cleanParams(storeFilters));
              setStores(s.stores);
            }}>Apply</button>
          </div>
        </div>

        <Table
          columns={storeCols}
          rows={stores}
          sortBy={storeFilters.sortBy}
          sortOrder={storeFilters.sortOrder}
          onSort={async (key) => {
            const next = toggleSort(storeFilters.sortBy, storeFilters.sortOrder, key);
            const merged = { ...storeFilters, ...next };
            setStoreFilters(merged);
            const s = await api.adminListStores(cleanParams(merged));
            setStores(s.stores);
          }}
        />
      </div>
    </div>
  );
}
