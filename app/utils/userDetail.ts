export const getUserDetail = () => {
  return JSON.parse(localStorage.getItem("user") || "null");
}