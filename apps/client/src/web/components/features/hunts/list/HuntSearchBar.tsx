import { Button } from "@lootopia/ui"
import { CirclePlusIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { routes } from "@client/web/routes"
import {
  huntFilterTypeEnum,
  type HuntFilterType,
} from "@client/web/utils/def/huntFilter"

type Props = {
  inputValue: string
  handleInputValue: (value: string) => void
  huntFilterType: HuntFilterType
  handleHuntFilterType: (type: HuntFilterType) => void
}

const HuntSearchBar = (props: Props) => {
  const { inputValue, handleInputValue, huntFilterType, handleHuntFilterType } =
    props

  const t = useTranslations("Components.Hunts.SearchBar")

  const router = useRouter()

  const redirectToHuntPage = () => {
    router.push(routes.hunts.drafts)
  }

  return (
    <div className="flex gap-2">
      <div className="bg-primaryBg flex h-12 w-full items-center gap-4 overflow-hidden rounded-[12px] pl-4">
        <SearchIcon className="text-primary h-full" />
        <input
          type="text"
          className="text-primary bg-primaryBg h-full flex-1 border-0 outline-0"
          placeholder={
            huntFilterType === huntFilterTypeEnum.name
              ? t("placeholder.name")
              : t("placeholder.city")
          }
          value={inputValue}
          onChange={(e) => handleInputValue(e.target.value)}
        />
        <select
          className="bg-primary text-accent primary border-l-primary h-full border-l-2 px-3 font-medium outline-0"
          onChange={(e) =>
            handleHuntFilterType(e.target.value as HuntFilterType)
          }
        >
          <option value={huntFilterTypeEnum.name}>{t("options.name")}</option>
          <option value={huntFilterTypeEnum.city}>{t("options.city")}</option>
        </select>
      </div>
      <div className="min-h-full">
        <Button
          variant={"secondary"}
          size={"fit"}
          className="text-md rounded-[12px]"
          onClick={redirectToHuntPage}
        >
          <CirclePlusIcon className="size-5" />
          {t("cta.create-a-hunt")}
        </Button>
      </div>
    </div>
  )
}

export default HuntSearchBar
