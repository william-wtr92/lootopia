import { Button } from "@lootopia/ui"

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
  return (
    <div className="absolute bottom-5 left-1/2 z-[20] flex -translate-x-1/2 gap-4">
      <Button
        onClick={handleDraftSave}
        disabled={!isValid}
        className="text-primary bg-primaryBg w-48"
      >
        Enregister en brouillon
      </Button>
      <Button
        onClick={handleSubmitAll}
        disabled={!isValid}
        className="text-primary bg-accent hover:bg-accentHover w-48"
      >
        Valider la création
      </Button>
    </div>
  )
}

export default ActionsButton
