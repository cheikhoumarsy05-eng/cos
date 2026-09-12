import HomePage from "../../(frontend)/components/HomePage";

export const revalidate = 3600;

export default function Page() {
  return <HomePage locale="en" />;
}
