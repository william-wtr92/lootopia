"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@lootopia/ui"
import { Globe } from "lucide-react"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import {
  useRouter,
  usePathname,
  locales,
  type Locale,
} from "@client/i18n/routing"

const SelectLocale = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Components.SelectLocale")

  const onSelectChange = (value: Locale) => {
    const nextLocale = value
    startTransition(() => {
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      router.replace({ pathname, params }, { locale: nextLocale })
    })
  }

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger
        className="border-0 shadow-none outline-none focus:ring-0"
        isArrow={false}
      >
        <Globe className="text-primary text-2xl" />
      </SelectTrigger>
      <SelectContent className="bg-primary">
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem
              key={locale}
              value={locale}
              className={`cursor-pointer hover:text-black ${
                currentLocale === locale
                  ? "data-[disabled]:text-black"
                  : "text-white"
              }`}
            >
              {t("locale", { locale })}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectLocale
