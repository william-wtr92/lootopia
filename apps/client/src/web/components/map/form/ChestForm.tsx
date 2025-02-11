/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod"
import { chestSchema, type ChestSchema } from "@lootopia/common"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@lootopia/ui"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"

type ChestFormProps = {
  initialData?: Partial<ChestSchema> | null
  onSubmit: (data: ChestSchema) => void
}

const ChestForm = ({ initialData, onSubmit }: ChestFormProps) => {
  const form = useForm<ChestSchema>({
    resolver: zodResolver(chestSchema),
    defaultValues: {
      id: initialData?.id || uuid(),
      position: initialData?.position || { lat: 0, lng: 0 },
      description: initialData?.description || "",
      reward: initialData?.reward || "",
      size: initialData?.size || 80,
      maxUsers: initialData?.maxUsers || 1,
      visibility: initialData?.visibility || false,
    },
  })

  const handleSubmit = (data: ChestSchema) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Décrivez le contenu et l'emplacement du coffre"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Récompense</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Décrivez la récompense" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille du coffre</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} max={100} />
              </FormControl>
              <FormDescription>Taille du coffre (1-100)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxUsers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre maximum d'utilisateurs</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Visibilité</FormLabel>
                <FormDescription>
                  Rendre le coffre visible pour tous les utilisateurs
                </FormDescription>
              </div>
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
          type="submit"
          className="text-primary bg-accent hover:bg-accent-hover w-full"
        >
          Valider
        </Button>
      </form>
    </Form>
  )
}

export default ChestForm
