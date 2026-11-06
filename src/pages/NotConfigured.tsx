import { useNavigate } from 'react-router-dom'
import { BottomNav, Card, CardBody, Button } from '@/components/Layout'
import { ROUTES } from '@/constants/index'

export function NotConfigured() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-text mb-2">PocketBase not configured</h2>
            <p className="text-sm text-muted mb-6">
              Set VITE_POCKETBASE_URL in your .env file (default http://127.0.0.1:8090), then restart the dev server.
            </p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)} className="w-full">Go to Dashboard</Button>
          </CardBody>
        </Card>
      </div>
      <BottomNav activePath="/config" />
    </div>
  )
}
