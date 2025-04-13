import type { ParticipationRequestIds } from "@lootopia/common"
import { Button, useToast } from "@lootopia/ui"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Check, ListPlus, X } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { config } from "@client/env"
import { acceptParticipationRequest } from "@client/web/services/participations/acceptParticipationRequest"
import type { RequestResponse } from "@client/web/services/participations/getParticipationRequestList"
import { rejectParticipationRequest } from "@client/web/services/participations/rejectParticipationRequest"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  filteredRequests: RequestResponse[]
  listContainerRef: React.RefObject<HTMLDivElement | null>
  listRef: React.RefObject<HTMLDivElement | null>
  huntId: string
}

const ParticipationRequestList = ({
  filteredRequests,
  listContainerRef,
  listRef,
  huntId,
}: Props) => {
  const t = useTranslations(
    "Components.Hunts.List.Participations.ParticipationRequestList"
  )
  const { toast } = useToast()
  const qc = useQueryClient()

  const handleAcceptRequest = async ({
    requestId,
  }: Pick<ParticipationRequestIds, "requestId">) => {
    const [status, key] = await acceptParticipationRequest({
      huntId,
      requestId,
    })

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `actions.accept.errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("actions.accept.success"),
    })

    qc.invalidateQueries({ queryKey: ["requests"] })
    qc.invalidateQueries({ queryKey: ["participationRequestCount"] })
    qc.invalidateQueries({ queryKey: ["hunts"] })
  }

  const handleRejectRequest = async ({
    requestId,
  }: Pick<ParticipationRequestIds, "requestId">) => {
    const [status, key] = await rejectParticipationRequest({
      huntId,
      requestId,
    })

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `actions.reject.errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("actions.reject.success"),
    })

    qc.invalidateQueries({ queryKey: ["requests"] })
    qc.invalidateQueries({ queryKey: ["participationRequestCount"] })
  }

  return (
    <div
      ref={listContainerRef}
      className="max-h-[370px] flex-1 overflow-y-auto p-4"
    >
      {filteredRequests.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
          <ListPlus className="text-primary mb-4 size-12 opacity-30" />
          <p className="text-secondary font-medium">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests
            .filter((r) => r && r.request)
            .map(({ request, requesterUser }) => (
              <motion.div
                key={request.id}
                className="border-primary/20 rounded-lg border bg-white/30 p-4 transition-colors hover:bg-white/50"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        requesterUser?.avatar
                          ? config.blobUrl + requesterUser.avatar
                          : ""
                      }
                      alt="Avatar"
                      width={50}
                      height={50}
                      className="aspect-square rounded-full object-contain"
                    />

                    <div>
                      <h3 className="text-primary font-medium">
                        {requesterUser?.nickname}
                      </h3>
                      <span className="text-primary text-sm">
                        {t("info.received", {
                          date: formatDate(request.requestedAt),
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      className="hover:bg-error/50 hover:border-error hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRejectRequest({ requestId: request.id })
                      }}
                    >
                      <X className="mr-1 size-4" />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcceptRequest({ requestId: request.id })
                      }}
                    >
                      <Check className="mr-1 size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
      <div id="sentinel" ref={listRef} className="h-1" />
    </div>
  )
}

export default ParticipationRequestList
