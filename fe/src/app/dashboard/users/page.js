import { beJson } from "@/lib/api";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  let users = [];
  let loadError = null;

  try {
    users = await beJson("/users");
  } catch (err) {
    loadError = err.message;
  }

  return <UsersClient initialUsers={users} loadError={loadError} />;
}
