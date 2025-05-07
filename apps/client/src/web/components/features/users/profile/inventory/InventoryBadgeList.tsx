import { Trophy } from "lucide-react"
import { useTranslations } from "next-intl"

import { mockBadges } from "./mock-data"

type Props = {
  inputValue: string
}

const InventoryBadgeList = ({ inputValue }: Props) => {
  const t = useTranslations(
    "Components.Users.Profile.Inventory.InventoryBadgeList"
  )

  const filteredBadges = mockBadges.badges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      badge.description.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className="max-h-[350px] min-h-[300px] space-y-3 overflow-y-auto">
      {filteredBadges.length > 0 ? (
        filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center justify-between rounded-md border p-3 ${!badge.earned ? "opacity-50" : ""}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-full p-2 ${badge.earned ? "bg-accent text-primary" : "bg-primaryBg text-primary/60"}`}
              >
                <Trophy className="size-5" />
              </div>
              <div>
                <h3 className="text-primary font-medium">{badge.name}</h3>
                <p className="text-primary/50 text-sm">{badge.description}</p>
              </div>
            </div>
            <div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${badge.earned ? "bg-success/30 text-success" : "bg-primaryBg text-primary/50"}`}
              >
                {badge.earned ? t("obtained") : t("toUnlock")}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="py-8 text-center text-gray-500">{t("empty")}</div>
      )}
    </div>
  )
}

export default InventoryBadgeList
