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

  createHunt: (hunt: Omit<HuntSchema, "id">) => string
  getHunt: (huntId: string) => HuntSchema | null
  getHuntWithChests: (
    huntId: string
  ) => { hunt: HuntSchema; chests: ChestSchema[] } | null
  removeHunt: (huntId: string) => void
  addChest: (huntId: string, chest: ChestSchema) => void
  removeChest: (huntId: string, id: string) => void
  setActiveHunt: (huntId: string | null) => void
  setPosition: (position: PositionCords) => void
  setIsSheetOpen: (isOpen: boolean) => void
  setCurrentChest: (chest: Partial<ChestSchema> | null) => void
}

export const useHuntStore = create<HuntStore>()(
  persist(
    (set, get) => ({
      hunts: {},
      activeHuntId: null,
      position: { lat: 46.603354, lng: 1.888334 },
      isSheetOpen: false,
      currentChest: null,

      createHunt: (hunt) => {
        const { activeHuntId, hunts } = get()

        if (activeHuntId && hunts[activeHuntId]) {
          set({
            hunts: {
              ...hunts,
              [activeHuntId]: {
                ...hunts[activeHuntId],
                hunt: { ...hunts[activeHuntId].hunt, ...hunt },
              },
            },
          })

          return activeHuntId
        }

        const newHuntId = uuidv4()
        const newHunt = { id: newHuntId, ...hunt }

        set((state) => ({
          hunts: {
            ...state.hunts,
            [newHuntId]: { hunt: newHunt, chests: [] },
          },
          activeHuntId: newHuntId,
        }))

        return newHuntId
      },

      getHunt: (huntId) => {
        const { hunts } = get()

        return hunts[huntId] ? hunts[huntId].hunt : null
      },

      getHuntWithChests: (huntId) => {
        const { hunts } = get()

        return hunts[huntId] ? hunts[huntId] : null
      },

      removeHunt: (huntId) =>
        set((state) => {
          const hunts = { ...state.hunts }
          delete hunts[huntId]

          return {
            hunts,
            activeHuntId: null,
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
        set(() => ({
          activeHuntId: huntId,
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
