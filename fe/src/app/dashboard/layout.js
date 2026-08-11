import MainLayout from "@/components/mainlayout/main-layout";
import { getSession } from "@/lib/dal";

export default async function DashboardLayout({ children }) {
    const user = await getSession();
    console.log("DashboardLayout user:", user);
    return <MainLayout user={user}>{children}</MainLayout>;
}
