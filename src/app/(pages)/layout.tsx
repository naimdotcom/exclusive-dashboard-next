"use client";
import { AppSidebar } from "@/components/app-sidebar";
import ReduxProvider from "@/components/common/ReduxProvider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  return (
    <>
      <ReduxProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {pathSegments.map((segment, index) => {
                      const href =
                        "/" + pathSegments.slice(0, index + 1).join("/");
                      const isLast = index === pathSegments.length - 1;

                      return (
                        <div
                          className="flex items-center justify-center"
                          key={href}
                        >
                          {index > 0 && (
                            <BreadcrumbSeparator key={`sep-${index}`} />
                          )}
                          <BreadcrumbItem key={href}>
                            {isLast ? (
                              <BreadcrumbPage>
                                {decodeURIComponent(segment)}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={href}>
                                {decodeURIComponent(segment)}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </div>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ReduxProvider>
    </>
  );
}
