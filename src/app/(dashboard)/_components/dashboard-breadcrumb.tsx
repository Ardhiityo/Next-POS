"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export function DashboardBreadcrumb() {
  const path = usePathname(); // = '/admin/user'

  const pathSplit = path.split("/"); // = [ '', 'admin', 'user' ]

  const pathFormatted = pathSplit.slice(1, pathSplit.length); // =   [ 'admin', 'user' ]

  return (
    <Breadcrumb>
      <BreadcrumbList className="capitalize">
        {pathFormatted.map((path, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {index + 1 === pathFormatted.length ? (
                <BreadcrumbPage>
                  <p className="text-wrap">
                    {path}
                  </p>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${pathFormatted.slice(0, index + 1).join("/")}`}
                >
                  <p className="text-wrap">
                    {path}
                  </p>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index + 1 < pathFormatted.length && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
