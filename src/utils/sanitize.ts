import xss from "xss"

export const sanitizeInput = (input: string) => {
  return xss(input)
}