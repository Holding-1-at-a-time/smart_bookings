/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 04:02:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client";

import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);


const ConvexClientProvider = (props: { children: React.ReactNode }) =>
    (
      <React.StrictMode>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {React.Children.toArray(props.children)}
          </ConvexProviderWithClerk>
      </React.StrictMode>
    );
export default ConvexClientProvider;
