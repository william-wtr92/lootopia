import { artifactRarity, type ArtifactRarity } from "@lootopia/common"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  cn,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"

type Props = {
  selectedRarity: ArtifactRarity | "all"
  setSelectedRarity: (rarity: ArtifactRarity | "all") => void
  className?: string
}

const SelectArtifactRarity = ({
  selectedRarity,
  setSelectedRarity,
  className,
}: Props) => {
  const t = useTranslations("Components.Artifacts.Utils.SelectArtifactRarity")

  return (
    <Select value={selectedRarity} onValueChange={setSelectedRarity}>
      <SelectTrigger
        className={cn("border-primary/30 text-primary w-full", className)}
      >
        <SelectValue placeholder={t("trigger")} />
      </SelectTrigger>
      <SelectContent className="bg-primaryBg text-primary">
        <SelectItem value="all">{t("options.all")}</SelectItem>
        <SelectItem value={artifactRarity.common}>
          {t("options.common")}
        </SelectItem>
        <SelectItem value={artifactRarity.uncommon}>
          {t("options.uncommon")}
        </SelectItem>
        <SelectItem value={artifactRarity.rare}>{t("options.rare")}</SelectItem>
        <SelectItem value={artifactRarity.epic}>{t("options.epic")}</SelectItem>
        <SelectItem value={artifactRarity.legendary}>
          {t("options.legendary")}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SelectArtifactRarity
