import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, FormField, SaveButton } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getLocation, updateLocation, createLocation } from '@/services/dataService';
import type { LocationInfo } from '@/types';

export function AdminLocation() {
  const { showToast } = useToast();
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    location_name: 'Hyderabad',
    address: '',
    google_maps_url: '',
    latitude: '',
    longitude: '',
    map_embed_url: '',
  });

  useEffect(() => {
    getLocation().then((loc) => {
      if (loc) {
        setLocation(loc);
        setForm({
          location_name: loc.location_name,
          address: loc.address || '',
          google_maps_url: loc.google_maps_url || '',
          latitude: loc.latitude || '',
          longitude: loc.longitude || '',
          map_embed_url: loc.map_embed_url || '',
        });
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (location) {
      const { error } = await updateLocation(location.id, form);
      setSaving(false);
      showToast(error ? 'Failed to save' : 'Location updated', error ? 'error' : 'success');
    } else {
      const { error } = await createLocation(form);
      setSaving(false);
      showToast(error ? 'Failed to save' : 'Location saved', error ? 'error' : 'success');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Location Management" description="Update your location and map settings" />
      <AdminCard>
        <div className="space-y-5">
          <FormField label="Location Name" required>
            <input className="input-field" value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
          </FormField>
          <FormField label="Address">
            <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" />
          </FormField>
          <FormField label="Google Maps URL">
            <input className="input-field" value={form.google_maps_url} onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })} placeholder="https://maps.google.com/..." />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Latitude">
              <input className="input-field" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="17.3850" />
            </FormField>
            <FormField label="Longitude">
              <input className="input-field" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="78.4867" />
            </FormField>
          </div>
          <FormField label="Map Embed URL">
            <textarea rows={3} className="input-field resize-none" value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} placeholder="Google Maps embed iframe src URL" />
            <p className="text-xs text-slate-500 mt-1">Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe</p>
          </FormField>
          <div className="flex justify-end">
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
