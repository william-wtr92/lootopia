import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lootopia/ui"
import { CirclePlus, Search } from "lucide-react"
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
        <Search className="text-primary h-full" />
        <Input
          type="text"
          className="text-primary bg-primaryBg h-full flex-1 border-0 outline-0 ring-0 focus-visible:ring-0"
          placeholder={
            huntFilterType === huntFilterTypeEnum.name
              ? t("placeholder.name")
              : t("placeholder.city")
          }
          value={inputValue}
          onChange={(e) => handleInputValue(e.target.value)}
        />
        <Select
          onValueChange={(value) =>
            handleHuntFilterType(value as HuntFilterType)
          }
          defaultValue={huntFilterTypeEnum.name}
        >
          <SelectTrigger className="bg-primary text-accent primary border-l-primary h-full w-[180px] select-none border-l-2 px-3 font-medium outline-0 ring-0 focus:ring-0">
            <SelectValue placeholder={t("options.name")} />
          </SelectTrigger>
          <SelectContent className="text-primary bg-accent h-full font-medium outline-0">
            <SelectGroup>
              <SelectItem
                value={huntFilterTypeEnum.name}
                className="text-primary"
              >
                {t("options.name")}
              </SelectItem>
              <SelectItem value={huntFilterTypeEnum.city}>
                {t("options.city")}
              </SelectItem>
              <SelectItem value={huntFilterTypeEnum.organizer}>
                {t("options.organizer")}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="min-h-full">
        <Button
          variant={"secondary"}
          size={"fit"}
          className="text-md select-none rounded-[12px]"
          onClick={redirectToHuntPage}
        >
          <CirclePlus className="size-5" />
          {t("cta.create-a-hunt")}
        </Button>
      </div>
    </div>
  )
}

export default HuntSearchBar
