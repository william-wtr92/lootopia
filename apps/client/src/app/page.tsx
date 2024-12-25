import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lootopia/ui"

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-4xl font-bold">Lootopia WIP 🚧</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Lootopia?</AccordionTrigger>
          <AccordionContent>
            Lootopia is an innovative platform, structured as an immersive
            ecosystem, dedicated to the participation and organisation of
            treasure hunts.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Lootopia comes with styles?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with a minimal set of styles, but you can easily
            override them.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is the accordion animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
