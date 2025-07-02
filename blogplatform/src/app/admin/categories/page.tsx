import { CategoryManagement } from '@/components/admin/category-management'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your blog categories and organize your content
        </p>
      </div>
      
      <CategoryManagement />
    </div>
  )
}
