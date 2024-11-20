'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { 
  TotalReachChart, 
  EngagementRateChart, 
  SentimentPieChart,
  SchemeProgressChart,
  OppositionPerformanceChart,
  PostsDistributionChart
 
} from '../components/DashboardCharts'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, ChartBarIcon, ChatBubbleLeftIcon, 
  DocumentDuplicateIcon, EyeIcon, UserGroupIcon,
  VideoCameraIcon, ChartPieIcon, GlobeAltIcon,
  LanguageIcon, MagnifyingGlassIcon, BellIcon,
  SunIcon, MoonIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowTrendingUpIcon,
  TabsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'



const sidebarItems = [
  { 
    name: 'Home', 
    icon: HomeIcon, 
    badge: null, 
    path: '/' ,
    cards: ['totalReach', 'engagement', 'sentiment', 'performance','posts','opposition','schemes']},
  { 
    name: 'Reach Analytics', 
    icon: ChartBarIcon, 
    badge: null, 
    path: '/reach',
    cards: ['totalReach', 'engagement']
  },
  { 
    name: 'Engagement Metrics', 
    icon: Squares2X2Icon, 
    badge: null, 
    path: '/engagement',
    cards: ['performance', 'posts', 'schemes'] 
  },
  { 
    name: 'Sentiment Analysis', 
    icon: ChartPieIcon, 
    badge: null, 
    path: '/sentiment',
    cards: ['sentiment', 'opposition']
  },
  { name: 'Content Distribution', icon: ChartBarIcon,  path: '/content',cards: ['posts', 'opposition'] },
  { name: 'Feedback Analysis', icon: ChatBubbleLeftIcon,  path: '/feedback',cards: ['sentiment', 'performance'] },
  { name: 'Content Comparison', icon: DocumentDuplicateIcon, bath: '/monitoring',cards: ['totalReach', 'opposition'] },
  { name: 'Party & Positive Content', icon: UserGroupIcon, path: '/party-content' },
  { name: 'Interactive Shows', icon: VideoCameraIcon,  path: '/shows' },
  { name: 'Campaign Insights', icon: GlobeAltIcon, path: '/insights' },
  { name: 'Multilingual Speech & AI', icon: LanguageIcon,  path: '/multilingual' }
]


export default function Dashboard() {
  const [notifications, setNotifications] = useState([])
  const [flippedCards, setFlippedCards] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const [activeCards, setActiveCards] = useState(['totalReach', 'engagement', 'sentiment', 'performance'])
  
  
  const pathname = usePathname()

  const handleCardExpand = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }
  
  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)

  const handleCardFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  useEffect(() => {
    setMounted(true)
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const metrics = await loadDashboardData()
        setDashboardData(metrics)
        
        // Also fetch notifications
        const response = await fetch('http://127.0.0.1:8000/api/notifications')
        const notifData = await response.json()
        setNotifications(notifData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  const clearNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed)

  const userMenuItems = [
    { 
      icon: UserIcon, 
      label: 'Profile', 
      action: () => {
        window.location.href = '/profile'
      }
    },
    { 
      icon: Cog6ToothIcon, 
      label: 'Settings', 
      action: () => {
        window.location.href = '/settings'
      }
    },
    { 
      icon: ArrowRightOnRectangleIcon, 
      label: 'Logout', 
      action: () => {
        // Handle logout
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    },
  ]
  const handleSidebarItemClick = (item) => {
   setActiveCards(item.cards || [ 'totalReach', 
    'engagement', 
    'sentiment', 
    'performance'])
  }
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <motion.div 
        className="bg-white dark:bg-gray-800 shadow-lg transition-all duration-200"
        animate={{ width: isHovered ? 256 : 80 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${!isHovered ? 'hidden' : 'block'}`}>
            DASHBOARD
          </h1>
        </div>
        <nav className="mt-4">
  {sidebarItems.map((item, index) => (
    <motion.div
      key={index}
      href={item.path}
      onClick={() => handleSidebarItemClick(item)}
      className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 relative group transition-all duration-200 ${
        pathname === item.path ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''
      }`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        whileHover={{ rotate: 10 }}
        className="flex items-center"
      >
        <item.icon className={`w-5 h-5 mr-3 ${
        pathname === item.path ? 'text-blue-500' : ''
        }`} />
      </motion.div>
      
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={pathname === item.path ? 'text-blue-500 font-medium' : ''}
        >
          {item.name}
        </motion.span>
      )}
      
      {item.badge && (
        <motion.span 
          className={`absolute right-2 ${
            item.badge === 'New' ? 'bg-green-500' :
            item.badge === 'Live' ? 'bg-red-500' :
            item.badge === 'Beta' ? 'bg-purple-500' :
            'bg-blue-500'
          } text-white text-xs px-2 py-1 rounded-full`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          {item.badge}
        </motion.span>
      )}
      
      {!isHovered && (
        <motion.div 
          className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded-md hidden group-hover:block z-50 whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {item.name}
          {item.badge && (
            <span className="ml-2 text-xs">
              ({item.badge})
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  ))}
</nav>
<div className="border-t dark:border-gray-700 mt-auto">
    <div className={`p-4 ${!isHovered ? 'hidden' : 'block'}`}>
      
    </div>
    
    <div className={`${isHovered ? 'h-96' : 'h-0'} transition-all duration-200 overflow-hidden`}>
      
    </div>
  </div>
      </motion.div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center w-96">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {mounted && (
                <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 5 }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SunIcon className="w-6 h-6 text-yellow-500 transform transition-transform" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoonIcon className="w-6 h-6 text-gray-600 transform transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              )}
              <div ref={notificationRef} className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <BellIcon className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                    >
                      {notifications.length}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="font-semibold dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium dark:text-white">{notif.title}</h4>
                              <button 
                                onClick={() => clearNotification(notif.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                              >
                                ×
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
                            <span className="text-xs text-gray-500">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div ref={userMenuRef} className="relative">
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src="/avatar-placeholder.png"
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <div className="text-sm dark:text-gray-300">
                    <p className="font-semibold">Admin User</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Administrator</p>
                  </div>
                </div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
                    >
                      {userMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={item.action}
                          className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {activeCards.includes('totalReach') && (
          <motion.div
              layout
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'totalReach' ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              onClick={() => handleCardExpand('totalReach')}
            >

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold dark:text-white">Total Reach</h3>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-4 text-blue-600 dark:text-blue-400">
              {dashboardData?.totalReach.total.toLocaleString()}
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Facebook</span>
                <span className="text-blue-500">{dashboardData?.totalReach.facebook.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Twitter</span>
                <span className="text-blue-500">{dashboardData?.totalReach.twitter.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Instagram</span>
                <span className="text-blue-500">{dashboardData?.totalReach.instagram.toLocaleString()}</span>
              </div>
            </div>
            
          
            <motion.div className="flex items-center mt-2 text-sm">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">12% increase from last week</span>
            </motion.div>
            <div className="mt-4">
              <TotalReachChart data={dashboardData?.totalReach} />
            </div>
          </motion.div>
          )}
          
          {activeCards.includes('engagement') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'engagement' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('engagement')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Engagement Rate</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <p className="text-3xl font-bold mt-4 text-purple-600 dark:text-purple-400">
              {dashboardData?.engagementRate}%
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${dashboardData?.engagementRate}%` }}
              ></div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Daily Rate</span>
                <span className="text-purple-500">{dashboardData?.engagementRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Weekly Growth</span>
                <span className="text-purple-500">+{dashboardData?.weeklyGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Monthly Average</span>
                <span className="text-purple-500">{dashboardData?.monthlyAverage}%</span>
              </div>
            </div>
            <div className="mt-4">
              <EngagementRateChart data={dashboardData} />
            </div>
          </motion.div>
          )}
          {activeCards.includes('sentiment') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'sentiment' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('sentiment')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Sentiment</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <p className="text-3xl font-bold mt-4 text-green-600 dark:text-green-400">
              {dashboardData?.sentiment.positive}%
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Positive Mentions</span>
                <span className="text-green-500">{dashboardData?.sentiment.positive}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Neutral Feedback</span>
                <span className="text-yellow-500">{dashboardData?.sentiment.neutral}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Critical Reviews</span>
                <span className="text-red-500">{dashboardData?.sentiment.negative}%</span>
              </div>
            </div>
            <div className="mt-4">
              <SentimentPieChart data={dashboardData?.sentiment} />
            </div>
          </motion.div>
          )}
          {activeCards.includes('opposition') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'opposition' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('opposition')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Opposition</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <p className="text-3xl font-bold mt-4 text-orange-600 dark:text-orange-400">
              {dashboardData?.oppositionContent.total}
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Active Campaigns</span>
                <span className="text-orange-500">{dashboardData?.oppositionContent.activeCampaigns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Critical Posts</span>
                <span className="text-orange-500">{dashboardData?.oppositionContent.criticalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Response Rate</span>
                <span className="text-orange-500">{dashboardData?.oppositionContent.responseRate}%</span>
              </div>
            </div>
            <div className="mt-4">
      <OppositionPerformanceChart data={dashboardData?.oppositionContent} />
    </div>
          </motion.div>
          )}
          {activeCards.includes('performance') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'performance' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('performance')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Performance</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <p className="text-3xl font-bold mt-4 text-indigo-600 dark:text-indigo-400">
              {dashboardData?.performanceIndex}%
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Overall Score</span>
                <span className="text-indigo-500">{dashboardData?.performanceIndex}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Response Time</span>
                <span className="text-indigo-500">{dashboardData?.averageResponseTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Engagement Quality</span>
                <span className="text-indigo-500">{dashboardData?.engagementQuality}%</span>
              </div>
            </div>
            
          </motion.div>
            )}
        {activeCards.includes('posts') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'posts' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('posts')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Posts</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm dark:text-gray-300">Development Initiative Post</p>
                <span className="text-teal-500">{dashboardData?.topPosts.development}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm dark:text-gray-300">Infrastructure Update</p>
                <span className="text-teal-500">{dashboardData?.topPosts.infrastructure}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm dark:text-gray-300">Youth Program Launch</p>
                <span className="text-teal-500">{dashboardData?.topPosts.youth}</span>
              </div>
            </div>
            <div className="mt-4">
      <PostsDistributionChart data={dashboardData?.topPosts} />
    </div>
          </motion.div>
            )}
          {activeCards.includes('schemes') && (
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              expandedCard === 'schemes' ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => handleCardExpand('schemes')}
          >
            <div className='flex items-center justify-between'> 
              <h3 className="text-xl font-semibold dark:text-white">Schemes</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-gray-300">Rural Development</span>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">{dashboardData?.schemes.ruralDevelopment}%</span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${dashboardData?.schemes.ruralDevelopment}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-gray-300">Education</span>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">{dashboardData?.schemes.education}%</span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${dashboardData?.schemes.education}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-gray-300">Healthcare</span>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">{dashboardData?.schemes.healthcare}%</span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${dashboardData?.schemes.healthcare}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
      <SchemeProgressChart data={dashboardData?.schemes} />
    </div>
          </motion.div> 
          )}           
          </div>
        </main>
      </div> 
    </div>
    
  )
}

const loadDashboardData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/dashboard')
    if (!response.ok) throw new Error('Failed to fetch data')
    
    const { data } = await response.json()
    
    return {
      totalReach: {
        facebook: data.total_reach_facebook,
        twitter: data.total_reach_twitter,
        instagram: data.total_reach_instagram,
        total: data.total_reach_facebook + data.total_reach_twitter + data.total_reach_instagram
      },
      engagementRate: data.engagement_rate,
      weeklyGrowth: data.weekly_growth,
      monthlyAverage: data.monthly_average,
      sentiment: {
        positive: data.sentiment_positive,
        neutral: data.sentiment_neutral,
        negative: data.sentiment_negative
      },
      oppositionContent: {
        total: data.opposition_content_total,
        criticalPosts: data.opposition_critical_posts,
        activeCampaigns: data.opposition_active_campaigns,
        responseRate: data.opposition_response_rate
      },
      performanceIndex: data.performance_index,
      averageResponseTime: data.average_response_time,
      engagementQuality: data.engagement_quality,
      topPosts: {
        development: data.top_post_development,
        infrastructure: data.top_post_infrastructure,
        youth: data.top_post_youth
      },
      schemes: {
        ruralDevelopment: data.scheme_rural_development,
        education: data.scheme_education,
        healthcare: data.scheme_healthcare
      }
    }
  } catch (error) {
    console.error('Error loading dashboard metrics:', error)
    return null
  }
}