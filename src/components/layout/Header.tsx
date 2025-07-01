import { StatusIndicator } from "../StatusIndicator";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">RELEVO</h1>
          <p className="text-sm text-gray-600">
            Pediatric ICU • Children&apos;s Hospital
          </p>
        </div>

        <div className="flex items-center gap-4">
          <StatusIndicator count={3} label="Pending" color="yellow" />
          <StatusIndicator count={3} label="Active" color="green" />
          <StatusIndicator count={3} label="New Info" color="red" />
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
            CM
          </div>
        </div>
      </div>
    </header>
  );
}
