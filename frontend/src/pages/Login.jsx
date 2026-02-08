import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(email, password);
      if (u.role === "SYSTEM_ADMIN") nav("/admin");
      else if (u.role === "STORE_OWNER") nav("/owner");
      else nav("/stores");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="row">
          <div className="col">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="col">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div className="error">{err}</div>}
          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: 12, fontSize: 13 }}>
          Demo admin: admin@demo.com / Admin@123<br/>
          Demo owner: owner@demo.com / Owner@123
        </p>
      </div>
    </div>
  );
}
