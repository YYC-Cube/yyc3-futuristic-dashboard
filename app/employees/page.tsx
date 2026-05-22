"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmployeeProfile from "@/components/employee/employee-profile"
import AddEmployeeForm from "@/components/employee/add-employee-form"
import PermissionManagement from "@/components/employee/permission-management"
import GroupManagement from "@/components/employee/group-management"

export default function EmployeesPage() {
  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="bg-muted/50 border-border/50 backdrop-blur-sm">
        <TabsTrigger value="profile">员工档案</TabsTrigger>
        <TabsTrigger value="add">添加员工</TabsTrigger>
        <TabsTrigger value="permissions">权限管理</TabsTrigger>
        <TabsTrigger value="groups">组别管理</TabsTrigger>
      </TabsList>
      <TabsContent value="profile"><EmployeeProfile /></TabsContent>
      <TabsContent value="add"><AddEmployeeForm /></TabsContent>
      <TabsContent value="permissions"><PermissionManagement /></TabsContent>
      <TabsContent value="groups"><GroupManagement /></TabsContent>
    </Tabs>
  )
}
