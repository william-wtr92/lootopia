type Props = {
  otp: string
}

const OtpDisplay = ({ otp }: Props) => {
  const cells = Array(6).fill(null)

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {cells.map((_, index) => (
        <div
          key={index}
          className={`flex h-12 w-10 items-center justify-center rounded-md border-2 ${otp[index] ? "border-primary bg-white" : "border-primary/30 bg-primary/5"} text-primary text-lg font-bold transition-all`}
        >
          {otp[index] || ""}
        </div>
      ))}
    </div>
  )
}

export default OtpDisplay
