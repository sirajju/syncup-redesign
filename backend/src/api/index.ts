import Elysia from "elysia";
import { auth } from "./auth";

const apiVersionOne = new Elysia({ prefix: "/api/v1" }).use(auth);
