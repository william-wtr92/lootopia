import { motion } from "framer-motion"

type Props = {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const SpecialOfferCard = ({ title, description, icon, color }: Props) => {
  return (
    <motion.div
      whileHover="whileHover"
      transition={cardVariant.transition}
      variants={cardVariant}
    >
      <div className={`${color} rounded-xl p-4 text-white shadow-lg`}>
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-white/20 p-3">{icon}</div>
          <div>
            <h4 className="text-lg font-bold">{title}</h4>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SpecialOfferCard

const cardVariant = {
  whileHover: { scale: 1.02 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
}
