"use client";
import CryptoJS from "crypto-js";
export function EncryptData(key: string, data: any) {
  if (process.env.NODE_ENV === "development") {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.NEXT_PUBLIC_LOCALSTORAGE_SECRET_KEY!,
    ).toString();
    localStorage.setItem(key, ciphertext);
  }
}

export function DecryptData(key: string) {
  try {
    if (localStorage.getItem(key)) {
      if (process.env.NODE_ENV === "development") {
        return JSON.parse(localStorage.getItem(key)!);
      } else {
        var bytes = CryptoJS.AES.decrypt(
          localStorage.getItem(key)!,
          process.env.NEXT_PUBLIC_LOCALSTORAGE_SECRET_KEY!,
        );
        var decryptedData = JSON?.parse(bytes?.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      }
    }
  } catch (error) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }
}
