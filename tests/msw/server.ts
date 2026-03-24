import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Setup MSW server for Node.js tests (Vitest/Jest)
export const server = setupServer(...handlers);

