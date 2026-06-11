const frontendOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173"

export const securityHeadersConfig = {

  hsts: {
    maxAge:
      31536000,
    includeSubDomains:
      true,
    preload:
      true
  },

  contentSecurityPolicy: {

    useDefaults: true,

    directives: {

      defaultSrc: [
        "'self'"
      ],

      scriptSrc: [
        "'self'"
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'"
      ],

      imgSrc: [
        "'self'",
        "data:",
        "blob:"
      ],

      connectSrc: [
        "'self'",
        frontendOrigin
      ],

      objectSrc: [
        "'none'"
      ],

      frameAncestors: [
        "'none'"
      ],

      baseUri: [
        "'self'"
      ],

      formAction: [
        "'self'"
      ]
    }
  }
}