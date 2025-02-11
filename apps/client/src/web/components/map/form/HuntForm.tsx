/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod"
import { type HuntSchema, huntSchema } from "@lootopia/common"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  Textarea,
  Switch,
  Input,
  FormLabel,
  DatePicker,
  Button,
} from "@lootopia/ui"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useHuntStore } from "@client/web/store/useHuntStore"

type Props = {
  onSubmit: (data: HuntSchema) => void
}

const HuntForm = ({ onSubmit }: Props) => {
  const { activeHuntId, hunts } = useHuntStore()

  const activeHunt = activeHuntId ? hunts[activeHuntId]?.hunt : null

  const form = useForm<HuntSchema>({
    resolver: zodResolver(huntSchema),
    defaultValues: {
      name: activeHunt?.name ?? "",
      description: activeHunt?.description ?? "",
      endDate: activeHunt?.endDate ?? "",
      mode: activeHunt?.mode ?? true,
      maxParticipants: activeHunt?.maxParticipants ?? undefined,
    },
  })

  useEffect(() => {
    if (activeHunt) {
      form.reset(activeHunt)
    }
  }, [activeHunt, form, form.reset])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-primary flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nom de la chasse</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nom de la chasse"
                  className="border-primary border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Décrivez le contenu et l'emplacement du coffre"
                  className="border-primary h-10 border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de fin</FormLabel>
              <FormControl>
                <DatePicker
                  placeholder={"Date de fin de la chasse"}
                  className="text-primary border-primary bg-primaryBg w-full"
                  onChange={(selectedDate) => {
                    field.onChange(selectedDate?.toISOString() || "")
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Participants max</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Laisser vide pour illimité"
                  className="border-primary border"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    field.onChange(
                      val === "" ? undefined : Math.max(0, Number(val))
                    )
                  }}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-sm text-gray-500">
                Laisser vide signifie que la chasse est{" "}
                <strong>illimitée</strong>.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="border-primary flex w-full items-center justify-between rounded-lg border p-4 shadow-md">
              <FormDescription className="text-md">
                Visibilité de la chasse :
                <span className={`text-primary ml-2 font-semibold`}>
                  {field.value ? "Publique" : "Privée"}
                </span>
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          disabled={!form.formState.isValid}
          type="submit"
          className="text-primary bg-accent hover:bg-accentHover w-full"
        >
          {activeHunt ? "Modifier" : "Créer"} la chasse
        </Button>
      </form>
    </Form>
  )
}

export default HuntForm
