import { Checkbox, cn } from "@lootopia/ui"

type Props = {
  id: string
  title: string
  description: string
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  icon?: React.ReactNode
}

const CookieOption = ({
  id,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  icon,
}: Props) => {
  return (
    <div className="border-primary/10 flex items-start space-x-3 rounded-lg border bg-white/50 p-3">
      <div className="bg-primary/10 rounded-full p-2">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-primary cursor-pointer text-sm font-medium"
          >
            {title}
          </label>
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            className={cn(
              "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-accent",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
        </div>
        <p className="text-primary/70 mt-1 text-xs">{description}</p>
      </div>
    </div>
  )
}

export default CookieOption
