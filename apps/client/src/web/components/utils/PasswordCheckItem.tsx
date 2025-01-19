import { motion, usePresence } from "framer-motion"
import { Check, X } from "lucide-react"

const PasswordCheckItem = ({
  label,
  isValid,
}: {
  label: string
  isValid: boolean
}) => {
  const [, safeToRemove] = usePresence()

  const animations = {
    layout: true,
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => safeToRemove?.(),
      },
    },
  }

  return (
    <motion.div
      {...animations}
      className="flex items-center space-x-2 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isValid ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-red-500" />
        )}
      </motion.div>
      <motion.span
        className={`text-sm`}
        animate={{ color: isValid ? "#10B981" : "#EF4444" }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export default PasswordCheckItem
