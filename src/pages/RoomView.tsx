import { useAcademic } from '@/context/AcademicContext';
import { TimetableGrid } from '@/components/TimetableGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RoomView() {
  const { activeRecords, rooms } = useAcademic();
  const usedRooms = rooms.filter(r => activeRecords.some(rec => rec.roomCode === r.code));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Room Timetables</h1>
        <p className="text-sm text-muted-foreground mt-1">{usedRooms.length} rooms in use</p>
      </div>

      {usedRooms.length > 0 && (
        <Tabs defaultValue={String(usedRooms[0]?.code)} className="space-y-4">
          <TabsList className="bg-secondary/50">
            {usedRooms.map(room => (
              <TabsTrigger key={room.code} value={String(room.code)}>{room.name}</TabsTrigger>
            ))}
          </TabsList>
          {usedRooms.map(room => {
            const roomRecords = activeRecords.filter(r => r.roomCode === room.code);
            return (
              <TabsContent key={room.code} value={String(room.code)}>
                <TimetableGrid records={roomRecords} title={room.name} subtitle={`${room.type} · ${roomRecords.length} slots`} />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
