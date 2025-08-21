interface StatusProps {
  session: any;
  loading: boolean;
}
export function Status({ session, loading }: StatusProps) {
  console.log(loading);
  if (loading)
    return (
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>Current Session:</h3>
        <p>
          <strong>ID Token:</strong> ...
        </p>
        <p>
          <strong>Access Token:</strong> ...
        </p>
      </div>
    );
  return session ? (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      <h3>Current Session:</h3>
      <p>
        <strong>ID Token:</strong> {session.idToken} (Expires:
        {session.idTokenExpiry})
      </p>
      <p>
        <strong>Access Token:</strong> {session.accessToken} (Expires:{" "}
        {session.accessTokenExpiry})
      </p>
    </div>
  ) : (
    <div
      style={{
        backgroundColor: "#ffe6e6",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      <h3>No Session Found</h3>
      <p>Either not signed in or tokens have expired and refresh failed</p>
    </div>
  );
}
