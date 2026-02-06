import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Dozenten, Teilnehmer, Raeume, Kurse, Anmeldungen } from '@/types/app';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { GraduationCap, Users, BookOpen, DoorOpen, CreditCard, Plus, Pencil, Trash2 } from 'lucide-react';

type TabValue = 'kurse' | 'dozenten' | 'teilnehmer' | 'raeume' | 'anmeldungen';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>('kurse');
  const [loading, setLoading] = useState(true);

  // Data states
  const [dozenten, setDozenten] = useState<Dozenten[]>([]);
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>([]);
  const [raeume, setRaeume] = useState<Raeume[]>([]);
  const [kurse, setKurse] = useState<Kurse[]>([]);
  const [anmeldungen, setAnmeldungen] = useState<Anmeldungen[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [d, t, r, k, a] = await Promise.all([
        LivingAppsService.getDozenten(),
        LivingAppsService.getTeilnehmer(),
        LivingAppsService.getRaeume(),
        LivingAppsService.getKurse(),
        LivingAppsService.getAnmeldungen()
      ]);
      setDozenten(d);
      setTeilnehmer(t);
      setRaeume(r);
      setKurse(k);
      setAnmeldungen(a);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper to get name by record URL
  const getDozentName = (url?: string) => {
    if (!url) return '-';
    const id = extractRecordId(url);
    return dozenten.find(d => d.record_id === id)?.fields.name || '-';
  };

  const getTeilnehmerName = (url?: string) => {
    if (!url) return '-';
    const id = extractRecordId(url);
    return teilnehmer.find(t => t.record_id === id)?.fields.name || '-';
  };

  const getRaumName = (url?: string) => {
    if (!url) return '-';
    const id = extractRecordId(url);
    return raeume.find(r => r.record_id === id)?.fields.raumname || '-';
  };

  const getKursTitel = (url?: string) => {
    if (!url) return '-';
    const id = extractRecordId(url);
    return kurse.find(k => k.record_id === id)?.fields.titel || '-';
  };

  // Stats
  const offeneZahlungen = anmeldungen.filter(a => !a.fields.bezahlt).length;
  const offeneBetrag = anmeldungen
    .filter(a => !a.fields.bezahlt)
    .reduce((sum, a) => {
      const kursId = extractRecordId(a.fields.kurs);
      const kurs = kurse.find(k => k.record_id === kursId);
      return sum + (kurs?.fields.preis || 0);
    }, 0);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy', { locale: de });
    } catch {
      return dateStr;
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Kursverwaltung</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Kurse, Dozenten, Teilnehmer und Räume</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{kurse.length}</p>
                  <p className="text-sm text-muted-foreground">Kurse</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-2/10">
                  <GraduationCap className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dozenten.length}</p>
                  <p className="text-sm text-muted-foreground">Dozenten</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-4/10">
                  <Users className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teilnehmer.length}</p>
                  <p className="text-sm text-muted-foreground">Teilnehmer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-3/10">
                  <CreditCard className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{offeneZahlungen}</p>
                  <p className="text-sm text-muted-foreground">Offene Zahlungen</p>
                  {offeneBetrag > 0 && (
                    <p className="text-xs text-chart-3 font-medium">{offeneBetrag.toFixed(2)} EUR</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-border shadow-sm">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                  <TabsTrigger value="kurse" className="text-xs sm:text-sm">Kurse</TabsTrigger>
                  <TabsTrigger value="dozenten" className="text-xs sm:text-sm">Dozenten</TabsTrigger>
                  <TabsTrigger value="teilnehmer" className="text-xs sm:text-sm">Teilnehmer</TabsTrigger>
                  <TabsTrigger value="raeume" className="text-xs sm:text-sm">Räume</TabsTrigger>
                  <TabsTrigger value="anmeldungen" className="text-xs sm:text-sm">Anmeldungen</TabsTrigger>
                </TabsList>
                <Button onClick={openAddDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Hinzufügen
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Kurse Tab */}
              <TabsContent value="kurse" className="mt-0">
                <KurseTable
                  kurse={kurse}
                  getDozentName={getDozentName}
                  getRaumName={getRaumName}
                  formatDate={formatDate}
                  onEdit={openEditDialog}
                  onDelete={async (id) => {
                    await LivingAppsService.deleteKurseEntry(id);
                    loadData();
                  }}
                />
              </TabsContent>

              {/* Dozenten Tab */}
              <TabsContent value="dozenten" className="mt-0">
                <DozentenTable
                  dozenten={dozenten}
                  onEdit={openEditDialog}
                  onDelete={async (id) => {
                    await LivingAppsService.deleteDozentenEntry(id);
                    loadData();
                  }}
                />
              </TabsContent>

              {/* Teilnehmer Tab */}
              <TabsContent value="teilnehmer" className="mt-0">
                <TeilnehmerTable
                  teilnehmer={teilnehmer}
                  formatDate={formatDate}
                  onEdit={openEditDialog}
                  onDelete={async (id) => {
                    await LivingAppsService.deleteTeilnehmerEntry(id);
                    loadData();
                  }}
                />
              </TabsContent>

              {/* Räume Tab */}
              <TabsContent value="raeume" className="mt-0">
                <RaeumeTable
                  raeume={raeume}
                  onEdit={openEditDialog}
                  onDelete={async (id) => {
                    await LivingAppsService.deleteRaeumeEntry(id);
                    loadData();
                  }}
                />
              </TabsContent>

              {/* Anmeldungen Tab */}
              <TabsContent value="anmeldungen" className="mt-0">
                <AnmeldungenTable
                  anmeldungen={anmeldungen}
                  getTeilnehmerName={getTeilnehmerName}
                  getKursTitel={getKursTitel}
                  formatDate={formatDate}
                  onEdit={openEditDialog}
                  onDelete={async (id) => {
                    await LivingAppsService.deleteAnmeldungenEntry(id);
                    loadData();
                  }}
                  onToggleBezahlt={async (item) => {
                    await LivingAppsService.updateAnmeldungenEntry(item.record_id, {
                      bezahlt: !item.fields.bezahlt
                    });
                    loadData();
                  }}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Bearbeiten' : 'Neu hinzufügen'} - {
                  activeTab === 'kurse' ? 'Kurs' :
                  activeTab === 'dozenten' ? 'Dozent' :
                  activeTab === 'teilnehmer' ? 'Teilnehmer' :
                  activeTab === 'raeume' ? 'Raum' : 'Anmeldung'
                }
              </DialogTitle>
            </DialogHeader>

            {activeTab === 'kurse' && (
              <KursForm
                dozenten={dozenten}
                raeume={raeume}
                editingItem={editingItem}
                onSubmit={async (data) => {
                  if (editingItem) {
                    await LivingAppsService.updateKurseEntry(editingItem.record_id, data);
                  } else {
                    await LivingAppsService.createKurseEntry(data);
                  }
                  setDialogOpen(false);
                  loadData();
                }}
              />
            )}

            {activeTab === 'dozenten' && (
              <DozentForm
                editingItem={editingItem}
                onSubmit={async (data) => {
                  if (editingItem) {
                    await LivingAppsService.updateDozentenEntry(editingItem.record_id, data);
                  } else {
                    await LivingAppsService.createDozentenEntry(data);
                  }
                  setDialogOpen(false);
                  loadData();
                }}
              />
            )}

            {activeTab === 'teilnehmer' && (
              <TeilnehmerForm
                editingItem={editingItem}
                onSubmit={async (data) => {
                  if (editingItem) {
                    await LivingAppsService.updateTeilnehmerEntry(editingItem.record_id, data);
                  } else {
                    await LivingAppsService.createTeilnehmerEntry(data);
                  }
                  setDialogOpen(false);
                  loadData();
                }}
              />
            )}

            {activeTab === 'raeume' && (
              <RaumForm
                editingItem={editingItem}
                onSubmit={async (data) => {
                  if (editingItem) {
                    await LivingAppsService.updateRaeumeEntry(editingItem.record_id, data);
                  } else {
                    await LivingAppsService.createRaeumeEntry(data);
                  }
                  setDialogOpen(false);
                  loadData();
                }}
              />
            )}

            {activeTab === 'anmeldungen' && (
              <AnmeldungForm
                teilnehmer={teilnehmer}
                kurse={kurse}
                editingItem={editingItem}
                onSubmit={async (data) => {
                  if (editingItem) {
                    await LivingAppsService.updateAnmeldungenEntry(editingItem.record_id, data);
                  } else {
                    await LivingAppsService.createAnmeldungenEntry(data);
                  }
                  setDialogOpen(false);
                  loadData();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Table Components
function KurseTable({ kurse, getDozentName, getRaumName, formatDate, onEdit, onDelete }: {
  kurse: Kurse[];
  getDozentName: (url?: string) => string;
  getRaumName: (url?: string) => string;
  formatDate: (date?: string) => string;
  onEdit: (item: Kurse) => void;
  onDelete: (id: string) => void;
}) {
  if (kurse.length === 0) {
    return <EmptyState message="Noch keine Kurse vorhanden" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead className="hidden sm:table-cell">Dozent</TableHead>
            <TableHead className="hidden md:table-cell">Raum</TableHead>
            <TableHead>Zeitraum</TableHead>
            <TableHead className="hidden lg:table-cell">Max. TN</TableHead>
            <TableHead className="hidden sm:table-cell">Preis</TableHead>
            <TableHead className="w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kurse.map(kurs => (
            <TableRow key={kurs.record_id}>
              <TableCell className="font-medium">{kurs.fields.titel}</TableCell>
              <TableCell className="hidden sm:table-cell">{getDozentName(kurs.fields.dozent)}</TableCell>
              <TableCell className="hidden md:table-cell">{getRaumName(kurs.fields.raum)}</TableCell>
              <TableCell>
                <span className="text-sm">{formatDate(kurs.fields.startdatum)}</span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className="text-sm">{formatDate(kurs.fields.enddatum)}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{kurs.fields.max_teilnehmer || '-'}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {kurs.fields.preis ? `${kurs.fields.preis.toFixed(2)} €` : '-'}
              </TableCell>
              <TableCell>
                <ActionButtons item={kurs} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DozentenTable({ dozenten, onEdit, onDelete }: {
  dozenten: Dozenten[];
  onEdit: (item: Dozenten) => void;
  onDelete: (id: string) => void;
}) {
  if (dozenten.length === 0) {
    return <EmptyState message="Noch keine Dozenten vorhanden" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead className="hidden sm:table-cell">Telefon</TableHead>
            <TableHead className="hidden md:table-cell">Fachgebiet</TableHead>
            <TableHead className="w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dozenten.map(dozent => (
            <TableRow key={dozent.record_id}>
              <TableCell className="font-medium">{dozent.fields.name}</TableCell>
              <TableCell>{dozent.fields.email}</TableCell>
              <TableCell className="hidden sm:table-cell">{dozent.fields.phone || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{dozent.fields.fachgebiet || '-'}</TableCell>
              <TableCell>
                <ActionButtons item={dozent} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TeilnehmerTable({ teilnehmer, formatDate, onEdit, onDelete }: {
  teilnehmer: Teilnehmer[];
  formatDate: (date?: string) => string;
  onEdit: (item: Teilnehmer) => void;
  onDelete: (id: string) => void;
}) {
  if (teilnehmer.length === 0) {
    return <EmptyState message="Noch keine Teilnehmer vorhanden" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead className="hidden sm:table-cell">Telefon</TableHead>
            <TableHead className="hidden md:table-cell">Geburtsdatum</TableHead>
            <TableHead className="w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teilnehmer.map(tn => (
            <TableRow key={tn.record_id}>
              <TableCell className="font-medium">{tn.fields.name}</TableCell>
              <TableCell>{tn.fields.email}</TableCell>
              <TableCell className="hidden sm:table-cell">{tn.fields.phone || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(tn.fields.geburtsdatum)}</TableCell>
              <TableCell>
                <ActionButtons item={tn} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RaeumeTable({ raeume, onEdit, onDelete }: {
  raeume: Raeume[];
  onEdit: (item: Raeume) => void;
  onDelete: (id: string) => void;
}) {
  if (raeume.length === 0) {
    return <EmptyState message="Noch keine Räume vorhanden" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Raumname</TableHead>
            <TableHead>Gebäude</TableHead>
            <TableHead>Kapazität</TableHead>
            <TableHead className="w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {raeume.map(raum => (
            <TableRow key={raum.record_id}>
              <TableCell className="font-medium">{raum.fields.raumname}</TableCell>
              <TableCell>{raum.fields.gebaeude || '-'}</TableCell>
              <TableCell>{raum.fields.kapazitaet || '-'}</TableCell>
              <TableCell>
                <ActionButtons item={raum} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AnmeldungenTable({ anmeldungen, getTeilnehmerName, getKursTitel, formatDate, onEdit, onDelete, onToggleBezahlt }: {
  anmeldungen: Anmeldungen[];
  getTeilnehmerName: (url?: string) => string;
  getKursTitel: (url?: string) => string;
  formatDate: (date?: string) => string;
  onEdit: (item: Anmeldungen) => void;
  onDelete: (id: string) => void;
  onToggleBezahlt: (item: Anmeldungen) => void;
}) {
  if (anmeldungen.length === 0) {
    return <EmptyState message="Noch keine Anmeldungen vorhanden" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teilnehmer</TableHead>
            <TableHead>Kurs</TableHead>
            <TableHead className="hidden sm:table-cell">Anmeldedatum</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anmeldungen.map(anm => (
            <TableRow key={anm.record_id}>
              <TableCell className="font-medium">{getTeilnehmerName(anm.fields.teilnehmer)}</TableCell>
              <TableCell>{getKursTitel(anm.fields.kurs)}</TableCell>
              <TableCell className="hidden sm:table-cell">{formatDate(anm.fields.anmeldedatum)}</TableCell>
              <TableCell>
                <Badge
                  variant={anm.fields.bezahlt ? 'default' : 'secondary'}
                  className={`cursor-pointer ${anm.fields.bezahlt ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'} text-success-foreground`}
                  onClick={() => onToggleBezahlt(anm)}
                >
                  {anm.fields.bezahlt ? 'Bezahlt' : 'Offen'}
                </Badge>
              </TableCell>
              <TableCell>
                <ActionButtons item={anm} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Shared Components
function ActionButtons<T extends { record_id: string }>({ item, onEdit, onDelete }: {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Löschen bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(item.record_id)} className="bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}

// Form Components
function KursForm({ dozenten, raeume, editingItem, onSubmit }: {
  dozenten: Dozenten[];
  raeume: Raeume[];
  editingItem: Kurse | null;
  onSubmit: (data: Kurse['fields']) => void;
}) {
  const [formData, setFormData] = useState<Kurse['fields']>(
    editingItem?.fields || { titel: '', startdatum: '', enddatum: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titel">Titel *</Label>
        <Input
          id="titel"
          value={formData.titel || ''}
          onChange={e => setFormData({...formData, titel: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="beschreibung">Beschreibung</Label>
        <Textarea
          id="beschreibung"
          value={formData.beschreibung || ''}
          onChange={e => setFormData({...formData, beschreibung: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startdatum">Startdatum *</Label>
          <Input
            id="startdatum"
            type="date"
            value={formData.startdatum || ''}
            onChange={e => setFormData({...formData, startdatum: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enddatum">Enddatum *</Label>
          <Input
            id="enddatum"
            type="date"
            value={formData.enddatum || ''}
            onChange={e => setFormData({...formData, enddatum: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_teilnehmer">Max. Teilnehmer</Label>
          <Input
            id="max_teilnehmer"
            type="number"
            value={formData.max_teilnehmer || ''}
            onChange={e => setFormData({...formData, max_teilnehmer: e.target.value ? Number(e.target.value) : undefined})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preis">Preis (EUR)</Label>
          <Input
            id="preis"
            type="number"
            step="0.01"
            value={formData.preis || ''}
            onChange={e => setFormData({...formData, preis: e.target.value ? Number(e.target.value) : undefined})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dozent">Dozent *</Label>
        <Select
          value={extractRecordId(formData.dozent) || ''}
          onValueChange={v => setFormData({...formData, dozent: createRecordUrl(APP_IDS.DOZENTEN, v)})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dozent auswählen" />
          </SelectTrigger>
          <SelectContent>
            {dozenten.map(d => (
              <SelectItem key={d.record_id} value={d.record_id}>{d.fields.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="raum">Raum</Label>
        <Select
          value={extractRecordId(formData.raum) || ''}
          onValueChange={v => setFormData({...formData, raum: v ? createRecordUrl(APP_IDS.RAEUME, v) : undefined})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Raum auswählen" />
          </SelectTrigger>
          <SelectContent>
            {raeume.map(r => (
              <SelectItem key={r.record_id} value={r.record_id}>
                {r.fields.raumname} {r.fields.gebaeude ? `(${r.fields.gebaeude})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {editingItem ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DozentForm({ editingItem, onSubmit }: {
  editingItem: Dozenten | null;
  onSubmit: (data: Dozenten['fields']) => void;
}) {
  const [formData, setFormData] = useState<Dozenten['fields']>(
    editingItem?.fields || { name: '', email: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fachgebiet">Fachgebiet</Label>
        <Input
          id="fachgebiet"
          value={formData.fachgebiet || ''}
          onChange={e => setFormData({...formData, fachgebiet: e.target.value})}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {editingItem ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function TeilnehmerForm({ editingItem, onSubmit }: {
  editingItem: Teilnehmer | null;
  onSubmit: (data: Teilnehmer['fields']) => void;
}) {
  const [formData, setFormData] = useState<Teilnehmer['fields']>(
    editingItem?.fields || { name: '', email: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="geburtsdatum">Geburtsdatum</Label>
        <Input
          id="geburtsdatum"
          type="date"
          value={formData.geburtsdatum || ''}
          onChange={e => setFormData({...formData, geburtsdatum: e.target.value})}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {editingItem ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function RaumForm({ editingItem, onSubmit }: {
  editingItem: Raeume | null;
  onSubmit: (data: Raeume['fields']) => void;
}) {
  const [formData, setFormData] = useState<Raeume['fields']>(
    editingItem?.fields || { raumname: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="raumname">Raumname *</Label>
        <Input
          id="raumname"
          value={formData.raumname || ''}
          onChange={e => setFormData({...formData, raumname: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gebaeude">Gebäude</Label>
        <Input
          id="gebaeude"
          value={formData.gebaeude || ''}
          onChange={e => setFormData({...formData, gebaeude: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kapazitaet">Kapazität</Label>
        <Input
          id="kapazitaet"
          type="number"
          value={formData.kapazitaet || ''}
          onChange={e => setFormData({...formData, kapazitaet: e.target.value ? Number(e.target.value) : undefined})}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {editingItem ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function AnmeldungForm({ teilnehmer, kurse, editingItem, onSubmit }: {
  teilnehmer: Teilnehmer[];
  kurse: Kurse[];
  editingItem: Anmeldungen | null;
  onSubmit: (data: Anmeldungen['fields']) => void;
}) {
  const [formData, setFormData] = useState<Anmeldungen['fields']>(
    editingItem?.fields || { anmeldedatum: new Date().toISOString().split('T')[0], bezahlt: false }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teilnehmer">Teilnehmer *</Label>
        <Select
          value={extractRecordId(formData.teilnehmer) || ''}
          onValueChange={v => setFormData({...formData, teilnehmer: createRecordUrl(APP_IDS.TEILNEHMER, v)})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Teilnehmer auswählen" />
          </SelectTrigger>
          <SelectContent>
            {teilnehmer.map(t => (
              <SelectItem key={t.record_id} value={t.record_id}>{t.fields.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kurs">Kurs *</Label>
        <Select
          value={extractRecordId(formData.kurs) || ''}
          onValueChange={v => setFormData({...formData, kurs: createRecordUrl(APP_IDS.KURSE, v)})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kurs auswählen" />
          </SelectTrigger>
          <SelectContent>
            {kurse.map(k => (
              <SelectItem key={k.record_id} value={k.record_id}>{k.fields.titel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="anmeldedatum">Anmeldedatum *</Label>
        <Input
          id="anmeldedatum"
          type="date"
          value={formData.anmeldedatum || ''}
          onChange={e => setFormData({...formData, anmeldedatum: e.target.value})}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="bezahlt"
          checked={formData.bezahlt || false}
          onCheckedChange={checked => setFormData({...formData, bezahlt: checked === true})}
        />
        <Label htmlFor="bezahlt" className="cursor-pointer">Bezahlt</Label>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Abbrechen</Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {editingItem ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogFooter>
    </form>
  );
}
