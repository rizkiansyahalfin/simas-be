import xss from "xss"

const xssOptions = {
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
}

export const sanitizeInput = (input: string) => {
  return xss(String(input), xssOptions).trim()
}