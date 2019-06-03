export const downloadBytes = (data: Uint8Array[], name: string) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const blob = new Blob(data, { type: "octet/stream" });
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export const base64ToBytes = (base64: string) => {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
};
