import NextImage from "@/components/NextImage";

export default function Home() {
  return (
    <main className="flex h-screen flex items-center justify-center bg-white">
      <NextImage
        width={552}
        height={388}
        src={"/myits-event.png"}
        alt="myITS Event"
        className="flex max-w-1/2 items-center mx-auto"
      />
    </main>
  );
}
