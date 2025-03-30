import { Button } from "@lootopia/ui"
import { Crown } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  handleDraftSave: () => void
  handleSubmitAll: () => void
  isValid: boolean | string | null
}

const ActionsButton = ({
  handleDraftSave,
  handleSubmitAll,
  isValid,
}: Props) => {
  const t = useTranslations("Components.Hunts.Utils.ActionsButton")

  return (
    <div className="absolute bottom-5 left-1/2 z-[20] flex -translate-x-1/2 gap-4">
      <Button
        onClick={handleDraftSave}
        disabled={!isValid}
        className="text-primary bg-primaryBg w-48 hover:text-white"
      >
        {t("saveDraft")}
      </Button>
      <Button
        onClick={handleSubmitAll}
        disabled={!isValid}
        className="text-primary bg-accent hover:bg-accentHover flex w-48 items-center gap-2"
      >
        <span>{t("submit")}</span>
        <div className="flex items-center gap-1 font-bold">
          <span>{t("crownsAmount")}</span>
          <Crown size={16} />
        </div>
      </Button>
    </div>
  )
}

export default ActionsButton
