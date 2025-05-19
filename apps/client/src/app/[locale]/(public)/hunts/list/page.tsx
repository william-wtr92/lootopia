"use client"

import { defaultPage } from "@lootopia/common"
import { Button } from "@lootopia/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import HuntListItem from "@client/web/components/features/hunts/list/HuntListItem"
import HuntSearchBar from "@client/web/components/features/hunts/list/HuntSearchBar"
import NoResultHuntList from "@client/web/components/features/hunts/list/NoResultHuntList"
import Loader from "@client/web/components/utils/Loader"
import { getHunts } from "@client/web/services/hunts/getHunts"
import { getOrganizerHunts } from "@client/web/services/hunts/getOrganizerHunts"
import {
  huntFilterTypeEnum,
  type HuntFilterType,
} from "@client/web/utils/def/huntFilter"

const HuntsListPage = () => {
  const t = useTranslations("Pages.Hunts.List")

  const [inputValue, setInputValue] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const [huntFilterType, setHuntFilterType] = useState<HuntFilterType>("name")

  const getHuntFetcher = (filter: HuntFilterType, input: string) => {
    if (filter === huntFilterTypeEnum.organizer) {
      return (pageParam: number) =>
        getOrganizerHunts({ page: pageParam.toString(), search: input })
    }

    return (pageParam: number) =>
      getHunts(input, { page: pageParam.toString() }, filter)
  }

  const { data, hasNextPage, isLoading, isFetching, refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["hunts", huntFilterType, searchValue],
      queryFn: ({ pageParam = defaultPage }) =>
        getHuntFetcher(huntFilterType, searchValue)(pageParam),
      getNextPageParam: (previousResults, allPages) => {
        if (!previousResults) {
          return undefined
        }

        return allPages.length - 1 < previousResults?.lastPage
          ? allPages.length
          : undefined
      },
      initialPageParam: defaultPage,
    })

  const hunts =
    data?.pages
      .flatMap((page) => page?.result)
      .filter((item) => item !== undefined) || []

  const handleInputValue = (value: string) => {
    setInputValue(value)
  }

  const handleSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const handleHuntFilterType = (value: HuntFilterType) => {
    setHuntFilterType(value)
    setInputValue("")
    setSearchValue("")
  }

  const loadMore = () => {
    fetchNextPage()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setSearchValue(inputValue)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [refetch, inputValue])

  return (
    <main className="relative mx-auto mb-8 flex w-[70%] flex-1 flex-col gap-4">
      <HuntSearchBar
        inputValue={inputValue}
        handleInputValue={handleInputValue}
        huntFilterType={huntFilterType}
        handleHuntFilterType={handleHuntFilterType}
      />

      {isLoading ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader label={t("loading")} />
        </div>
      ) : hunts.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          {hunts.map((hunt) => (
            <HuntListItem
              key={hunt.id}
              hunt={hunt}
              huntFilterType={huntFilterType}
            />
          ))}

          {hasNextPage &&
            (isFetching ? (
              <Loader />
            ) : (
              <Button variant={"default"} onClick={loadMore}>
                {t("cta.load-more")}
              </Button>
            ))}
        </div>
      ) : (
        <NoResultHuntList
          searchValue={searchValue}
          handleInputValue={handleInputValue}
          handleSearchValue={handleSearchValue}
          refetch={refetch}
        />
      )}
    </main>
  )
}

export default HuntsListPage
