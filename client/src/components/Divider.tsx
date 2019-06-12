import React, { memo } from "react";

export default function Divider() {
  const VerticalBar = memo(() => (
    <div className="bg-clay-400" style={{ width: 1, height: 8 }} />
  ));
  const HorizontalBar = memo(() => (
    <div className="bg-clay-400" style={{ flexGrow: 1, height: 1 }} />
  ));

  return (
    <div className="flex items-center">
      <VerticalBar />
      <HorizontalBar />
      <VerticalBar />
    </div>
  );
}
