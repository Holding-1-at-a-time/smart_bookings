/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 23:18:56
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminOverviewPage({
  params,
}: {
  params: { organizationId: string }
}) {
  const bookings = useQuery(api.bookings.list, { organizationId: params.organizationId })
  const revenue = useQuery(api.analytics.getRevenue, { organizationId: params.organizationId })
  const customers = useQuery(api.customers.list, { organizationId: params.organizationId })

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings ? (
              <div className="text-2xl font-bold">{bookings.length}</div>
            ) : (
              <Skeleton className="h-8 w-[100px]" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue ? (
              <div className="text-2xl font-bold">${revenue.toFixed(2)}</div>
            ) : (
              <Skeleton className="h-8 w-[100px]" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {customers ? (
              <div className="text-2xl font-bold">{customers.length}</div>
            ) : (
              <Skeleton className="h-8 w-[100px]" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            