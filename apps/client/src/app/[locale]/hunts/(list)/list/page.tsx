"use client"

import { Button } from "@lootopia/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import React, { useEffect, useState } from "react"

import HuntListItem from "@client/web/components/features/hunts/list/HuntListItem"
import HuntSearchBar from "@client/web/components/features/hunts/list/HuntSearchBar"
import NoResultHuntList from "@client/web/components/features/hunts/list/NoResultHuntList"
import Loader from "@client/web/components/utils/Loader"
import { getHunts } from "@client/web/services/hunts/getHunts"

export const huntFilterTypeEnum = {
  city: "city",
  name: "name",
}

export type HuntFilterType =
  (typeof huntFilterTypeEnum)[keyof typeof huntFilterTypeEnum]

const HuntsListPage = () => {
  const t = useTranslations("Pages.Hunts.List")

  const [inputValue, setInputValue] = useState<string>("")
  const [huntFilterType, setHuntFilterType] = useState<HuntFilterType>("name")

  const { data, hasNextPage, isLoading, isFetching, refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["hunts"],
      queryFn: ({ pageParam = 0 }) =>
        getHunts(inputValue, huntFilterType, pageParam),
      getNextPageParam: (previousResults, allPages) => {
        if (!previousResults) {
          return undefined
        }

        return allPages.length - 1 < previousResults?.lastPage
          ? allPages.length
          : undefined
      },
      initialPageParam: 0,
    })

  const hunts =
    data?.pages
      .flatMap((page) => page?.result)
      .filter((item) => item !== undefined) || []

  const handleInputValue = (value: string) => {
    setInputValue(value)
  }

  const handleHuntFilterType = (value: HuntFilterType) => {
    setHuntFilterType(value)
  }

  const loadMore = () => {
    fetchNextPage()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        refetch()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [refetch])

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
          {hunts.map((hunt, index) => (
            <HuntListItem key={index} hunt={hunt} />
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
          inputValue={inputValue}
          handleInputValue={handleInputValue}
          refetch={refetch}
        />
      )}
    </main>
  )
}

export default HuntsListPage
