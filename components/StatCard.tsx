import { Card, CardContent } from "./ui/card";

export default function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      </CardContent>
    </Card>
  )
}