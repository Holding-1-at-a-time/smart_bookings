/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 03:53:49
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
const authConfig = {
  providers: [
    {
      //   // Replace with your own Clerk Issuer URL from your "convex" JWT template
      //   // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
      //   // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
      //   // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
