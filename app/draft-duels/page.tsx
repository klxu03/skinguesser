import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkinDraftDuels from "../../skin-draft-duels"

export default function DraftDuelsPage() {
  return (
    <div>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" className="bg-white/90 hover:bg-white">
            ← Back to Home
          </Button>
        </Link>
      </div>
      <SkinDraftDuels />
    </div>
  )
} 