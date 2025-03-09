import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import React from "react"

import {
  huntFilterTypeEnum,
  type HuntFilterType,
} from "@client/app/[locale]/hunts/(list)/list/page"

type Props = {
  handleInputValue: (value: string) => void
  huntFilterType: HuntFilterType
  handleHuntFilterType: (type: HuntFilterType) => void
}

const HuntSearchBar = (props: Props) => {
  const { handleInputValue, huntFilterType, handleHuntFilterType } = props

  const t = useTranslations("Components.Hunts.SearchBar")

  return (
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
        onChange={(e) => handleInputValue(e.target.value)}
      />
      <select
        className="bg-primary text-accent primary border-l-primary h-full border-l-2 px-3 font-medium outline-0"
        onChange={(e) => handleHuntFilterType(e.target.value as HuntFilterType)}
      >
        <option value={huntFilterTypeEnum.name}>{t("options.name")}</option>
        <option value={huntFilterTypeEnum.city}>{t("options.city")}</option>
      </select>
    </div>
  )
}

export default HuntSearchBar
