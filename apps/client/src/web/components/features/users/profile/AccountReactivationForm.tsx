"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@lootopia/ui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const reactivationSchema = z.object({
  email: z.string().email("Adresse email invalide"),
})

type ReactivationSchema = z.infer<typeof reactivationSchema>

const AccountReactivationForm = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const form = useForm<ReactivationSchema>({
    resolver: zodResolver(reactivationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  const handleIsOpen = (open: boolean) => {
    setIsOpen(open)
  }

  const onSubmit = async (data: ReactivationSchema) => {
    try {
      const response = await fetch("/api/users/reactivate-account/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      })

      if (response.ok) {
        toast({
          variant: "default",
          description: "Un email de réactivation vous a été envoyé.",
        })
        handleIsOpen(false)
      } else {
        toast({
          variant: "destructive",
          description: "Erreur lors de la demande de réactivation.",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        description: "Erreur réseau. Veuillez réessayer plus tard.",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Réactiver mon compte</Button>
      </DialogTrigger>

      <DialogContent className="text-primary" size="md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Réactivation de compte
          </DialogTitle>
          <Form {...form}>
            <form
              className="flex flex-col gap-3 pt-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-primary focus:ring-secondary"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="text-error">
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                className="w-fit self-end"
                variant="secondary"
                type="submit"
              >
                Envoyer la demande
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AccountReactivationForm
