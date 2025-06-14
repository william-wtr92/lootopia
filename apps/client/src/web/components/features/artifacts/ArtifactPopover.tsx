import { zodResolver } from "@hookform/resolvers/zod"
import {
  ACCEPTED_FILE_TYPES,
  artifactUploadSchema,
  type ArtifactUploadSchema,
} from "@lootopia/common"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
} from "@lootopia/ui"
import { useTranslations } from "next-intl"
import { useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"

type Props = {
  onUpload: (data: ArtifactUploadSchema) => void
}

const ArtifactPopover = ({ onUpload }: Props) => {
  const t = useTranslations("Components.Artifacts.ArtifactPopover")

  const [open, setOpen] = useState(false)

  const form = useForm<ArtifactUploadSchema>({
    resolver: zodResolver(artifactUploadSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      file: undefined,
    },
  })

  const {
    setValue,
    watch,
    formState: { errors },
  } = form

  const selectedFile = watch("file")

  const onSubmit = (data: ArtifactUploadSchema) => {
    if (!data.file) {
      return
    }

    onUpload(data)
    form.resetField("file")
    handleOpen()
  }

  const handleOpen = () => {
    setOpen((prev) => !prev)
  }

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setValue("file", e.target.files[0])
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          {t("button")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-primaryBg text-primary p-4">
        <Form {...form}>
          <form className="flex flex-col justify-center gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    {t("Form.name.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-primary focus:ring-secondary"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage className="text-error">
                    {errors.name ? t("Form.name.error") : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel className="border-primary mt-6 flex cursor-pointer justify-center rounded-md border-2 py-1.5">
                    {t("Form.file.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={Object.values(ACCEPTED_FILE_TYPES).join(",")}
                      className="hidden"
                      onChange={(e) => handleChangeFile(e)}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.file ? t("Form.file.error") : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <Button
              className="mt-2"
              type="button"
              disabled={!selectedFile}
              onClick={form.handleSubmit(onSubmit)}
            >
              {t("Form.submit")}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default ArtifactPopover
