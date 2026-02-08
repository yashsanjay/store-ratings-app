import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { validateAddress, validateEmail, validateName, validatePassword } from "../utils/validators";

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [err, setErr] = useState("");

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const nErr = validateName(form.name);
    if (nErr) return setErr(nErr);
    if (!validateEmail(form.email)) return setErr("Invalid email");
    const aErr = validateAddress(form.address);
    if (aErr) return setErr(aErr);
    const pErr = validatePassword(form.password);
    if (pErr) return setErr(pErr);

    try {
      await register(form);
      nav("/stores");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2>Signup (Normal User)</h2>
        <form onSubmit={onSubmit} className="row">
          <div className="col">
            <label>Name (20-60 chars)</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="col">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setField("email", e.target.value)} />
          </div>
          <div className="col">
            <label>Address (max 400)</label>
            <textarea value={form.address} onChange={(e) => setField("address", e.target.value)} />
          </div>
          <div className="col">
            <label>Password (8-16, 1 uppercase, 1 special)</label>
            <input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} />
          </div>

          {err && <div className="error">{err}</div>}
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}
