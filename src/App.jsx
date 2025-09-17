import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Search, Filter, Database, Server, Clock, CheckCircle, AlertCircle, TrendingUp, Activity } from 'lucide-react'
import backupData from './assets/backup_data.json'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setData(backupData)
    setFilteredData(backupData)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let filtered = data.filter(item => {
      const matchesSearch = (item['Policies JOBs'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.Client || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = selectedLocation === 'all' || item.Localidade === selectedLocation
      const matchesType = selectedType === 'all' || item.Type === selectedType
      return matchesSearch && matchesLocation && matchesType
    })
    setFilteredData(filtered)
  }, [data, searchTerm, selectedLocation, selectedType])

  // Estatísticas para os gráficos
  const locationStats = data.reduce((acc, item) => {
    acc[item.Localidade] = (acc[item.Localidade] || 0) + 1
    return acc
  }, {})

  const typeStats = data.reduce((acc, item) => {
    acc[item.Type] = (acc[item.Type] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(locationStats).map(([name, value]) => ({ name, value }))
  const typeChartData = Object.entries(typeStats).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const getTypeColor = (type) => {
    const colors = {
      'MS-Windows': 'bg-blue-500',
      'MS-SQL-Server': 'bg-green-500',
      'SAP': 'bg-yellow-500',
      'VMware': 'bg-purple-500',
      'MS-Exchange-Server': 'bg-red-500',
      'NBU-Catalog': 'bg-gray-500',
      'Standard': 'bg-indigo-500',
      'FlashBackup-Windows': 'bg-pink-500'
    }
    return colors[type] || 'bg-gray-400'
  }

  const getStatusColor = (hasClient) => {
    return hasClient ? 'text-green-600' : 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sistema de Controle e Monitoramento de Backup
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitoramento em tempo real • {currentTime.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Activity className="h-3 w-3 mr-1" />
                Sistema Ativo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total de Políticas</p>
                  <p className="text-3xl font-bold">{data.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Localidades</p>
                  <p className="text-3xl font-bold">{Object.keys(locationStats).length}</p>
                </div>
                <Server className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Tipos de Backup</p>
                  <p className="text-3xl font-bold">{Object.keys(typeStats).length}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Clientes Ativos</p>
                  <p className="text-3xl font-bold">{data.filter(item => item.Client).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="policies">Políticas de Backup</TabsTrigger>
            <TabsTrigger value="schedule">Cronograma</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Distribuição por Localidade</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Tipos de Backup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar políticas ou clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar localidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as localidades</SelectItem>
                      {Object.keys(locationStats).map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {Object.keys(typeStats).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Políticas */}
            <div className="grid grid-cols-1 gap-4">
              {filteredData.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item['Policies JOBs']}
                          </h3>
                          <Badge className={`${getTypeColor(item.Type)} text-white`}>
                            {item.Type}
                          </Badge>
                          <Badge variant="outline">
                            {item.Localidade}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Media Server:</span> {item['Media Server']}
                          </div>
                          <div>
                            <span className="font-medium">Storage Unit:</span> {item['Storage Unit'] || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">SLP:</span> {item.SLP || 'N/A'}
                          </div>
                        </div>
                        {item.Client && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Cliente:</span> 
                            <span className={getStatusColor(item.Client)}> {item.Client}</span>
                          </div>
                        )}
                        {item['Backup Selections'] && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Seleções de Backup:</span> {item['Backup Selections']}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.Client ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Cronograma de Backup</span>
                </CardTitle>
                <CardDescription>
                  Visualização das janelas de backup por horário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Cronograma em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A visualização detalhada do cronograma de backup será implementada em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

