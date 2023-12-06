import { ModeToggle } from "./components/themeToggle";

export default function Home() {
  return (
    <main className="flex w-fit min-h-screen p-24 mx-auto content-center">
      <div className="flex justify-between gap-x-2 h-fit w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl items-center">
          How much ah
        </h1>
        <div className="self-center">
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}
