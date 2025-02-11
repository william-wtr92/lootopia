import type { HuntSchema, ChestSchema, PositionCords } from "@lootopia/common"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Hunts = Record<string, { hunt: HuntSchema; chests: ChestSchema[] }>

type HuntStore = {
  hunts: Hunts
  activeHuntId: string | null
  position: PositionCords
  isSheetOpen: boolean
  currentChest: Partial<ChestSchema> | null

  createHunt: (hunt: Omit<HuntSchema, "id">) => void
  addChest: (huntId: string, chest: ChestSchema) => void
  removeChest: (huntId: string, id: string) => void
  setActiveHunt: (huntId: string) => void
  setPosition: (position: PositionCords) => void
  setIsSheetOpen: (isOpen: boolean) => void
  setCurrentChest: (chest: Partial<ChestSchema> | null) => void
}

export const useHuntStore = create<HuntStore>()(
  persist(
    (set) => ({
      hunts: {},
      activeHuntId: null,
      position: { lat: 46.603354, lng: 1.888334 },
      isSheetOpen: false,
      currentChest: null,

      createHunt: (hunt) =>
        set((state) => {
          if (state.activeHuntId && state.hunts[state.activeHuntId]) {
            return {
              hunts: {
                ...state.hunts,
                [state.activeHuntId]: {
                  ...state.hunts[state.activeHuntId],
                  hunt: { ...state.hunts[state.activeHuntId].hunt, ...hunt },
                },
              },
            }
          }

          const newHuntId = uuidv4()
          const newHunt = { id: newHuntId, ...hunt }

          return {
            hunts: {
              ...state.hunts,
              [newHuntId]: { hunt: newHunt, chests: [] },
            },
            activeHuntId: newHuntId,
          }
        }),

      addChest: (huntId, chest) =>
        set((state) => {
          if (!state.hunts[huntId]) {
            return state
          }

          return {
            hunts: {
              ...state.hunts,
              [huntId]: {
                ...state.hunts[huntId],
                chests: [...state.hunts[huntId].chests, chest],
              },
            },
          }
        }),

      removeChest: (huntId, id) =>
        set((state) => {
          if (!state.hunts[huntId]) {
            return state
          }

          return {
            hunts: {
              ...state.hunts,
              [huntId]: {
                ...state.hunts[huntId],
                chests: state.hunts[huntId].chests.filter((c) => c.id !== id),
              },
            },
          }
        }),

      setActiveHunt: (huntId) =>
        set((state) => ({
          activeHuntId: state.hunts[huntId] ? huntId : state.activeHuntId,
        })),

      setPosition: (position) => set(() => ({ position })),
      setIsSheetOpen: (isOpen) => set(() => ({ isSheetOpen: isOpen })),
      setCurrentChest: (chest) => set(() => ({ currentChest: chest })),
    }),
    {
      name: "hunt-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hunts: state.hunts,
      }),
    }
  )
)
