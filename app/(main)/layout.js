import Header from "@/components/Header";

export default function MainAppLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
