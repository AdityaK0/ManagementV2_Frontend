export default function Home() {
  console.log("Home",process.env.NEXT_PUBLIC_API_URL_FASTAPI);
  console.log("Home ..............................");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Vendor Portfolios</h1>
        <p className="text-lg text-muted-foreground">
          Please visit a specific vendor portfolio using their unique URL.
        </p>
        <p className="text-sm text-muted-foreground">
          
        </p>
      </div>
    </div>
  );
}
