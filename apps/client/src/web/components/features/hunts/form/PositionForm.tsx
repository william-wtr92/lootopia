import { zodResolver } from "@hookform/resolvers/zod"
import { type PositionSchema, positionSchema } from "@lootopia/common"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@lootopia/ui"
import { useForm } from "react-hook-form"

type Props = {
  onSubmit: (data: PositionSchema) => void
}

const PositionForm = ({ onSubmit }: Props) => {
  const form = useForm<PositionSchema>({
    resolver: zodResolver(positionSchema),
    mode: "onBlur",
    defaultValues: {
      lat: "",
      lng: "",
    },
  })

  const handleSubmit = (data: PositionSchema) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="text-primary flex flex-row items-center justify-center gap-4"
      >
        <FormField
          control={form.control}
          name="lat"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Latitude"
                  className="w-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lng"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Longitude"
                  className="w-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="text-primary bg-accent hover:bg-accent-hover w-auto"
          disabled={!form.formState.isValid}
        >
          Centrer la carte
        </Button>
      </form>
    </Form>
  )
}

export default PositionForm
