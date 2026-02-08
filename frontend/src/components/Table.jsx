import React from "react";

export default function Table({ columns, rows, sortBy, sortOrder, onSort }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              onClick={() => (c.sortable ? onSort?.(c.key) : null)}
              style={{ cursor: c.sortable ? "pointer" : "default" }}
            >
              {c.label}
              {c.sortable && sortBy === c.key ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length}>No data</td></tr>
        ) : (
          rows.map((r, idx) => (
            <tr key={r.id || idx}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
