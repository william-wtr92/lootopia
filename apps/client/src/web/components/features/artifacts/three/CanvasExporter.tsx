import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@lootopia/ui"
import { MoreVertical, Video, Image as ImageIcon } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  onExportPNG: () => void
  onExportWebM: () => void
  isRecording: boolean
}

const CanvasExporter = ({ onExportPNG, onExportWebM, isRecording }: Props) => {
  const t = useTranslations("Components.Artifacts.Three.CanvasExporter")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-primary text-primary bg-primaryBg"
      >
        <DropdownMenuItem
          onClick={onExportPNG}
          className="focus:bg-primary/10 cursor-pointer"
        >
          <ImageIcon className="mr-2 size-4" />
          {t("options.pngExport")}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isRecording}
          onClick={onExportWebM}
          className="focus:bg-primary/10 cursor-pointer"
        >
          <Video className="mr-2 size-4" />
          {isRecording ? t("isRecording") : t("options.webmExport")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CanvasExporter
