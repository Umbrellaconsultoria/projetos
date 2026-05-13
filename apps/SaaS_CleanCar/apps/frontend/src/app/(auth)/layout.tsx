import { Sidebar } from "@/components/layout/Sidebar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />
            <main style={{ marginLeft: 'var(--sidebar-width)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
        </>
    );
}
