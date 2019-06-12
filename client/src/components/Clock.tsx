import React, { useEffect, useCallback } from "react";
import { useState } from "@hook-state/core";

export default function Clock() {
  const [bool, setBool] = useState(false);
  const refresh = useCallback(() => setBool(!bool), [bool]);

  useEffect(() => {
    setTimeout(refresh, 1000);
  }, [refresh]);

  const now = new Date();
  let h = `${now.getHours()}`;
  let m = `${now.getMinutes()}`;
  let s = `${now.getSeconds()}`;
  h = h.length === 1 ? "0" + h : h;
  m = m.length === 1 ? "0" + m : m;
  s = s.length === 1 ? "0" + s : s;

  return (
    <>
      <div className="flex justify-center select-none text-4xl">
        {h}:{m}:{s}
      </div>
    </>
  );
}
