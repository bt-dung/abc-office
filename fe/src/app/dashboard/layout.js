import MainLayout from "@/components/mainlayout/main-layout";
import { getSession } from "@/lib/dal";
import { AuthProvider } from "@/auth/use-auth";

export default async function DashboardLayout({ children }) {
    const user = await getSession();
    console.log("DashboardLayout user:", user);

    return (
        <AuthProvider user={user}>
            <MainLayout>{children}</MainLayout>
        </AuthProvider>
    );
}