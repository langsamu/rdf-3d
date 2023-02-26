# Data policy

The RDF 3D application accesses user data to operate.

The lists below details what user data is used by the application and for what purpose.

The application does not use user data for any other purpose.

## What data is used and why

- WebID URI: Used to read the public WebID profile at the given address.
- Solid OIDC issuer URIs from the profile: Used to redirect the user to an identity provider in order to authenticate them.
- PIM storage URIs from the profile: Used to find the users Solid server root container URI.
- Contained Solid resource URIs from Solid containers: Used to navigate the user's storage so contents of resources can be displayed and manipulated by the application.
- Solid resource contents: Used to display Solid resources to the user.

## How is data used

The application works in users' browsers. All user data the application accesses is stored exclusively in the browser.

User data accessed by the application is exclusively transmitted to 
- the OIDC authorization servers (to authenticated users) and to
- the Solid servers holding users' resources.
