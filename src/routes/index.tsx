import { createFileRoute } from "@tanstack/react-router";
import InputPage from "@/pages/InputPage";

export const Route = createFileRoute("/")({
  component: InputPage,
});
