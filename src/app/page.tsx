export default function HomePage() {
  console.log("Rendered on Server")
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        E-commerce Admin Dashboard : VENDORA
      </h1>
      <p className="mt-4 text-gray-600">
        Server-rendered product management system
      </p>
    </main>
  )
}
