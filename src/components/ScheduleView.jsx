import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Calendar, Filter } from 'lucide-react';

const ScheduleView = ({ data }) => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDay, setSelectedDay] = useState('weekdays');

  const locations = [...new Set(data.map(item => item.Localidade))];

  // Horários disponíveis
  const weekdayHours = ['19:00', '20:00', '21:00', '22:00', '23:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'];
  const weekendHours = ['19:00', '20:00', '21:00', '22:00', '23:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const currentHours = selectedDay === 'weekdays' ? weekdayHours : weekendHours;

  // Filtrar dados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesLocation = selectedLocation === 'all' || item.Localidade === selectedLocation;
      const hasSchedule = item.Client && item.Client.trim() !== '';
      return matchesLocation && hasSchedule;
    });
  }, [data, selectedLocation]);

  // Obter jobs agendados para um horário específico
  const getJobsForHour = (hour) => {
    const scheduleKey = selectedDay === 'weekdays' ? 'Janela de Backup Diário (Seg-Qui)' : 'Janela de Backup Diário (Sex-Sab)';
    
    return filteredData.filter(item => {
      const schedule = item[scheduleKey];
      return schedule && schedule[hour] && schedule[hour].trim() !== '';
    });
  };

  // Obter cor baseada na quantidade de jobs
  const getIntensityColor = (jobCount) => {
    if (jobCount === 0) return 'bg-gray-100 text-gray-400';
    if (jobCount <= 2) return 'bg-green-100 text-green-800 border-green-200';
    if (jobCount <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (jobCount <= 10) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  // Estatísticas de horários
  const scheduleStats = useMemo(() => {
    const stats = {};
    currentHours.forEach(hour => {
      const jobs = getJobsForHour(hour);
      stats[hour] = {
        count: jobs.length,
        types: [...new Set(jobs.map(job => job.Type).filter(Boolean))],
        locations: [...new Set(jobs.map(job => job.Localidade))]
      };
    });
    return stats;
  }, [filteredData, selectedDay, currentHours]);

  // Encontrar horários de pico
  const peakHours = useMemo(() => {
    const hourCounts = Object.entries(scheduleStats).map(([hour, stats]) => ({
      hour,
      count: stats.count
    }));
    const maxCount = Math.max(...hourCounts.map(h => h.count));
    return hourCounts.filter(h => h.count === maxCount && h.count > 0);
  }, [scheduleStats]);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visualização de Horários de Backup
          </CardTitle>
          <CardDescription>
            Visualize a distribuição de jobs de backup ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecionar localidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as localidades</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekdays">Segunda a Quinta</SelectItem>
                <SelectItem value="weekends">Sexta a Sábado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de pico */}
      {peakHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {peakHours.map(({ hour, count }) => (
                <Badge key={hour} variant="destructive" className="text-sm">
                  {hour} ({count} jobs)
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Horários com maior concentração de jobs de backup
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grade de horários */}
      <Card>
        <CardHeader>
          <CardTitle>Grade de Horários</CardTitle>
          <CardDescription>
            {selectedDay === 'weekdays' ? 'Segunda a Quinta-feira' : 'Sexta-feira a Sábado'}
            {selectedLocation !== 'all' && ` - ${selectedLocation}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {currentHours.map(hour => {
              const jobCount = scheduleStats[hour]?.count || 0;
              const types = scheduleStats[hour]?.types || [];
              const locations = scheduleStats[hour]?.locations || [];
              
              return (
                <div
                  key={hour}
                  className={`p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${getIntensityColor(jobCount)}`}
                  title={`${hour}: ${jobCount} jobs\nTipos: ${types.join(', ')}\nLocalidades: ${locations.join(', ')}`}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{hour}</div>
                    <div className="text-sm font-medium">{jobCount} jobs</div>
                    {types.length > 0 && (
                      <div className="text-xs mt-1 opacity-75">
                        {types.slice(0, 2).join(', ')}
                        {types.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Legenda de Intensidade:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                <span>0 jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border-green-200 border rounded"></div>
                <span>1-2 jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border-yellow-200 border rounded"></div>
                <span>3-5 jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border-orange-200 border rounded"></div>
                <span>6-10 jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-red-200 border rounded"></div>
                <span>10+ jobs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista detalhada por horário */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentHours.map(hour => {
              const jobs = getJobsForHour(hour);
              if (jobs.length === 0) return null;

              return (
                <div key={hour} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {hour}
                    </h4>
                    <Badge variant="outline">{jobs.length} jobs</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {jobs.map((job, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        <div className="font-medium truncate" title={job['Policies JOBs']}>
                          {job['Policies JOBs']}
                        </div>
                        <div className="text-muted-foreground">
                          {job.Type} - {job.Client}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleView;

