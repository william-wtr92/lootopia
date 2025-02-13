import { Button } from "@lootopia/ui"
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
        className="text-primary bg-primaryBg w-48"
      >
        {t("saveDraft")}
      </Button>
      <Button
        onClick={handleSubmitAll}
        disabled={!isValid}
        className="text-primary bg-accent hover:bg-accentHover w-48"
      >
        {t("submit")}
      </Button>
    </div>
  )
}

export default ActionsButton
