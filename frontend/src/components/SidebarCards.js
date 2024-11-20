import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function SidebarCards({ dashboardData, activeTab }) {
  const renderReachCard = () => (
    <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 m-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">Total Reach</h3>
        <ChartBarIcon className="w-6 h-6 text-blue-500" />
      </div>
      <p className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">
        {dashboardData?.totalReach.total.toLocaleString()}
      </p>
      <div className="space-y-1 mt-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Facebook</span>
          <span className="text-blue-500">{dashboardData?.totalReach.facebook.toLocaleString()}</span>
        </div>
        {/* Add other metrics similarly */}
      </div>
    </motion.div>
  )

  // Add similar render functions for other card types

  const renderContent = () => {
    switch (activeTab) {
      case 'reach':
        return renderReachCard()
      case 'engagement':
        return renderEngagementCard()
      case 'sentiment':
        return renderSentimentCard()
      default:
        return null
    }
  }

  return (
    <div className="p-2">
      {renderContent()}
    </div>
  )
}
