export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Vendor Portfolios</h1>
        <p className="text-lg text-muted-foreground">
          Please visit a specific vendor portfolio using their unique URL.
        </p>
        <p className="text-sm text-muted-foreground">
          Example: /vendor-name
        </p>
      </div>
    </div>
  );
}
