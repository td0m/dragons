import createContainer, { useState } from "@hook-state/core";
import ExecResponse from "models/ExecResponse";

const useStdout = () => {
  const [value, set] = useState<ExecResponse[]>([]);

  const add = (item: ExecResponse) => set([...value, item]);

  return {
    value,
    set,
    add
  };
};

export default createContainer(useStdout);
