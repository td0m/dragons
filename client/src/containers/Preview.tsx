import createContainer from "@hook-state/core";
import { useState } from "react";

const usePreview = () => {
  const [content, setContent] = useState<any>(null);

  return { content, setContent };
};

export default createContainer(usePreview);
