import React from "react";

interface ByteImgProps {
  data: string;
  [key: string]: any;
}

export default function ByteImg({ data, ...props }: ByteImgProps) {
  return <img src={`data:image/png;base64, ${data}`} alt="" {...props} />;
}
