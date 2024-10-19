import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Hello = () => {
  return (
    <div>
      <header>
        {/* Show SignInButton when the user is signed out */}
        <SignedOut>
          {/* Replaced redirectUrl with fallbackRedirectUrl */}
          <SignInButton fallbackRedirectUrl="/chat" />
        </SignedOut>

        {/* Show user-specific content when the user is signed in */}
        <SignedIn>
          <UserButton />
          <p>Welcome back! You are signed in.</p>
        </SignedIn>
      </header>
    </div>
  );
};

export default Hello;
