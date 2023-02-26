export const Dpop = {
    Header: "DPoP",
}

export const Hydra = {
    Next: "http://www.w3.org/ns/hydra/core#next",
    Previous: "http://www.w3.org/ns/hydra/core#previous"
}

export const HttpHeader = {
    Accept: "Accept",
    Authorization: "Authorization",
    ContentType: "Content-Type",
    Link: "Link",
    Location: "Location",
    Slug: "Slug",
    WwwAuthenticate: "WWW-authenticate",
}

export const HttpMethod = {
    Delete: "DELETE",
    Get: "GET",
    Head: "HEAD",
    Patch: "PATCH",
    Post: "POST",
    Put: "PUT",
}

export const HttpStatus = {
    Unauthorized: 401
}

export const JsonLd = {
    Graph: "@graph",
    Id: "@id",
    Type: "@type",
    Value: "@value"
}

export const Ldp = {
    NS: "http://www.w3.org/ns/ldp#",
    BasicContainer: "http://www.w3.org/ns/ldp#BasicContainer",
    Contains: "http://www.w3.org/ns/ldp#contains",
    NonRdfSource: "http://www.w3.org/ns/ldp#NonRDFSource",
    RdfSource: "http://www.w3.org/ns/ldp#RDFSource",
}

export const Mime = {
    Bmp: "image/bmp",
    Form: "application/x-www-form-urlencoded",
    Ico: "image/vnd.microsoft.icon",
    Gif: "image/gif",
    Html: "text/html",
    Jpeg: "image/jpeg",
    Json: "application/json",
    JsonLd: "application/ld+json",
    Ntriples: "application/n-triples",
    OctetStream: "application/octet-stream",
    Png: "image/png",
    Pdf: "application/pdf",
    RdfXml: "application/rdf+xml",
    SparqlUpdate: "application/sparql-update",
    Svg: "image/svg+xml",
    Text: "text/plain",
    Trig: "application/trig",
    Turtle: "text/turtle",
    Webp: "image/webp",
    Xml: "text/xml",
}

export const Oauth = {
    AccessToken: "access_token",
    ClientId: "client_id",
    GrantType: "grant_type",
    RedirectUri: "redirect_uri",
    RefreshToken: "refresh_token",
    ResponseType: "response_type",
    Scope: "scope",
}

export const OauthMetadata = {
    AuthorizationEndpoint: "authorization_endpoint",
    TokenEndpoint: "token_endpoint",
    RegistrationEndpoint: "registration_endpoint",
}

export const Oidc = {
    AuthorizationCode: "authorization_code",
    Code: "code",
    Consent: "consent",
    Discovery: ".well-known/openid-configuration",
    IdToken: "id_token",
    OfflineAccess: "offline_access",
    Prompt: "prompt",
    Scope: "openid",
}

export const OidcRegistration = {
    ClientName: "client_name",
    ClientSecretExpiresAt: "client_secret_expires_at",
    ClientUri: "client_uri",
    GrantTypes: "grant_types",
    LogoUri: "logo_uri",
    RedirectUris: "redirect_uris",
    PolicyUri: "policy_uri",
}

export const Pim = {
    Storage: "http://www.w3.org/ns/pim/space#storage"
}

export const Pkce = {
    CodeChallenge: "code_challenge",
    CodeChallengeMethod: "code_challenge_method",
    CodeVerifier: "code_verifier"
}

export const Rdf = {
    NS: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    Type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    BlankNodePrefix: "_"
}

export const Solid = {
    WebIdScope: "webid",
    OidcIssuer: "http://www.w3.org/ns/solid/terms#oidcIssuer",
    AclLinkHeaderParser: /[^<]+(?=>; rel="acl")/,
}

export const Uma = {
    ClaimToken: "claim_token",
    ClaimTokenFormat: "claim_token_format",
    Discovery: "/.well-known/uma2-configuration",
    IdToken: "http://openid.net/specs/openid-connect-core-1_0.html#IDToken",
    Ticket: "ticket",
    TicketParser: /as_uri="([^"]+)", ticket="([^"]+)"/,
    TicketGrant: "urn:ietf:params:oauth:grant-type:uma-ticket"
}
