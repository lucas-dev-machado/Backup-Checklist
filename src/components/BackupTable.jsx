import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Download, Eye, EyeOff } from 'lucide-react';

const BackupTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInactive, setShowInactive] = useState(true);
  const itemsPerPage = 20;

  // Obter valores únicos para filtros
  const locations = [...new Set(data.map(item => item.Localidade))];
  const types = [...new Set(data.map(item => item.Type).filter(Boolean))];

  // Filtrar dados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item['Policies JOBs']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item['Media Server']?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' || item.Localidade === locationFilter;
      const matchesType = typeFilter === 'all' || item.Type === typeFilter;
      
      const isActive = item.Client && item.Client.trim() !== '';
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);
      
      const showItem = showInactive || isActive;

      return matchesSearch && matchesLocation && matchesType && matchesStatus && showItem;
    });
  }, [data, searchTerm, locationFilter, typeFilter, statusFilter, showInactive]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (item) => {
    const isActive = item.Client && item.Client.trim() !== '';
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Ativo" : "Inativo"}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const colors = {
      'MS-Windows': 'bg-blue-100 text-blue-800',
      'MS-SQL-Server': 'bg-green-100 text-green-800',
      'SAP': 'bg-purple-100 text-purple-800',
      'VMware': 'bg-orange-100 text-orange-800',
      'MS-Exchange-Server': 'bg-red-100 text-red-800',
      'NBU-Catalog': 'bg-gray-100 text-gray-800',
      'Standard': 'bg-yellow-100 text-yellow-800',
      'FlashBackup-Windows': 'bg-cyan-100 text-cyan-800'
    };
    
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type || 'N/A'}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ['Localidade', 'Policy/Job', 'Tipo', 'Media Server', 'Storage Unit', 'Cliente', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.Localidade,
        item['Policies JOBs'],
        item.Type,
        item['Media Server'],
        item['Storage Unit'],
        item.Client,
        item.Client && item.Client.trim() !== '' ? 'Ativo' : 'Inativo'
      ].map(field => `"${field || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'backup_checklist.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Jobs de Backup</CardTitle>
        <CardDescription>
          Visualize e gerencie todas as políticas de backup configuradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por policy, cliente ou servidor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Localidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as localidades</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2"
          >
            {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showInactive ? 'Ocultar Inativos' : 'Mostrar Inativos'}
          </Button>

          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Informações de resultados */}
        <div className="mb-4 text-sm text-muted-foreground">
          Mostrando {paginatedData.length} de {filteredData.length} jobs
          {filteredData.length !== data.length && ` (filtrado de ${data.length} total)`}
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Localidade</TableHead>
                <TableHead>Policy/Job</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Media Server</TableHead>
                <TableHead>Storage Unit</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.Localidade}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item['Policies JOBs']}>
                    {item['Policies JOBs']}
                  </TableCell>
                  <TableCell>{getTypeBadge(item.Type)}</TableCell>
                  <TableCell>{item['Media Server']}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={item['Storage Unit']}>
                    {item['Storage Unit'] || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={item.Client}>
                    {item.Client || 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackupTable;

