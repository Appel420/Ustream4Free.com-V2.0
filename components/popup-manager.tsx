"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PopupWindow } from "./popup-window"
import { Plus } from "lucide-react"

export function PopupManager() {
  const [popups, setPopups] = useState<
    Array<{
      id: string
      title: string
      content: string
      position: { x: number; y: number }
    }>
  >([
    {
      id: "1",
      title: "Welcome to Popup Manager",
      content:
        "This is a draggable and resizable popup window. Try moving it around or resizing from the bottom-right corner.",
      position: { x: 100, y: 100 },
    },
  ])

  const addPopup = () => {
    const newId = String(Date.now())
    setPopups([
      ...popups,
      {
        id: newId,
        title: `Popup Window ${popups.length + 1}`,
        content: `This is popup window #${popups.length + 1}. You can close it using the X button.`,
        position: { x: 150 + popups.length * 30, y: 150 + popups.length * 30 },
      },
    ])
  }

  const closePopup = (id: string) => {
    setPopups(popups.filter((popup) => popup.id !== id))
  }

  return (
    <div className="p-4">
      <Button onClick={addPopup} className="mb-4 bg-purple-600 hover:bg-purple-700">
        <Plus className="h-4 w-4 mr-2" />
        Create New Popup
      </Button>

      {popups.map((popup) => (
        <PopupWindow
          key={popup.id}
          title={popup.title}
          defaultPosition={popup.position}
          onClose={() => closePopup(popup.id)}
        >
          <div className="space-y-4">
            <p className="text-white">{popup.content}</p>
            <div className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-sm font-medium text-white mb-2">Popup Features:</h3>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                <li>Drag from the header to move</li>
                <li>Resize from the bottom-right corner</li>
                <li>Minimize/Maximize buttons</li>
                <li>Close button</li>
              </ul>
            </div>
          </div>
        </PopupWindow>
      ))}
    </div>
  )
}
