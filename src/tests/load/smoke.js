import http from "k6/http";

export default function () {
  const res =
    http.get(
      "http://localhost:3000/health"
    )

  console.log(res.status)
}