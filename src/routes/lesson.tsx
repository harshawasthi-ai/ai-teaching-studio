import { createFileRoute } from "@tanstack/react-router";
import OutputPage from "@/pages/OutputPage";

export const Route = createFileRoute("/lesson")({
  component: OutputPage,
});
