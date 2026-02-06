import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Camera, Paperclip } from 'lucide-react';
import '../styles/pages.css';
import {
  DUMMY_MEDICINES,
  Pharmacy,
  AppScreen,
  AuthPromptModal,
  DUMMY_PROFESSIONALS,
} from '../utils/baseComponents';
import BookingModal from './BookingModal';
import { pharmacyAPI } from '../utils/api';

interface PharmacyPageProps {
  onBack: () => void;
  user?: any;
  onNavigate?: (screen: AppScreen) => void;
}

export function PharmacyPage({ onBack, user, onNavigate }: PharmacyPageProps) {
  const isLoggedIn = Boolean(user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Rayon de la terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance en km
    return d;
  };

  const availableLocations = useMemo(() => {
    if (!selectedMedicine) return [];
    let locations = pharmacies.filter(ph => ph.availableMedicines.includes(selectedMedicine));
    if (userLocation) {
      locations = locations.map(ph => ({
        ...ph,
        distance: ph.lat && ph.lng ? calculateDistance(userLocation.lat, userLocation.lng, ph.lat, ph.lng) : ph.distance || 0
      }));
    }
    return locations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [selectedMedicine, userLocation, pharmacies]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default Lomé
          setUserLocation({ lat: 6.1725, lng: 1.2314 });
        }
      );
    } else {
      setUserLocation({ lat: 6.1725, lng: 1.2314 });
    }
  }, []);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const result = await pharmacyAPI.getPharmacies();
        if (result.pharmacies) {
          setPharmacies(result.pharmacies);
        }
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
        // Fallback to dummy data
        setPharmacies([]);
      }
    };
    fetchPharmacies();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      const filtered = DUMMY_MEDICINES.filter(med =>
        med.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const takePhoto = () => {
    // Simulate taking photo
    alert('Fonction photo non implémentée - utiliserait camera API');
  };

  const callLocation = (phone?: string) => {
    if (!phone) alert('Numéro non disponible');
    else window.location.href = `tel:${phone}`;
  };

  const LocationCard: React.FC<{ location: Pharmacy }> = ({ location }) => {
    const [expanded, setExpanded] = useState(false);
    const [localSelectedProf, setLocalSelectedProf] = useState<any>(null);
    const [isLocalBookingOpen, setIsLocalBookingOpen] = useState(false);

    // trouver les professionnels qui ont cette clinique dans leur liste de cliniques
    const doctorsAtLocation = DUMMY_PROFESSIONALS.filter(p => (p.clinics || []).some(c => c.name === location.name || c.id === location.id));

    return (
      <div className="bg-white shadow-md p-4 border-transparent hover:border-teal-500 border-l-4 rounded-xl w-full transition">
        <div className={`avatar-wrap pharmacie ${location.isOnCall ? 'oncall' : ''}`}>
          <div className="avatar-initials">{location.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}</div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-800">{location.name} <span className="text-gray-500 text-sm">• {doctorsAtLocation.length} praticien(s)</span></div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" /> {location.address} • {location.distance} km
              </div>
              <div className="mt-2 text-xs">
                {doctorsAtLocation.slice(0,2).map(d => (
                  <div key={d.id} className="inline-block bg-gray-100 mr-2 px-2 py-0.5 rounded text-xs">{d.name} • {d.specialty}</div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className={`text-xs ${location.isOnCall ? 'text-red-600' : 'text-green-600'}`}>
                • {location.isOnCall ? 'De garde' : 'Ouvert'}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => callLocation('22812345678')} className="bg-teal-500 px-3 py-1 rounded-lg text-white text-sm"><Phone className="inline mr-1 w-4 h-4" /> Appeler</button>
                <button type="button" onClick={() => {
                  let url = `https://maps.google.com/?q=${encodeURIComponent(location.address)}`;
                  if (location.lat && location.lng) {
                    if (userLocation) {
                      url = `https://maps.google.com/?saddr=${userLocation.lat},${userLocation.lng}&daddr=${location.lat},${location.lng}`;
                    } else {
                      url = `https://maps.google.com/?q=${location.lat},${location.lng}`;
                    }
                  }
                  window.open(url, '_blank');
                }} className="bg-blue-500 px-3 py-1 rounded-lg text-white text-sm"><MapPin className="inline mr-1 w-4 h-4" /> Localisation</button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-teal-600 text-sm">{expanded ? 'Masquer les praticiens' : 'Voir les praticiens'}</button>
            {expanded && (
              <div className="space-y-3 mt-3">
                {doctorsAtLocation.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <div className="font-medium">{doc.name} <span className="text-gray-500 text-xs">• {doc.specialty}</span></div>
                      <div className="text-gray-500 text-xs">{doc.schedule ? doc.schedule.slice(0,2).join(' • ') : ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setLocalSelectedProf(doc); if (!isLoggedIn) setIsAuthModalOpen(true); else { setIsLocalBookingOpen(true); } }} className="bg-teal-500 px-3 py-1 rounded text-white text-sm">Prendre RDV</button>
                    </div>
                  </div>
                ))}
                {doctorsAtLocation.length === 0 && (<div className="text-gray-500 text-sm">Aucun praticien référencé pour ce lieu.</div>)}
              </div>
            )}
          </div>
        </div>

        {localSelectedProf && (
          <BookingModal
            isOpen={isLocalBookingOpen}
            professional={localSelectedProf}
            mode={'cabinet'}
            onClose={() => { setIsLocalBookingOpen(false); setLocalSelectedProf(null); }}
            onBook={(data) => { console.log('booking from clinic', data); setIsLocalBookingOpen(false); setLocalSelectedProf(null); }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 pb-10 min-h-screen">
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 shadow-lg px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 text-white transition">
            <ArrowLeft className="w-5 h-5" /> <span>Retour</span>
          </button>
          <h1 className="font-bold text-white text-2xl">Pharmacie</h1>
          <div />
        </div>
      </div>

      <div className="space-y-6 mt-6 px-6">
        <div className="bg-white shadow p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un médicament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && suggestions.length > 0) { setSelectedMedicine(suggestions[0]); setSearchQuery(''); } }}
                className="pl-10 search-input"
                autoFocus={false}
              />
            </div>
            <button onClick={() => { if (suggestions.length > 0) { setSelectedMedicine(suggestions[0]); setSearchQuery(''); } }} className="bg-teal-500 px-4 py-2 rounded-lg text-white">Rechercher</button>
          </div>
          {searchQuery && (
            <div className="mt-3 max-h-40 overflow-y-auto">
              {suggestions.map(med => (
                <button
                  key={med}
                  onClick={() => { setSelectedMedicine(med); setSearchQuery(''); }}
                  className="hover:bg-gray-100 p-2 rounded w-full text-left"
                >
                  {med}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedMedicine && (
          <div className="bg-white shadow p-4 rounded-xl">
            <h3 className="mb-3 font-semibold">Disponibilité de {selectedMedicine}</h3>
            <div className="space-y-3">
              {availableLocations.map(location => <LocationCard key={location.id} location={location} />)}
              {availableLocations.length === 0 && (
                <div className="p-4 border border-dashed rounded-xl text-gray-500 text-center">Aucun lieu trouvé pour ce médicament.</div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="mb-3 font-semibold">Ajouter une ordonnance</h3>
          <div className="flex gap-3">
            <label className="flex-1">
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex justify-center items-center gap-2 bg-teal-50 hover:bg-teal-100 py-3 border-2 border-teal-300 hover:border-teal-500 border-dashed rounded-lg w-full text-teal-700 transition">
                <Paperclip className="w-5 h-5" /> Joindre fichier
              </button>
            </label>
            <button onClick={takePhoto} className="flex flex-1 justify-center items-center gap-2 bg-teal-500 py-3 rounded-lg text-white">
              <Camera className="w-5 h-5" /> Prendre photo
            </button>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-3">
              <p className="text-gray-600 text-sm">Fichiers joints:</p>
              <ul className="text-sm">
                {uploadedFiles.map((f, i) => <li key={i}>{f.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => { setIsAuthModalOpen(false); onNavigate?.('login'); }}
        onRegister={() => { setIsAuthModalOpen(false); onNavigate?.('registration'); }}
      />
    </div>
  );
}