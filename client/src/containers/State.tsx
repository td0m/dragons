import createContainer, { useState } from "@hook-state/core";

const useDragonsState = () => {
  const [targets, setTargets] = useState([]);
  const [connected, setConnected] = useState(false);
  const [targetConnected, setTargetConnected] = useState(false);

  return {
    targets,
    setTargets,

    connected,
    setConnected,

    targetConnected,
    setTargetConnected
  };
};

export default createContainer(useDragonsState);
