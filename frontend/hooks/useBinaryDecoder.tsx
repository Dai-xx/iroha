import { useState, useEffect } from "react";

/**
 * Base64エンコードされたデータをデコードするカスタムフック
 * @param encodedData - Base64エンコードされたデータ
 * @returns デコードされたデータ
 */
const useBinaryDecoder = (encodedData: string) => {
  const [decodedData, setDecodedData] = useState<string | ArrayBuffer | null>(
    null,
  );

  useEffect(() => {
    if (encodedData) {
      try {
        // Base64デコード
        const decoded = atob(encodedData);
        // バイナリデータに変換
        const byteArray = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          byteArray[i] = decoded.charCodeAt(i);
        }

        // Uint8ArrayからArrayBufferを取得してsetDecodedDataに渡す
        setDecodedData(byteArray.buffer); // byteArray.buffer を渡す
      } catch (error) {
        console.error("デコードに失敗しました:", error);
        setDecodedData(null);
      }
    }
  }, [encodedData]);

  return decodedData;
};

export default useBinaryDecoder;
