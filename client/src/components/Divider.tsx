import React, { memo } from "react";

export default function Divider() {
  const bg = "var(--theme-border)";
  const VerticalBar = memo(() => (
    <div style={{ width: 1, height: 8, background: bg }} />
  ));
  const HorizontalBar = memo(() => (
    <div style={{ flexGrow: 1, height: 1, background: bg }} />
  ));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <VerticalBar />
      <HorizontalBar />
      <VerticalBar />
    </div>
  );
}
