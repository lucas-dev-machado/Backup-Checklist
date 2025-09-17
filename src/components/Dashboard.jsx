import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = ({ data }) => {
  // Processar dados para gráficos
  const locationStats = data.reduce((acc, item) => {
    const location = item.Localidade;
    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location]++;
    return acc;
  }, {});

  const locationData = Object.entries(locationStats).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / data.length) * 100).toFixed(1)
  }));

  const typeStats = data.reduce((acc, item) => {
    const type = item.Type || 'Não especificado';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, {});

  const typeData = Object.entries(typeStats).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / data.length) * 100).toFixed(1)
  }));

  const serverStats = data.reduce((acc, item) => {
    const server = item['Media Server'] || 'Não especificado';
    if (!acc[server]) {
      acc[server] = 0;
    }
    acc[server]++;
    return acc;
  }, {});

  const serverData = Object.entries(serverStats).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];

  const totalJobs = data.length;
  const activeJobs = data.filter(item => item.Client && item.Client.trim() !== '').length;
  const inactiveJobs = totalJobs - activeJobs;

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jobs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Políticas de backup configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {((activeJobs / totalJobs) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Inativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inactiveJobs}</div>
            <p className="text-xs text-muted-foreground">
              {((inactiveJobs / totalJobs) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidores</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(serverStats).length}</div>
            <p className="text-xs text-muted-foreground">
              Media servers configurados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Localidades */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Localidade</CardTitle>
            <CardDescription>
              Quantidade de jobs de backup por localidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Jobs']}
                  labelFormatter={(label) => `Localidade: ${label}`}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Tipos */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Backup</CardTitle>
            <CardDescription>
              Distribuição dos tipos de tecnologia de backup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Servidores */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Jobs por Media Server</CardTitle>
            <CardDescription>
              Distribuição de jobs por servidor de backup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serverData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [value, 'Jobs']}
                  labelFormatter={(label) => `Servidor: ${label}`}
                />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Tipos */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Tipo de Tecnologia</CardTitle>
          <CardDescription>
            Detalhamento das tecnologias de backup utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {typeData.map((type, index) => (
              <Badge 
                key={type.name} 
                variant="outline" 
                className="text-sm"
                style={{ 
                  borderColor: COLORS[index % COLORS.length],
                  color: COLORS[index % COLORS.length]
                }}
              >
                {type.name}: {type.value} jobs ({type.percentage}%)
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

