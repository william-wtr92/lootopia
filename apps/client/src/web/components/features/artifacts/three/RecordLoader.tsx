import { useTranslations } from "next-intl"

type Props = {
  isRecording: boolean
}

const RecordLoader = ({ isRecording }: Props) => {
  const t = useTranslations("Components.Artifacts.Three.RecordLoader")

  return (
    <>
      {isRecording && (
        <div className="pointer-events-auto absolute inset-0 z-40 rounded-xl bg-black/10 backdrop-blur-sm">
          <div className="relative left-2 top-2 flex items-center gap-2">
            <div className="bg-error size-3 animate-pulse rounded-full" />
            <span className="text-sm font-semibold">{t("isRecording")}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default RecordLoader
