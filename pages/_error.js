// pages/_error.js
import { useEffect } from "react";
import { useRouter } from "next/router";

function Error({}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page
    router.push("/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to home page...</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
