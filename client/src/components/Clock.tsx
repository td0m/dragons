import React, { useEffect } from "react";
import { useState } from "@hook-state/core";

export default function Clock() {
  const [bool, setBool] = useState(false);
  const refresh = () => setBool(!bool);

  useEffect(() => {
    setTimeout(refresh, 1000);
  }, [bool]);

  const now = new Date();
  let h = `${now.getHours()}`;
  let m = `${now.getMinutes()}`;
  let s = `${now.getSeconds()}`;
  h = h.length === 1 ? "0" + h : h;
  m = m.length === 1 ? "0" + m : m;
  s = s.length === 1 ? "0" + s : s;

  return (
    <>
      <div className="clock">
        {h}:{m}:{s}
      </div>
    </>
  );
}
