/* eslint-disable complexity */
"use client"

import type { HuntSchema } from "@common/hunts"
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  useToast,
} from "@lootopia/ui"
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import HuntForm from "@client/web/components/features/hunts/form/HuntForm"
import HuntListItem from "@client/web/components/features/hunts/list/HuntListItem"
import HuntSearchBar from "@client/web/components/features/hunts/list/HuntSearchBar"
import NoResultHuntList from "@client/web/components/features/hunts/list/NoResultHuntList"
import Loader from "@client/web/components/utils/Loader"
import { getHuntById } from "@client/web/services/hunts/getHuntById"
import { getHunts } from "@client/web/services/hunts/getHunts"
import { getOrganizerHunts } from "@client/web/services/hunts/getOrganizerHunts"
import { updateHunt } from "@client/web/services/hunts/updateHunt"
import type { HuntFilterType } from "@client/web/utils/def/huntFilter"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const HuntsListPage = () => {
  const t = useTranslations("Pages.Hunts.List")
  const { toast } = useToast()
  const qc = useQueryClient()

  const [inputValue, setInputValue] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const [huntFilterType, setHuntFilterType] = useState<HuntFilterType>("name")
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [huntId, setHuntId] = useState<string>("")

  const getHuntFetcher = (filter: HuntFilterType, input: string) => {
    if (filter === "organizer") {
      return (pageParam: number) =>
        getOrganizerHunts({ page: pageParam.toString(), search: input })
    }

    return (pageParam: number) =>
      getHunts(input, { page: pageParam.toString() }, filter)
  }

  const { data, hasNextPage, isLoading, isFetching, refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["hunts", huntFilterType, searchValue],
      queryFn: ({ pageParam = 0 }) =>
        getHuntFetcher(huntFilterType, searchValue)(pageParam),
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

  const { data: hunt } = useQuery({
    queryKey: ["hunt", huntId],
    queryFn: () => getHuntById({ huntId }),
    enabled: !!huntId,
    refetchOnWindowFocus: false,
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
    setInputValue("")
    setSearchValue("")
  }

  const loadMore = () => {
    fetchNextPage()
  }

  const handleTiggerUpdateForm = () => {
    setIsUpdateFormVisible((prev) => !prev)
  }

  const handleDisplayUpdateFormWithHunt = (huntId: string) => {
    setHuntId(huntId)
    handleTiggerUpdateForm()
  }

  const handleUpdateHunt = async (data: HuntSchema) => {
    const [status, key] = await updateHunt({ huntId }, data)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("update.success"),
    })

    handleTiggerUpdateForm()

    setInputValue("")
    setSearchValue("")

    qc.invalidateQueries({ queryKey: ["hunts"] })
    qc.invalidateQueries({ queryKey: ["hunt", huntId] })
    qc.invalidateQueries({ queryKey: ["hunts", huntFilterType] })
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

  useEffect(() => {
    if (huntFilterType === "organizer") {
      setInputValue("")
    }

    refetch()
  }, [huntFilterType, refetch])

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
              handleDisplayUpdateForm={handleDisplayUpdateFormWithHunt}
            />
          ))}

          {isUpdateFormVisible && (
            <>
              <Sheet
                open={isUpdateFormVisible}
                onOpenChange={handleTiggerUpdateForm}
              >
                <SheetContent className="bg-primaryBg text-primary">
                  <SheetHeader>
                    <SheetTitle>{t("update.title")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <HuntForm
                      mode="update"
                      updateHunt={hunt?.result as HuntSchema}
                      onSubmit={handleUpdateHunt}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}

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
