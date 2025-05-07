"use client"

import { AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

import PasswordCheckItem from "./PasswordCheckItem"
import type { PasswordStrength } from "@client/web/utils/helpers/passwordChecker"

type Props = {
  passwordStrength: PasswordStrength
}

const PasswordStrengthChecker = ({ passwordStrength }: Props) => {
  const t = useTranslations("Components.Utils.Helpers.PasswordStrengthChecker")

  return (
    <div className="mt-2 space-y-1">
      <AnimatePresence>
        {!passwordStrength.hasUppercase && (
          <PasswordCheckItem
            key="uppercase"
            label={t("uppercase")}
            isValid={passwordStrength.hasUppercase}
          />
        )}
        {!passwordStrength.hasLowercase && (
          <PasswordCheckItem
            key="lowercase"
            label={t("lowercase")}
            isValid={passwordStrength.hasLowercase}
          />
        )}
        {!passwordStrength.hasNumber && (
          <PasswordCheckItem
            key="number"
            label={t("number")}
            isValid={passwordStrength.hasNumber}
          />
        )}
        {!passwordStrength.hasSpecialChar && (
          <PasswordCheckItem
            key="special"
            label={t("special")}
            isValid={passwordStrength.hasSpecialChar}
          />
        )}
        {!passwordStrength.isLongEnough && (
          <PasswordCheckItem
            key="length"
            label={t("length")}
            isValid={passwordStrength.isLongEnough}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PasswordStrengthChecker
