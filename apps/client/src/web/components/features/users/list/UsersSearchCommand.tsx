"use client"

import { defaultPage } from "@lootopia/common"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  Skeleton,
} from "@lootopia/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState, useRef, type KeyboardEvent } from "react"

import { config } from "@client/env"
import { useCommandShortcut } from "@client/web/hooks/useCommandShortcut"
import { usePaginationObserver } from "@client/web/hooks/usePaginationObserver"
import { routes } from "@client/web/routes"
import { getUserList } from "@client/web/services/users/getUserList"
import anim from "@client/web/utils/anim"

const UsersSearchCommand = () => {
  const t = useTranslations("Components.Users.SearchCommand")
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["users", inputValue],
      queryFn: ({ pageParam = defaultPage }) =>
        getUserList({
          search: inputValue,
          page: pageParam.toString(),
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage) {
          return undefined
        }

        return allPages.length - 1 < lastPage.lastPage
          ? allPages.length
          : undefined
      },
      enabled: inputValue.length > 3 && open,
      initialPageParam: defaultPage,
    })

  const {
    containerRef: listContainerRef,
    sentinelRef: listRef,
    checkIfShouldFetchNextPage,
  } = usePaginationObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  })

  useCommandShortcut({
    onTrigger: () => handleShowCommand(),
  })

  const users = data?.pages.flatMap((page) => page?.result) ?? []

  const handleShowCommand = () => {
    setOpen((prev) => !prev)
    setInputValue("")
  }

  const handleSetValue = (value: string) => {
    setInputValue(value)
    checkIfShouldFetchNextPage()
  }

  const handleSelectUser = (nickname: string) => {
    handleShowCommand()
    setInputValue("")
    router.push(routes.users.profileNickname(nickname))
  }

  const handleTriggerNextPageOnKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      checkIfShouldFetchNextPage()
    }
  }

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  return (
    <>
      <Button onClick={handleShowCommand}>
        <Search />
        <span className="hidden lg:inline-flex">{t("trigger")}</span>
      </Button>
      <AnimatePresence>
        {open && (
          <CommandDialog
            open={open}
            onOpenChange={handleShowCommand}
            className="border-primary/20 overflow-hidden rounded-xl border p-0 shadow-2xl"
          >
            <motion.div
              {...anim(dialogVariant)}
              className="bg-primaryBg overflow-hidden rounded-xl"
            >
              <div className="border-primary/20 flex items-center border-b px-4 py-3">
                <Search className="text-secondary mr-2 h-5 w-5 shrink-0" />
                <CommandInput
                  ref={inputRef}
                  placeholder={t("placeholder")}
                  value={inputValue}
                  onValueChange={(value) => handleSetValue(value)}
                  onKeyDown={(e) => handleTriggerNextPageOnKeyDown(e)}
                  className="text-primary placeholder:text-primary w-full border-none text-lg focus:ring-0"
                />
              </div>
              <CommandList
                ref={listContainerRef}
                className="max-h-[400px] overflow-y-auto px-1 py-2"
              >
                {inputValue.length > 0 && (
                  <>
                    <CommandEmpty className="text-primary py-6 text-center">
                      <motion.div {...anim(emptyStateVariant)}>
                        <Users className="text-secondary mx-auto mb-3 h-12 w-12 opacity-50" />
                        <p className="text-lg font-medium">
                          {t("empty.title")}
                        </p>
                        <p className="text-secondary mt-1 text-sm">
                          {t("empty.description", {
                            term: inputValue,
                          })}
                        </p>
                      </motion.div>
                    </CommandEmpty>

                    {isLoading && (
                      <CommandLoading>
                        <div className="space-y-3 p-4">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              {...anim(skeletonVariant(i))}
                              className="flex items-center gap-3"
                            >
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CommandLoading>
                    )}

                    {users && users.length > 0 && (
                      <>
                        <CommandGroup
                          className="text-primary"
                          heading={t("group.title")}
                        >
                          <div className="space-y-1">
                            {users.map((user, i) => (
                              <CommandItem
                                key={user?.id}
                                value={user?.nickname}
                                onSelect={() =>
                                  user?.nickname &&
                                  handleSelectUser(user.nickname)
                                }
                                className="hover:bg-primary/5 data-[selected=true]:bg-primary/10 group cursor-pointer rounded-lg px-2 py-3 transition-all duration-200"
                              >
                                <motion.div
                                  {...anim(itemFadeVariant(i))}
                                  className="flex w-full items-center gap-3"
                                >
                                  <div className="relative">
                                    <Avatar className="border-primary/20 h-12 w-12 border shadow-sm">
                                      <AvatarImage
                                        className="object-contain"
                                        src={
                                          user?.avatar
                                            ? config.blobUrl + user.avatar
                                            : ""
                                        }
                                        alt={user?.nickname}
                                      />
                                      <AvatarFallback className="bg-primary text-accent text-lg">
                                        {user?.nickname
                                          .substring(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>

                                  <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="flex items-center justify-between">
                                      <span className="text-primary truncate text-lg font-medium">
                                        {user?.nickname}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-primary bg-primary/10 ml-2 font-semibold"
                                      >
                                        {t("group.users.level", {
                                          level: user?.progression?.level,
                                        })}
                                      </Badge>
                                    </div>
                                  </div>

                                  <ArrowRight className="group-hover:text-primary text-primary h-5 w-5 transition-colors duration-200" />
                                </motion.div>
                              </CommandItem>
                            ))}
                          </div>
                        </CommandGroup>

                        <div id="sentinel" ref={listRef} className="h-1" />
                      </>
                    )}
                  </>
                )}

                {inputValue.length === 0 && (
                  <div className="text-primary px-4 py-6 text-center">
                    <motion.div {...anim(emptyStateEnterVariant)}>
                      <Users className="text-secondary mx-auto mb-3 h-16 w-16" />
                      <p className="mb-2 text-lg font-medium">
                        {t("help.title")}
                      </p>
                      <p className="text-secondary mx-auto max-w-md text-sm">
                        {t("help.description")}
                      </p>

                      <div className="text-primary/70 mt-6 flex flex-wrap justify-center gap-2 text-xs">
                        <div className="flex items-center">
                          <kbd className="bg-primary/5 border-primary/20 rounded border px-2 py-1 font-mono">
                            {t("help.command.escape.trigger")}
                          </kbd>
                          <span className="mx-2">
                            {t("help.command.escape.description")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <kbd className="border-primary/20 bg-primary/5 rounded border px-2 py-1 font-mono">
                            {t("help.command.arrows.trigger")}
                          </kbd>
                          <span className="mx-2">
                            {t("help.command.arrows.description")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <kbd className="border-primary/20 bg-primary/5 rounded border px-2 py-1 font-mono">
                            {t("help.command.enter.trigger")}
                          </kbd>
                          <span className="mx-2">
                            {t("help.command.enter.description")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </CommandList>

              <div className="text-primary border-primary/10 border-t p-2 text-center text-xs">
                <span>{t("about")}</span>
              </div>
            </motion.div>
          </CommandDialog>
        )}
      </AnimatePresence>
    </>
  )
}

export default UsersSearchCommand

const dialogVariant = {
  initial: { opacity: 0, y: -30, scale: 0.95 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

const emptyStateVariant = {
  initial: { opacity: 0, scale: 0.9 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

const emptyStateEnterVariant = {
  initial: { opacity: 0, scale: 0.9 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

const itemFadeVariant = (index = 0) => ({
  initial: { opacity: 0, y: 10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.05 },
  },
})

const skeletonVariant = (index = 0) => ({
  initial: { opacity: 0, y: 10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: index * 0.1 },
  },
})
