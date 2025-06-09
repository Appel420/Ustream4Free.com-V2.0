import { PopupManager } from "@/components/popup-manager"

export default function PopupDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Popup Window Demo</h1>
      <p className="mb-6">This demo shows how to use the PopupWindow component in your streaming application.</p>

      <PopupManager />
    </div>
  )
}
