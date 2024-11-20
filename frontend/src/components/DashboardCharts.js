import React from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export const TotalReachChart = ({ data }) => {
  const chartData = [
    { name: 'Facebook', value: data?.facebook || 0 },
    { name: 'Twitter', value: data?.twitter || 0 },
    { name: 'Instagram', value: data?.instagram || 0 }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#6366F1']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export const EngagementRateChart = ({ data }) => {
  const chartData = [
    { name: 'Daily', value: data?.engagementRate || 0 },
    { name: 'Weekly', value: data?.weeklyGrowth || 0 },
    { name: 'Monthly', value: data?.monthlyAverage || 0 }
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const SentimentPieChart = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data?.positive || 0 },
    { name: 'Neutral', value: data?.neutral || 0 },
    { name: 'Negative', value: data?.negative || 0 }
  ]

  const COLORS = ['#10B981', '#F59E0B', '#EF4444']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
export const SchemeProgressChart = ({ data }) => {
  const chartData = [
    { name: 'Rural Dev', value: data?.ruralDevelopment || 0 },
    { name: 'Education', value: data?.education || 0 },
    { name: 'Healthcare', value: data?.healthcare || 0 }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}



export const OppositionPerformanceChart = ({ data }) => {
  const chartData = [
    { name: 'Active Campaigns', value: data?.activeCampaigns || 0 },
    { name: 'Critical Posts', value: data?.criticalPosts || 0 },
    { name: 'Response Rate', value: data?.responseRate || 0 }
  ]

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export const PostsDistributionChart = ({ data }) => {
  const chartData = [
    { name: 'Development', value: data?.development || 0 },
    { name: 'Infrastructure', value: data?.infrastructure || 0 },
    { name: 'Youth Program', value: data?.youth || 0 }
  ]

  const COLORS = ['#00C49F', '#0088FE', '#FFBB28']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
