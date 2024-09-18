
import Link from "next/link"

export function Portfolio() {
  return (

    
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="text-lg font-bold" prefetch={false}>
            Dashboard
          </Link>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="#" className="hover:underline" prefetch={false}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline" prefetch={false}>
                  Shares
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline" prefetch={false}>
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline" prefetch={false}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Share Holdings</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Account</th>
                  <th className="px-4 py-3 text-right font-medium">Shares</th>
                  <th className="px-4 py-3 text-right font-medium">Current Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">Apple Inc.</td>
                  <td className="px-4 py-3">Brokerage Account</td>
                  <td className="px-4 py-3 text-right">100</td>
                  <td className="px-4 py-3 text-right">$12,500.00</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Microsoft Corporation</td>
                  <td className="px-4 py-3">Retirement Account</td>
                  <td className="px-4 py-3 text-right">50</td>
                  <td className="px-4 py-3 text-right">$7,500.00</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Amazon.com, Inc.</td>
                  <td className="px-4 py-3">Brokerage Account</td>
                  <td className="px-4 py-3 text-right">25</td>
                  <td className="px-4 py-3 text-right">$5,000.00</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Tesla, Inc.</td>
                  <td className="px-4 py-3">Retirement Account</td>
                  <td className="px-4 py-3 text-right">15</td>
                  <td className="px-4 py-3 text-right">$3,750.00</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Alphabet Inc. (Google)</td>
                  <td className="px-4 py-3">Brokerage Account</td>
                  <td className="px-4 py-3 text-right">20</td>
                  <td className="px-4 py-3 text-right">$4,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Total Investment</h2>
            <p className="text-4xl font-bold">$32,750.00</p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 py-4 px-6 text-center text-muted-foreground">
        <p>&copy; 2023 Your Dashboard. All rights reserved.</p>
      </footer>
    </div>
  )
}
