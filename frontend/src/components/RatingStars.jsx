import React from "react";

export default function RatingStars({ value, onChange }) {
  const v = value || 0;

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1,2,3,4,5].map((x) => (
        <button
          key={x}
          type="button"
          className="secondary"
          style={{
            width: 36,
            padding: "6px 0",
            fontWeight: 700,
            opacity: x <= v ? 1 : 0.5
          }}
          onClick={() => onChange?.(x)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
