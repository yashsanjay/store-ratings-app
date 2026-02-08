import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import { validatePassword } from "../utils/validators";

export default function Profile() {
  const { user, reload } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function changePassword(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    const pErr = validatePassword(newPassword);
    if (pErr) return setErr(pErr);

    try {
      await api.changePassword({ currentPassword, newPassword });
      setMsg("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      await reload();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  if (!user) return null;

  return (
    <div className="container">
      <div className="card">
        <h2>Profile</h2>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Address:</b> {user.address}</p>
        <p><b>Role:</b> {user.role}</p>

        <hr />

        <h3>Update Password</h3>
        <form onSubmit={changePassword} className="row">
          <div className="col">
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="col">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          {err && <div className="error">{err}</div>}
          {msg && <div className="success">{msg}</div>}
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}
