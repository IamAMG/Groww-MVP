import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { Profile } from '@/pages/Profile'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { ResetPassword } from '@/pages/ResetPassword'
import { Diagnostic } from '@/pages/Diagnostic'
import { Compass } from '@/pages/Compass'
import { GoalTracker } from '@/pages/GoalTracker'
import { Flex } from '@/pages/Flex'
import { Resolution } from '@/pages/Resolution'
import { EvidenceLog } from '@/pages/EvidenceLog'
import { Evaluations } from '@/pages/Evaluations'
import { KnowledgeBase } from '@/pages/KnowledgeBase'
import { NotConfigured } from '@/pages/NotConfigured'
import { AuthProvider } from '@/context/AuthContext'
import { ROUTES } from '@/constants/index'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.SIGNUP, element: <SignUp /> },
  { path: ROUTES.PROFILE, element: <Profile /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTES.DIAGNOSTIC, element: <Diagnostic /> },
  { path: ROUTES.COMPASS, element: <Compass /> },
  { path: ROUTES.GOAL, element: <GoalTracker /> },
  { path: ROUTES.FLEX, element: <Flex /> },
  { path: ROUTES.RESOLUTION, element: <Resolution /> },
  { path: ROUTES.EVIDENCE, element: <EvidenceLog /> },
  { path: ROUTES.EVALUATIONS, element: <Evaluations /> },
  { path: ROUTES.KB, element: <KnowledgeBase /> },
  { path: '/config', element: <NotConfigured /> },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
